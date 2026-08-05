import { exec } from 'child_process'

const SOUND_PATH = '/Users/kan/.claude/sounds/miguel-spiderverse.mp3'

export default async (): Promise<void> => {
  return {
    event: (input: { type: string }): void => {
      if (input.type === 'session.complete' || input.type === 'chat.message.complete') {
        exec(`afplay "${SOUND_PATH}" 2>/dev/null || true`)
      }
    }
  }
}
