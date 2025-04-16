import { runAppleScript } from '@raycast/utils';
import { closeMainWindow } from '@raycast/api';
import { CommandConfig } from './types'

export async function runCommandConfig(
  command: CommandConfig
): Promise<void> {
  const mods = command.modifiers.length > 0
    ? `using {${command.modifiers.join(" down, ")} down}`
    : "";

  await runAppleScript(`
    tell application "System Events"
      keystroke "${command.commandKeys.toLowerCase()}" ${mods}
    end tell
  `);

  closeMainWindow();
}
