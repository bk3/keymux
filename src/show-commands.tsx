import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import runKeyboardShortcut from '../utils/run-keyboard-shortcut';
import { useState } from "react";
import { CommandConfig } from "../utils/types";

const glyphs: { [key: string]: string } = {
  command: '⌘',
  control: '⌃',
  option: '⌥',
  shift: '⇧',
}

function convertModifiersToGlyphs(modifiers: string[]) {
  const mods = modifiers.map(mod => glyphs[mod])
  return mods.toString().replaceAll(',', '')
}

const items = [
  {
    id: '1',
    title: 'Arc',
    description: 'Open Arc web browser',
    shortcutKey: 'a',
    modifiers: ['command', 'option', 'control'],
    commandKeys: 'a',
  },
  {
    id: '2',
    title: 'Notion',
    description: 'Open Notion application',
    shortcutKey: 'w',
    modifiers: ['command', 'option', 'control'],
    commandKeys: 'w',
  },
]

export default function ShowCommands() {
  const [filteredItems, setFilteredItems] = useState(items)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const { pop } = useNavigation()

  const placeholder = isSearchMode ? 'Search for command or press tab to toggle search mode' : 'Press key to run command or tab to search'

  function runCommand(config: CommandConfig) {
    runKeyboardShortcut(config.modifiers, config.commandKeys)
    pop();
  }

  return (
    <List
      searchBarPlaceholder={placeholder}
      onSearchTextChange={val => {
        if (!isSearchMode) {
          const command = items.filter(item => item.shortcutKey === val)?.[0];
          if (!command) return;
          runCommand(command)
        }

        let updatedItems = items;

        if (val?.length) {
          updatedItems = items.filter(i => (
            i.title.toLowerCase().includes(val)
            || i.description.toLowerCase().includes(val)
          ))
        }

        setFilteredItems(updatedItems)
      }}
    >
      {filteredItems.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.description}
          accessories={[{
            text: `${convertModifiersToGlyphs(item.modifiers)}${item.commandKeys.toUpperCase()}`,
          }, {
            tag: item.shortcutKey?.toUpperCase()
          }]}
          actions={
            <ActionPanel>
              <Action
                title="Run command"
                shortcut={{ modifiers: [], key: "enter" }}
                onAction={() => runCommand(item)}
              />
              <Action
                title="Toggle search mode"
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(prev => !prev)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
