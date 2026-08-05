## Starter prompt for agents (require init /.agents/, AGENTS.md)

Create symlink from @.agents/ into each agent directory

- .github/skills
- .gemini/skills
- .claude/skills

Create symlink from AGENTS.md to

- CLAUDE.md
- GEMINI.md
- .github/copilot-instructions.md

Create `opencode.json` in project root if not exists

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md"],
  "skills": {
    "paths": [".opencode/skills", ".claude/skills", ".agents/skills"]
  },
  "plugin": []
}
```
