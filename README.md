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

## Why opencode?

The original runs on **Claude Code**, which requires a paid Claude subscription (or API credits). This port runs on **opencode** — a free, open-source AI coding agent:

| | Claude Code (original) | opencode (this port) |
|---|---|---|
| **Cost** | Paid (Claude Pro/Max or API credits) | **Free, open source (MIT)** |
| **Model choice** | Claude models only | Claude, GPT, Gemini, DeepSeek, Groq, Llama, local models via Ollama, etc. |
| **Code** | Closed source | Open source, community-driven |
| **Install** | Node/native installer, subscription required | Single binary / npm, no account needed |
| **CLI** | Slash commands | Slash commands (`/setup`, `/apply`, …) |

You get the **same job-search workflow** (profile setup, scraping, ranking, tailored CVs & cover letters, interview prep, application tracking) without paying for an agent subscription — bring your own free model (e.g. DeepSeek) and run the whole thing locally.

## Prerequisites

- [opencode](https://opencode.ai) (CLI)
- Python 3.10+
- [Bun](https://bun.sh) (for job search CLI tools)
- LaTeX distribution with `lualatex` and `xelatex`: [MiKTeX](https://miktex.org/) (Windows), [TeX Live](https://tug.org/texlive/), [MacTeX](https://tug.org/mactex/)
- Optional: `pdftotext` from [poppler](https://poppler.freedesktop.org/) for ATS verification

## Install opencode

opencode runs on macOS, Linux, and Windows. Pick one:

```bash
# macOS
brew install anomalyco/opencode/opencode

# Linux/macOS (curl)
curl -fsSL https://opencode.ai/install | bash

# Windows (PowerShell)
powershell -c "irm https://opencode.ai/install.ps1 | iex"

# Or via npm (all platforms)
npm install -g opencode-ai
```

Verify it works:

```bash
opencode --version
```

Configure a free model provider if you don't have one yet — see the
[opencode providers docs](https://opencode.ai/docs/providers/) (e.g. DeepSeek
for a free option). Then open it:

```bash
opencode
```

## Quick start

### 1. Clone

```bash
git clone https://github.com/akshat-cs02/ai-job-search-opencode.git
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

## Live demo

Real screenshots from the job-search CLI (no mockups):

<p align="center">
  <img src="screenshots/search-results.png" alt="Search results" width="80%">
</p>

<p align="center">
  <img src="screenshots/job-detail.png" alt="Job details" width="80%">
</p>

For the full walkthrough (search → detail → workflow overview) see [`docs/DEMO.md`](docs/DEMO.md).

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
