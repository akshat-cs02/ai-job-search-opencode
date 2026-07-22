# AI Job Search — Opencode Port

This is an opencode port of [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) — all credit to the original author.

## Workflow

This workspace uses opencode's command and skill system. All custom commands
are registered in `opencode.json` and their implementations live under
`.opencode/commands/`. Skills live under `.opencode/skills/`.

## Quick Start

1. Run `/setup` to onboard your profile
2. Run `/scrape` to search for jobs
3. Run `/apply <url>` to apply to a specific posting

## File Structure

```
ai-job-search-opencode/
├── opencode.json                  # Config: commands, permissions, agents
├── AGENTS.md                      # This file — agent entrypoint
├── .opencode/
│   ├── commands/                  # /setup, /apply, /scrape, etc.
│   └── skills/                    # job-application-assistant, job-scraper, upskill
├── .agents/skills/                # Portal CLI tools (unchanged from original)
├── cv/                            # LaTeX CV templates
├── cover_letters/                 # Cover letter LaTeX templates + class
├── documents/                     # Your career documents (gitignored)
├── templates/                     # Custom templates (via /add-template)
├── job_scraper/                   # Scraper state
├── tools/                         # Utility scripts
└── job_search_tracker.csv         # Application tracking
```

## Important

- All Claude Code-specific references in the original commands have been
  ported to opencode format. File paths use `.opencode/` instead of `.claude/`.
- The original repo's `CLAUDE.md` content is split across the skill files
  under `.opencode/skills/job-application-assistant/`.
- Portal CLI tools in `.agents/skills/` are unchanged and work the same way.
