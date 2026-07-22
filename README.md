<p align="center">
  <img src="assets/mascot/pip_flight_loop.gif" alt="Pip, the courier bird" width="200">
</p>

# AI Job Search — Opencode Port

*The job search that runs on your machine. Now for [opencode](https://opencode.ai).*

This is a community port of [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) — an AI-powered job application framework — adapted from **Claude Code** to **opencode**.

**All credit for the original framework, workflow design, and tooling goes to [Mads Lorentzen](https://github.com/MadsLorentzen).** He built this to run his own job search, landed an AI Engineer role in June 2026 (69 applications, 20 interviews), and open-sourced it. This port simply re-wires the command/skill layer to work with opencode instead of Claude Code. The core logic (LaTeX templates, Python tools, portal CLI skills) is unchanged.

> Note: This is an independent open-source project and is not affiliated with, endorsed by, or maintained by Anthropic or Mads Lorentzen.

## What changed

| Original | This port |
|----------|-----------|
| `.claude/commands/` | `.opencode/commands/` |
| `.claude/skills/` | `.opencode/skills/` |
| `.claude/settings.json` | `opencode.json` |
| `CLAUDE.md` | `AGENTS.md` + skill files |
| Claude Code slash commands | Opencode commands |

The portal CLI tools (`.agents/skills/`), LaTeX templates (`cv/`, `cover_letters/`), Python tools (`tools/`), and all other assets are **unchanged** from the original.

## Prerequisites

- [opencode](https://opencode.ai) (CLI)
- Python 3.10+
- [Bun](https://bun.sh) (for job search CLI tools)
- LaTeX distribution with `lualatex` and `xelatex`: [MiKTeX](https://miktex.org/) (Windows), [TeX Live](https://tug.org/texlive/), [MacTeX](https://tug.org/mactex/)
- Optional: `pdftotext` from [poppler](https://poppler.freedesktop.org/) for ATS verification

## Quick start

### 1. Clone

```bash
git clone <your-fork-url>
cd ai-job-search-opencode
```

### 2. Install job search tools

```powershell
$tools = @("jobbank-search", "jobdanmark-search", "jobindex-search", "jobnet-search", "linkedin-search", "freehire-search")
foreach ($tool in $tools) {
  Push-Location ".agents/skills/$tool/cli"
  bun install
  Pop-Location
}
```

### 3. Set up your profile

```bash
opencode
# Then inside opencode:
/setup
```

### 4. Search for jobs

```
/scrape
```

### 5. Apply to a job

```
/apply https://jobindex.dk/job/1234567
```

## Commands

- `/setup` — Onboard your profile
- `/scrape` — Search job portals
- `/apply <url>` — Apply to a job
- `/rank` — Batch-score scraped jobs
- `/interview` — Prep for an interview
- `/outcome` — Record application results
- `/expand` — Enrich your profile
- `/upskill` — Identify skill gaps
- `/add-template` — Register custom LaTeX template
- `/add-portal` — Generate job portal skill
- `/html-report` — Generate dashboard
- `/notion-sync` — Sync to Notion
- `/reset` — Wipe profile data

## Acknowledgments

- **[Mads Lorentzen](https://github.com/MadsLorentzen)** — original creator of ai-job-search framework
- **[Mikkel Krogholm](https://github.com/mikkelkrogsholm)** — job search CLI skills
- Built with [Claude Code](https://claude.com/claude-code) by [Anthropic](https://anthropic.com), ported to [opencode](https://opencode.ai)

## License

MIT (same as original)
