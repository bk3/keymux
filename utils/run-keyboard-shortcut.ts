import { runAppleScript } from "@raycast/utils";

export default async function runKeyboardShortcut(
  modifierKeys: string[],
  commandKeys: string
): Promise<void> {
  // Create the AppleScript modifier string
  const modifierString = modifierKeys.length > 0
    ? `using {${modifierKeys.join(" down, ")} down}`
    : "";

  // Execute each command key with the modifiers
  const script = `
    tell application "System Events"
      keystroke "${commandKeys}" ${modifierString}
    end tell
  `;

  await runAppleScript(script);
}
