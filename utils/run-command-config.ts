import { runAppleScript } from '@raycast/utils';
import { closeMainWindow, popToRoot } from '@raycast/api';
import { CommandConfig } from './types'

export async function runCommandConfig(
  command: CommandConfig
): Promise<void> {
  const modifiers = command.modifiers.length > 0
    ? `using {${command.modifiers.join(" down, ")} down}`
    : "";

    const keys = command.modifiers.includes('shift') 
    ? command.commandKeys.toUpperCase() 
    : command.commandKeys.toLowerCase();

  await runAppleScript(`
    tell application "System Events"
      keystroke "${keys}" ${modifiers}
    end tell
  `);

  popToRoot();
  closeMainWindow();
}
