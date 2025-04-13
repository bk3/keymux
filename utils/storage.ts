import { LocalStorage } from "@raycast/api";
import { CommandConfig } from './types'

const COMMAND_KEY_PREFIX = "command-";
const COMMAND_IDS_KEY = "command-ids";

// Save a single command
export async function saveCommand(command: CommandConfig): Promise<void> {
  // Convert to string with JSON.stringify
  const commandString = JSON.stringify(command);

  // Ensure key is a string
  const key = `${COMMAND_KEY_PREFIX}${command.id}`;

  // Store the command data
  await LocalStorage.setItem(key, commandString);

  // Update the index of IDs
  const ids = await getCommandIds();
  if (!ids.includes(command.id)) {
    ids.push(command.id);
    await LocalStorage.setItem(COMMAND_IDS_KEY, JSON.stringify(ids));
  }
}

export async function getCommand(id: string): Promise<CommandConfig | null> {
  const key = `${COMMAND_KEY_PREFIX}${id}`;
  const data = await LocalStorage.getItem(key);
  return data && typeof data === 'string' ? JSON.parse(data) : null;
}

// Get all command IDs
export async function getCommandIds(): Promise<string[]> {
  const data = await LocalStorage.getItem(COMMAND_IDS_KEY);
  return data && typeof data === 'string' ? JSON.parse(data) : [];
}

// Get all commands
export async function getAllCommands(): Promise<CommandConfig[]> {
  const ids = await getCommandIds();
  const commands: CommandConfig[] = [];

  for (const id of ids) {
    const command = await getCommand(id);
    if (command) {
      commands.push(command);
    }
  }

  return commands;
}

// Update a command
export async function updateCommand(id: string, updates: Partial<CommandConfig>): Promise<void> {
  const command = await getCommand(id);

  if (command) {
    const updatedCommand = { ...command, ...updates };
    await saveCommand(updatedCommand);
  }
}

// Delete a command
export async function deleteCommand(id: string): Promise<void> {
  // Remove the command data
  const key = `${COMMAND_KEY_PREFIX}${id}`;
  await LocalStorage.removeItem(key);

  // Update the index of IDs
  const ids = await getCommandIds();
  const updatedIds = ids.filter(commandId => commandId !== id);
  await LocalStorage.setItem(COMMAND_IDS_KEY, JSON.stringify(updatedIds));
}

