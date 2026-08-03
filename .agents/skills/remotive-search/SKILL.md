---
name: remotive-search
version: 1.0.0
description: >
  Use this skill to search live remote software / tech / design / data job listings
  via Remotive's public API, or to look up a specific posting. Remotive is a curated
  remote-first board that is startup-heavy — good for tech roles at early-stage and
  remote companies. No authentication, no API key, zero runtime dependencies. Trigger
  phrases: find a remote tech job, remote developer jobs, "are there any <tech role>
  remote jobs", look up this remotive job posting, startup jobs remote.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/remotive-search/cli/src/cli.ts *)
---

# Remotive Search Skill

Search live remote job listings from **[Remotive](https://remotive.com)** — a curated
remote-first job board with a strong startup and tech tilt. It queries Remotive's
**public JSON API** (`https://remotive.com/api/remote-jobs`) directly. No
authentication, no API key, and **zero runtime dependencies** — it runs with just `bun`.

> This is a worked example of the repo's job-portal-skill pattern for a **public
> JSON API**, like `freehire-search` and `linkedin-search`. Unlike the HTML-scraping
> portals, results are structured (title, company, category, tags, salary) rather
> than parsed from markup.

## ⚠️ Scope: remote-first, startup-leaning

Remotive is **remote-first** — nearly all postings are remote (its site is entirely
about remote work). It leans **tech/startup**: software, design, product, marketing,
data. Use it when the user wants **remote** roles, especially at startups — it pairs
well with `freehire-search` (broader geography) and `linkedin-search` (local).

## ℹ️ Hosted-service dependency (best-effort, no SLA)

This skill depends on a third-party hosted service, Remotive. Reads are **public and
unauthenticated** — the same zero-signup bar as `linkedin-search` and
`freehire-search`. Remotive is a long-standing, widely used board, but like any
third-party API it can rate-limit or change. The CLI fails gracefully on a 429/5xx
with retry/backoff, and an unreachable API exits non-zero with a clear error.

## When to use this skill

- Search for remote tech/startup job openings by keyword and/or category
- Filter by category (e.g. software-dev, design, data) and result count
- Get the full description of a specific Remotive posting by id or URL

## Commands

### Search job listings

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts search [-q "<keywords>"] [--category <slug>] [-n <limit>] [--format json|table|plain]
```

Flags:
- `--query <text>` / `-q <text>` — keyword search (matches title + description).
- `--category <slug>` — category slug, e.g. `software-dev`, `design`, `data`,
  `marketing`, `product`, `customer-support`. See live slugs at
  `https://remotive.com/api/remote-jobs/categories`. Optional.
- `--limit <n>` / `-n <n>` — max results (default 25, max 100).
- `--format json|table|plain` — output format (default `plain`).

### Fetch full job detail

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts detail <id-or-url> [--format json|plain]
```

`id` is the numeric `id` from a `search` result. You may also pass the full
`https://remotive.com/remote-jobs/<slug>` URL (the numeric id is extracted from it).
Returns the full (HTML-stripped) description, tags, category, type, location, salary.

## Usage examples

```bash
# Python remote roles, quick scan
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "python" --format table

# Software-dev postings, latest 15
bun run .agents/skills/remotive-search/cli/src/cli.ts search --category software-dev -n 15 --format table

# Full-stack roles at startups, JSON for processing
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "fullstack" --format json

# Full details for a specific job
bun run .agents/skills/remotive-search/cli/src/cli.ts detail https://remotive.com/remote-jobs/software-development/lead-developer-123 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `plain` | Default — readable listing for a human |
| `table` | Compact columnar scanning |
| `json` | Programmatic use, passing a result's `id` to `detail` |

Search JSON is `{ "count": n, "results": [...] }`; each result carries at least
`id`, `url`, `title`, `company_name`, `category`, `tags`, `job_type`,
`publication_date`, `candidate_required_location`, `salary`. All errors are written
to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with `1`.

## Notes

- Data is from Remotive's public API — no credentials required. This skill is
  **search + detail only**; it does not post, apply, or otherwise mutate anything.
- Remotive lists postings with up to ~24h delay (per their API docs). Freshness
  caveat applies to day-0 postings.
- Remotive's terms: automated retrieval of job listings for commercial use is
  discouraged; this skill is for the user's own job search (personal use), and
  non-commercial uses must link back to Remotive. Keep request volume low.
- `candidate_required_location` is mostly `null`/"Worldwide" for remote roles;
  don't read a specific location into it.
