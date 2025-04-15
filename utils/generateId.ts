import { nanoid } from 'nanoid';
import * as storage from './storage'

export async function generateId(): Promise<string> {
  const existingIds = await storage.getCommandIds();

  let newId = nanoid();
  while (existingIds.includes(newId)) {
    newId = nanoid();
  }

  return newId;
}
