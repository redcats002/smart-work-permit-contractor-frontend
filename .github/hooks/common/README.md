---
name: 'Common Session Announcer'
description: 'Announces Copilot coding agent session lifecycle events via macOS text-to-speech'
tags: ['macos', 'tts', 'session-lifecycle', 'notifications']
---

# Common Session Announcer Hook

Announces GitHub Copilot coding agent session lifecycle events out loud using the macOS `say` command, so you know what the agent is doing without watching the screen.

## Overview

When working with a Copilot coding agent in the background, it can be hard to know when a session starts, finishes, or requires your attention. This hook uses the built-in macOS text-to-speech engine to vocally announce every major lifecycle event:

- **Session started** — agent has begun working
- **Session finished** — agent has completed its work
- **Permission request** — agent is waiting for your approval
- **Agent stopped** — agent was stopped manually or due to an error

## Features

- **Zero dependencies**: Uses only the built-in macOS `say` command
- **Full lifecycle coverage**: Hooks into `sessionStart`, `sessionEnd`, `PermissionRequest`, and `agentStop`
- **Non-blocking**: Runs with a short timeout so it never delays the agent

## Installation

1. Copy the hook folder to your repository:

   ```bash
   cp -r hooks/common .github/hooks/
   ```

2. No additional setup required — `say` is available on all macOS systems.

3. Commit the hook configuration to your repository's default branch.

> **Note:** This hook is macOS-only. On Linux or Windows, replace `say` with an equivalent TTS command (e.g., `espeak` on Linux).

## Configuration

The hook is configured in `hooks.json` to run on all session lifecycle events:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "say 'Copilot session started'",
        "cwd": ".",
        "timeoutSec": 30
      }
    ],
    "sessionEnd": [
      {
        "type": "command",
        "bash": "say 'Copilot session has finished their work'",
        "cwd": ".",
        "timeoutSec": 30
      }
    ],
    "PermissionRequest": [
      {
        "type": "command",
        "bash": "say 'Permission request received'",
        "cwd": ".",
        "timeoutSec": 30
      }
    ],
    "agentStop": [
      {
        "type": "command",
        "bash": "say 'Agent stopped'",
        "cwd": ".",
        "timeoutSec": 30
      }
    ]
  }
}
```

## How It Works

1. The Copilot agent runtime fires a lifecycle event (`sessionStart`, `sessionEnd`, etc.)
2. The hook executes the corresponding `say` command
3. macOS speaks the announcement through the system audio output
4. The hook exits and the agent continues normally

## Customization

- **Change the voice**: Add `-v <VoiceName>` to the `say` command (e.g., `say -v Samantha 'Session started'`)
- **Change the message**: Edit the string passed to `say` in `hooks.json`
- **Add more events**: Register additional hook entries for other Copilot events as they become available
- **Cross-platform**: Replace `say` with `espeak` (Linux) or `PowerShell -c "(New-Object -ComObject SAPI.SpVoice).Speak('...')"` (Windows)

## Disabling

To temporarily silence the announcements:

- Remove or comment out individual entries from `hooks.json`
- Or delete the hook folder from `.github/hooks/`

## Limitations

- Requires macOS — the `say` command is not available on other operating systems
- Audio output must be enabled and not muted for announcements to be heard
- The `PermissionRequest` event may fire while the agent is already speaking the previous announcement on slow machines
