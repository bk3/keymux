import { LocalStorage } from "@raycast/api";

interface ShortcutConfig {
  id: string;
  modifiers: string[];
  commandKeys: string;
  shortcutKey: string;
  description: string;
  title: string;
}

const SHORTCUT_KEY_PREFIX = "shortcut-";
const SHORTCUT_IDS_KEY = "shortcut-ids";

// Save a single shortcut
export async function saveShortcut(shortcut: ShortcutConfig): Promise<void> {
  // Convert to string with JSON.stringify
  const shortcutString = JSON.stringify(shortcut);

  // Ensure key is a string
  const key = `${SHORTCUT_KEY_PREFIX}${shortcut.id}`;

  // Store the shortcut data
  await LocalStorage.setItem(key, shortcutString);

  // Update the index of IDs
  const ids = await getShortcutIds();
  if (!ids.includes(shortcut.id)) {
    ids.push(shortcut.id);
    await LocalStorage.setItem(SHORTCUT_IDS_KEY, JSON.stringify(ids));
  }
}

// Get a single shortcut by ID
export async function getShortcut(id: string): Promise<ShortcutConfig | null> {
  const key = `${SHORTCUT_KEY_PREFIX}${id}`;
  const data = await LocalStorage.getItem(key);
  return data && typeof data === 'string' ? JSON.parse(data) : null;
}

// Get all shortcut IDs
export async function getShortcutIds(): Promise<string[]> {
  const data = await LocalStorage.getItem(SHORTCUT_IDS_KEY);
  return data && typeof data === 'string' ? JSON.parse(data) : [];
}

// Get all shortcuts
export async function getAllShortcuts(): Promise<ShortcutConfig[]> {
  const ids = await getShortcutIds();
  const shortcuts: ShortcutConfig[] = [];

  for (const id of ids) {
    const shortcut = await getShortcut(id);
    if (shortcut) {
      shortcuts.push(shortcut);
    }
  }

  return shortcuts;
}

// Update a shortcut
export async function updateShortcut(id: string, updates: Partial<ShortcutConfig>): Promise<void> {
  const shortcut = await getShortcut(id);

  if (shortcut) {
    const updatedShortcut = { ...shortcut, ...updates };
    await saveShortcut(updatedShortcut);
  }
}

// Delete a shortcut
export async function deleteShortcut(id: string): Promise<void> {
  // Remove the shortcut data
  const key = `${SHORTCUT_KEY_PREFIX}${id}`;
  await LocalStorage.removeItem(key);

  // Update the index of IDs
  const ids = await getShortcutIds();
  const updatedIds = ids.filter(shortcutId => shortcutId !== id);
  await LocalStorage.setItem(SHORTCUT_IDS_KEY, JSON.stringify(updatedIds));
}

