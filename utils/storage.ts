import { LocalStorage } from "@raycast/api";
import { CommandConfig } from './types';
import { generateId } from "./generateId";

const COMMAND_KEY_PREFIX = "command-";
const COMMAND_IDS_KEY = "command-ids";

export async function saveCommand(data: Omit<CommandConfig, 'id'>): Promise<void> {
  try {
    const id = await generateId()
    const command = { id, ...data }
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    await LocalStorage.setItem(key, JSON.stringify(command));

    const ids = await getCommandIds();
    if (!ids.includes(command.id)) {
      ids.push(command.id);
      await LocalStorage.setItem(COMMAND_IDS_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    throw new Error(`Unable to save command: ${data.title}`);
  }
}

export async function getCommand(id: string): Promise<CommandConfig | null> {
  try {
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    const data = await LocalStorage.getItem(key);
    return data && typeof data === 'string' ? JSON.parse(data) : null;
  } catch (error) {
    throw new Error(`Unable to retrieve command: ${id}`);
  }
}

export async function getCommandIds(): Promise<string[]> {
  try {
    const data = await LocalStorage.getItem(COMMAND_IDS_KEY);
    return data && typeof data === 'string' ? JSON.parse(data) : [];
  } catch (error) {
    throw new Error("Unable to retrieve command IDs");
  }
}

export async function getAllCommands(): Promise<CommandConfig[]> {
  try {
    const ids = await getCommandIds();

    if (!ids.length) return [];

    const commandPromises = ids.map(id => getCommand(id));
    const results = await Promise.all(commandPromises);

    return results.filter((command): command is CommandConfig =>
      command !== null && command !== undefined);
  } catch (error) {
    throw new Error("Unable to retrieve commands");
  }
}

export async function updateCommand(id: string, updates: Partial<CommandConfig>): Promise<void> {
  try {
    const command = await getCommand(id);

    if (!command) {
      throw new Error(`Command not found: ${id}`);
    }

    const updatedCommand = { ...command, ...updates };

    // Save directly with the existing ID instead of calling saveCommand
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    await LocalStorage.setItem(key, JSON.stringify(updatedCommand));

    // No need to update the IDs list since we're keeping the same ID
  } catch (error) {
    throw error instanceof Error ? error : new Error(`Unable to update command: ${id}`);
  }
}


export async function deleteCommand(id: string): Promise<void> {
  try {
    // Remove the command data
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    await LocalStorage.removeItem(key);

    // Update the index of IDs
    const ids = await getCommandIds();
    const updatedIds = ids.filter(commandId => commandId !== id);
    await LocalStorage.setItem(COMMAND_IDS_KEY, JSON.stringify(updatedIds));
  } catch (error) {
    throw new Error(`Unable to delete command: ${id}`);
  }
}
