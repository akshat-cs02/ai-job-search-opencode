---
description: Search multiple job portals for positions matching your profile, deduplicate results, and present them sorted by fit score.
---

You are orchestrating a multi-portal job search. Your goal is to find live postings matching the candidate's profile, deduplicate across portals, present them sorted by quick-fit score, and prepare the state for `/rank` and `/apply`.

Follow these steps **in order**.

---

## Step 0: Preflight

1. Read `.opencode/skills/job-scraper/search-queries.md` to get the search configuration (role types, skills, locations, portal list).
2. Read `job_scraper/seen_jobs.json` to get the dedup set. If missing, start with `{}`.
3. Determine which portal CLI tools are available. Glob `.agents/skills/*/SKILL.md` and read their `name` fields, or just try to run each one. The shipped portals are:
   - `jobbank-search`, `jobdanmark-search`, `jobindex-search`, `jobnet-search` (Denmark)
   - `linkedin-search` (country-agnostic)
   - `freehire-search` (country-agnostic, tech-focused)
4. State the plan: how many portals, which queries, the dedup window.

---

## Step 1: Execute Searches

Run each available portal's search CLI with queries from `search-queries.md`:

```bash
bun run .agents/skills/<portal>/cli/src/cli.ts search -q "<query>" --location "<location>" --jobage 14 --limit 50 --format json
```

For portals without a CLI, use WebSearch with `site:<portal>` queries as a fallback.

Collect all results with their: `id`, `title`, `company`, `location`, `date`, `url`.

---

## Step 2: Deduplicate

Group results by company + role title (fuzzy match, lowercase). Within a group, keep the portal entry with the most complete fields. Store the dedup keys in `job_scraper/seen_jobs.json`.

---

## Step 3: Quick Fit Assessment

For each unique posting, do a lightweight fit check using the scoring rubric from `04-job-evaluation.md`. Score: strong/medium/weak.

---

## Step 4: Present Results

Paste a table of unique jobs grouped by fit level:

| # | Fit | Title | Company | Location | Portal | Date |
|---|-----|-------|---------|----------|--------|------|

Then ask: "Want to run `/rank` to batch-score these, or pick one for `/apply`?"
