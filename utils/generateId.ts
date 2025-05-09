import { nanoid } from 'nanoid';
import * as storage from './storage'

export async function generateId(): Promise<string> {
  const commandIds = await storage.getCommandIds();
  const categoryIds = await storage.getCategoryIds();
  const existingIds = [...commandIds, ...categoryIds];

  let newId = nanoid();
  while (existingIds.includes(newId)) {
    newId = nanoid();
  }

  return newId;
}
