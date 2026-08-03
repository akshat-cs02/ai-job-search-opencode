#!/usr/bin/env bun
// Self-contained CLI for searching Remotive's public remote-jobs API.
// No external CLI framework and zero runtime dependencies — runs anywhere `bun`
// is available. Reads are unauthenticated (no API key).
//
// API: https://remotive.com/api/remote-jobs
//   Optional params: search (title/description), category, company_name, limit.
//   Response envelope: { "job-count": n, "jobs": [ { id, url, title,
//   company_name, category, tags, job_type, publication_date,
//   candidate_required_location, salary, description } ] }

import { apiGet, cleanHtml, writeError, type RemotiveJob } from "./helpers.js"

const API_BASE = "https://remotive.com/api/remote-jobs"

interface Flags {
  _: string[]
  [k: string]: unknown
}

const ALIAS: Record<string, string> = { q: "query", n: "limit" }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith("-")) {
      flags._.push(a)
      continue
    }
    const key = ALIAS[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
    const next = argv[i + 1]
    if (next !== undefined && !next.startsWith("-")) {
      flags[key] = next
      i++
    } else {
      flags[key] = true
    }
  }
  return flags
}

interface SearchOpts {
  query?: string
  category?: string
  limit: number
  format: "json" | "table" | "plain"
}

function buildQuery(o: SearchOpts): URLSearchParams {
  const p = new URLSearchParams()
  if (o.query) p.set("search", o.query)
  if (o.category) p.set("category", o.category)
  p.set("limit", String(o.limit))
  return p
}

function shortDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "—"
}

function renderTable(jobs: RemotiveJob[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => [j.title, j.company_name ?? "—", j.category ?? "—", shortDate(j.publication_date)])
  const widths = [38, 22, 22, 10]
  const fmt = (cells: string[]) =>
    cells.map((c, i) => c.slice(0, widths[i]).padEnd(widths[i])).join("  ")
  const header = fmt(["TITLE", "COMPANY", "CATEGORY", "DATE"])
  const body = rows.map(fmt)
  return [header, "-".repeat(header.length), ...body].join("\n")
}

function renderPlain(jobs: RemotiveJob[]): string {
  if (jobs.length === 0) return "No results."
  return jobs
    .map(
      (j) =>
        [
          j.title,
          `  ${j.company_name ?? "—"} · ${j.candidate_required_location ?? "Remote"} · ${shortDate(j.publication_date)}`,
          `  category: ${j.category ?? "—"} | type: ${j.job_type ?? "—"} | salary: ${j.salary ?? "—"}`,
          `  ${j.url}`,
        ].join("\n"),
    )
    .join("\n\n")
}

async function runSearch(o: SearchOpts): Promise<number> {
  try {
    // Remotive's API currently ignores `limit`/`page` and returns its default
    // page (~31 newest jobs), so we slice client-side to honor the requested cap.
    const env = await apiGet<{ "job-count"?: number; jobs: RemotiveJob[] }>(
      `${API_BASE}?${buildQuery(o).toString()}`,
    )
    const jobs = (env?.jobs ?? []).slice(0, o.limit)
    if (o.format === "table") {
      process.stdout.write(renderTable(jobs) + "\n")
    } else if (o.format === "plain") {
      process.stdout.write(renderPlain(jobs) + "\n")
    } else {
      process.stdout.write(JSON.stringify({ count: jobs.length, results: jobs }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

async function runDetail(idOrUrl: string, format: string): Promise<number> {
  try {
    // The list endpoint includes the full description, so a detail lookup is a
    // search that fetches all recent jobs and matches by numeric id or URL slug.
    const m = idOrUrl.match(/\/?(\d+)/)
    const id = m ? m[1] : null
    const env = await apiGet<{ jobs: RemotiveJob[] }>(`${API_BASE}?limit=100`)
    const job = env?.jobs?.find((j) => id && (String(j.id) === id || j.url.includes(id)))
    if (!job) {
      writeError(`no Remotive job found for "${idOrUrl}"`, "NOT_FOUND")
      return 1
    }
    if (format === "plain") {
      process.stdout.write(
        [
          job.title,
          `${job.company_name ?? "—"} · ${job.category ?? "—"}`,
          `Posted: ${shortDate(job.publication_date)}`,
          `Type: ${job.job_type ?? "—"}`,
          `Location: ${job.candidate_required_location ?? "Remote"}`,
          `Salary: ${job.salary ?? "—"}`,
          `Tags: ${(job.tags ?? []).join(", ") || "—"}`,
          ``,
          cleanHtml(job.description) ?? "",
        ].join("\n") + "\n",
      )
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}

async function main(argv: string[]): Promise<number> {
  const flags = parseFlags(argv)
  const sub = (flags._ as string[])[0] ?? "search"

  if (sub === "search") {
    return runSearch({
      query: typeof flags.query === "string" ? flags.query : undefined,
      category: typeof flags.category === "string" ? flags.category : undefined,
      limit: typeof flags.limit === "string" ? Math.min(Math.max(parseInt(flags.limit, 10) || 25, 1), 100) : 25,
      format: (flags.format as SearchOpts["format"]) || "plain",
    })
  }
  if (sub === "detail") {
    const target = (flags._ as string[])[1]
    if (!target) {
      writeError("usage: remotive-search detail <id-or-url> [--format json|plain]", "USAGE")
      return 1
    }
    return runDetail(target, (flags.format as string) || "plain")
  }
  if (sub === "--help" || sub === "-h" || sub === "help") {
    process.stdout.write(
      [
        "remotive-search — search Remotive's public remote-jobs API (no auth)",
        "",
        "USAGE",
        "  bun run src/cli.ts search [-q \"<keywords>\"] [--category <slug>] [-n <limit>] [--format json|table|plain]",
        "  bun run src/cli.ts detail <id-or-url> [--format json|plain]",
        "",
        "FLAGS",
        "  --query, -q <text>    Keyword search (title, description).",
        "  --category <slug>     Category slug (e.g. software-dev, design, data).",
        "  --limit, -n <n>       Max results (default 25, max 100).",
        "  --format <fmt>        json | table | plain (default plain).",
        "",
        "EXAMPLES",
        "  bun run src/cli.ts search -q \"python developer\" --format table",
        "  bun run src/cli.ts search --category software-dev -n 10 --format plain",
        "  bun run src/cli.ts detail https://remotive.com/remote-jobs/software-development/lead-developer-123",
        "",
      ].join("\n"),
    )
    return 0
  }
  writeError(`unknown subcommand "${sub}" (use search, detail, or help)`, "USAGE")
  return 1
}

process.exit(await main(process.argv.slice(2)))
