export interface CommandConfig {
  id: string;
  title: string;
  description: string;
  shortcutKey: string;
  modifiers: string[];
  commandKeys: string;
  category: string;
}

export interface CategoryConfig {
  id: string;
  title: string;
  shortcutKey: string;
}
