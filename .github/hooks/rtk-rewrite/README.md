---
name: 'RTK Rewrite'
description: 'Intercepts Copilot agent tool calls and rewrites shell commands to use rtk for 60-90% token savings'
tags: ['rtk', 'token-savings', 'pre-tool-use', 'optimization']
---

# RTK Rewrite Hook

Intercepts every tool call made by the GitHub Copilot coding agent and rewrites shell commands to run through `rtk` — a CLI proxy that compresses and filters command output, saving 60–90% of tokens per command.

## Overview

Copilot coding agents consume tokens not just for reasoning but also for reading command output. Long outputs from tools like `git`, `ls`, `cat`, `grep`, and build commands can exhaust context quickly. This hook transparently wraps every bash command with `rtk` before execution, so the agent sees compact, signal-focused output without needing to change any prompts or instructions.

- **`git status`** → filtered to changed files only
- **`ls -la`** → summarized file listing
- **`cat file.ts`** → truncated to relevant lines
- **`grep ...`** → de-duplicated matches

## Features

- **Automatic interception**: Hooks into `preToolUse` to rewrite commands before they run
- **Transparent operation**: The agent does not need to know about `rtk` — rewrites happen silently
- **Broad coverage**: Applies to all bash tool calls across the entire session
- **Fast timeout**: 5-second timeout ensures the hook never meaningfully delays execution
- **Zero configuration**: Works out of the box once `rtk` is installed

## Requirements

`rtk` must be installed and available on `PATH` in the agent's execution environment. Install it globally:

```bash
npm install -g @rtk/cli
# or
bun add -g @rtk/cli
```

Verify installation:

```bash
rtk --version
```

## Installation

1. Copy the hook folder to your repository:

   ```bash
   cp -r hooks/rtk-rewrite .github/hooks/
   ```

2. Ensure `rtk` is installed in the environment where the agent runs (see Requirements above).

3. Commit the hook configuration to your repository's default branch.

## Configuration

The hook is configured in `hooks.json` to intercept all tool calls at the `preToolUse` stage:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "rtk hook copilot",
        "cwd": ".",
        "timeoutSec": 5
      }
    ]
  }
}
```

### How `rtk hook copilot` works

`rtk hook copilot` reads the pending tool call from the Copilot hook context, rewrites any `bash` command to prepend `rtk`, and outputs the modified tool call. The agent runtime replaces the original command with the rewritten one before execution.

## How It Works

1. The Copilot agent issues a bash tool call (e.g., `git log -20`)
2. The `preToolUse` hook fires before the command executes
3. `rtk hook copilot` intercepts the call and rewrites it to `rtk git log -20`
4. The agent runtime executes the rewritten command
5. `rtk` runs the original command, filters/compresses the output, and returns it to the agent
6. Token usage is reduced by 60–90% compared to raw output

## Token Savings

Use `rtk` meta commands to monitor savings:

```bash
rtk gain              # Current session token savings dashboard
rtk gain --history    # Per-command savings history
rtk discover          # Find commands that could benefit from rtk
```

## Pairing with Other Hooks

This hook pairs with the **Secrets Scanner** and **Common Session Announcer** hooks. Since it operates at `preToolUse`, it runs independently from `sessionStart`/`sessionEnd` hooks and does not interfere with them.

For maximum benefit, install all three hooks together — `rtk-rewrite` keeps token usage low throughout the session, while other hooks handle safety and notifications at session boundaries.

## Disabling

To temporarily disable command rewriting:

- Remove the `preToolUse` entry from `hooks.json`
- Or delete the hook folder from `.github/hooks/`

To run a single command without `rtk` interception, use `rtk proxy`:

```bash
rtk proxy <cmd>    # Run raw (no filtering) but still track usage
```

## Limitations

- Requires `rtk` to be installed — the hook will fail silently if `rtk` is not on `PATH`
- Only rewrites `bash`-type tool calls; other tool types are passed through unchanged
- Output compression may occasionally truncate very large outputs — use `rtk proxy` for commands where full output is needed
