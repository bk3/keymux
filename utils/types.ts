export interface SharedConfig {
  type: 'command' | 'category';
  id: string;
  title: string;
  description: string;
  shortcutKey: string;
}

export interface CommandConfig extends SharedConfig {
  modifiers: string[];
  commandKeys: string;
  category: string;
}

export type CategoryConfig = SharedConfig;