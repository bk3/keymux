import { runAppleScript } from '@raycast/utils';
import { closeMainWindow, popToRoot } from '@raycast/api';
import { CommandConfig } from './types'

export async function runCommandConfig(
  command: CommandConfig
): Promise<void> {
  const modifiers = command.modifiers.length > 0
    ? `{${command.modifiers.join(" down, ")} down}`
    : "";

    const keys = command.modifiers.includes('shift') 
    ? command.commandKeys.toUpperCase() 
    : command.commandKeys.toLowerCase();

  /*
  const app = await getFrontmostApplication();
  const applicationSwitch = `
    -- Tell Notion to become the frontmost application
    tell application "${app.name}"
      activate
    end tell
  `
  */

  const script = `
    -- Tell System Events to perform the keystroke
    tell application "System Events"
      keystroke "${keys}" using ${modifiers}
    end tell
  `

  await closeMainWindow();
  await popToRoot({ clearSearchBar: true });
  await runAppleScript(script)
}
