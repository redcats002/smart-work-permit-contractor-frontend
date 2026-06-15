---
name: setup-ai
description: Initializes AI agent configuration for a project by creating the required .agents/ directory structure and symlinking it into agent-specific directories (.github/, .gemini/, .claude/). Also symlinks AGENTS.md to CLAUDE.md, GEMINI.md, and .github/copilot-instructions.md. Use this skill whenever the user says /setup-ai, "setup ai", "init ai config", or wants to set up AGENTS.md symlinks across AI tool directories.
---

## Starter prompt for agents (require init /.agents/, AGENTS.md)

Create symlink from @.agents/ into each agent directory

- .github/skills
- .gemini/skills
- .claude/skills

Create symlink from AGENTS.md to

- CLAUDE.md
- GEMINI.md
- .github/copilot-instructions.md
