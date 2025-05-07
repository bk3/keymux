import { LocalStorage } from "@raycast/api";
import { CommandConfig, CategoryConfig } from './types';
import { generateId } from "./generateId";

const COMMAND_KEY_PREFIX = "command-";
const COMMAND_IDS_KEY = "command-ids";

// Categories storage constants
const CATEGORY_KEY_PREFIX = "category-";
const CATEGORY_IDS_KEY = "category-ids";

export async function saveCommand(data: Omit<CommandConfig, 'id' | 'type'>): Promise<void> {
  try {
    const id = await generateId()
    const command = { ...data, id, type: 'command' }
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    await LocalStorage.setItem(key, JSON.stringify(command));

    const ids = await getCommandIds();
    if (!ids.includes(command.id)) {
      ids.push(command.id);
      await LocalStorage.setItem(COMMAND_IDS_KEY, JSON.stringify(ids));
    }
  } catch {
    throw new Error(`Unable to save command: ${data.title}`);
  }
}

export async function getCommand(id: string): Promise<CommandConfig | null> {
  try {
    const key = `${COMMAND_KEY_PREFIX}${id}`;
    const data = await LocalStorage.getItem(key);
    return data && typeof data === 'string' ? JSON.parse(data) : null;
  } catch {
    throw new Error(`Unable to retrieve command: ${id}`);
  }
}

export async function getCommandIds(): Promise<string[]> {
  try {
    const data = await LocalStorage.getItem(COMMAND_IDS_KEY);
    return data && typeof data === 'string' ? JSON.parse(data) : [];
  } catch {
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
  } catch {
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
  } catch {
    throw new Error(`Unable to delete command: ${id}`);
  }
}

export async function saveCategory(data: Omit<CategoryConfig, 'id' | 'type'>): Promise<void> {
  try {
    const id = await generateId();
    const category: CategoryConfig = { ...data, id, type: 'category' };
    const key = `${CATEGORY_KEY_PREFIX}${id}`;
    await LocalStorage.setItem(key, JSON.stringify(category));

    const ids = await getCategoryIds();
    if (!ids.includes(category.id)) {
      ids.push(category.id);
      await LocalStorage.setItem(CATEGORY_IDS_KEY, JSON.stringify(ids));
    }
  } catch {
    throw new Error(`Unable to save category: ${data.title}`);
  }
}

export async function getCategory(id: string): Promise<CategoryConfig | null> {
  try {
    const key = `${CATEGORY_KEY_PREFIX}${id}`;
    const data = await LocalStorage.getItem(key);
    return data && typeof data === 'string' ? JSON.parse(data) : null;
  } catch {
    throw new Error(`Unable to retrieve category: ${id}`);
  }
}

export async function getCategoryIds(): Promise<string[]> {
  try {
    const data = await LocalStorage.getItem(CATEGORY_IDS_KEY);
    return data && typeof data === 'string' ? JSON.parse(data) : [];
  } catch {
    throw new Error("Unable to retrieve category IDs");
  }
}

export async function getAllCategories(): Promise<CategoryConfig[]> {
  try {
    const ids = await getCategoryIds();
    if (!ids.length) return [];

    const promises = ids.map((id) => getCategory(id));
    const results = await Promise.all(promises);
    return results.filter((cat): cat is CategoryConfig => cat !== null && cat !== undefined);
  } catch {
    throw new Error("Unable to retrieve categories");
  }
}

export async function updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<void> {
  try {
    const category = await getCategory(id);
    if (!category) {
      throw new Error(`Category not found: ${id}`);
    }
    const updatedCategory = { ...category, ...updates };
    const key = `${CATEGORY_KEY_PREFIX}${id}`;
    await LocalStorage.setItem(key, JSON.stringify(updatedCategory));
  } catch (error) {
    throw error instanceof Error ? error : new Error(`Unable to update category: ${id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const key = `${CATEGORY_KEY_PREFIX}${id}`;
    await LocalStorage.removeItem(key);

    const ids = await getCategoryIds();
    const updatedIds = ids.filter((catId) => catId !== id);
    await LocalStorage.setItem(CATEGORY_IDS_KEY, JSON.stringify(updatedIds));
  } catch {
    throw new Error(`Unable to delete category: ${id}`);
  }
}

export async function updateCommandsForDeletedCategory(categoryId: string): Promise<void> {
  try {
    const allCommands = await getAllCommands();
    const commandsToUpdate = allCommands.filter(cmd => cmd.category === categoryId);
    
    // Update each command to have no category
    const updatePromises = commandsToUpdate.map(cmd => 
      updateCommand(cmd.id, { category: 'no-category' })
    );
    
    await Promise.all(updatePromises);
  } catch {
    throw new Error(`Unable to update commands for deleted category: ${categoryId}`);
  }
}
