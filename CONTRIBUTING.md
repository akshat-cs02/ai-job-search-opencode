# Contributing

This is a **community port** of [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) adapted for [opencode](https://opencode.ai).

**This repo is a fork.** Upstream improvements should go to the original repo. This port focuses on keeping the opencode adaptation working.

## What this port does differently

- Commands and skills are in `.opencode/` instead of `.claude/`
- Config is in `opencode.json` instead of `.claude/settings.json`
- Agent instructions are in `AGENTS.md` instead of `CLAUDE.md`
- Core logic (LaTeX, Python tools, portal CLIs) is the same as upstream

## What kind of PRs are welcome

- **Opencode compatibility fixes** — if a new opencode version changes the command/skill format
- **Bug fixes** to the port layer (wrong paths, broken references)
- **Docs improvements** for opencode users specifically

## What should go to upstream instead

- **New features** to the core workflow (new commands, better evaluation logic)
- **Market-specific portal skills** (the original repo welcomes these in forks)
- **Changes to the LaTeX templates, Python tools, or portal CLI code** — unless they specifically relate to the opencode adaptation

## Running checks

```bash
python tools/lint_skills.py
python tools/security_guards.py
python -m unittest discover -s tests -t .
```

## Practical notes

- **Portal-skill contract**: `search`/`detail` commands, `--format json|table|plain`, stderr JSON errors with exit 1, backoff on 429/5xx, zero runtime dependencies by default. See `/add-portal`'s spec and `linkedin-search` as the reference implementation.
- **Personal-use boundaries**: portal skills that touch ToS-restricted sources carry a prominent personal-use-only warning, and CI deliberately makes no live portal requests. Don't "fix" that.
- **LaTeX changes**: both templates must compile (`lualatex` for the CV, `xelatex` for the cover letter) and hold their exact page counts. CI smoke-checks this.

Questions and proposals are welcome in [Discussions](https://github.com/MadsLorentzen/ai-job-search/discussions) - an Idea thread costs nothing and can save you building the wrong thing :-)

[#17]: https://github.com/MadsLorentzen/ai-job-search/issues/17
[#30]: https://github.com/MadsLorentzen/ai-job-search/issues/30
[#31]: https://github.com/MadsLorentzen/ai-job-search/issues/31
[#35]: https://github.com/MadsLorentzen/ai-job-search/issues/35
[#36]: https://github.com/MadsLorentzen/ai-job-search/issues/36
[#37]: https://github.com/MadsLorentzen/ai-job-search/issues/37
[#39]: https://github.com/MadsLorentzen/ai-job-search/issues/39
[#41]: https://github.com/MadsLorentzen/ai-job-search/issues/41
[#43]: https://github.com/MadsLorentzen/ai-job-search/issues/43
[#44]: https://github.com/MadsLorentzen/ai-job-search/issues/44
[#49]: https://github.com/MadsLorentzen/ai-job-search/issues/49
[#52]: https://github.com/MadsLorentzen/ai-job-search/issues/52
[#54]: https://github.com/MadsLorentzen/ai-job-search/issues/54
[#55]: https://github.com/MadsLorentzen/ai-job-search/issues/55
[#56]: https://github.com/MadsLorentzen/ai-job-search/issues/56
[#59]: https://github.com/MadsLorentzen/ai-job-search/issues/59
[#60]: https://github.com/MadsLorentzen/ai-job-search/issues/60
[#63]: https://github.com/MadsLorentzen/ai-job-search/issues/63
[#64]: https://github.com/MadsLorentzen/ai-job-search/issues/64
[#66]: https://github.com/MadsLorentzen/ai-job-search/issues/66
[#67]: https://github.com/MadsLorentzen/ai-job-search/issues/67
[#68]: https://github.com/MadsLorentzen/ai-job-search/issues/68
[#72]: https://github.com/MadsLorentzen/ai-job-search/issues/72
[#73]: https://github.com/MadsLorentzen/ai-job-search/issues/73
[#75]: https://github.com/MadsLorentzen/ai-job-search/issues/75
[#76]: https://github.com/MadsLorentzen/ai-job-search/issues/76
[#155]: https://github.com/MadsLorentzen/ai-job-search/pull/155
[#162]: https://github.com/MadsLorentzen/ai-job-search/pull/162
[#165]: https://github.com/MadsLorentzen/ai-job-search/pull/165
