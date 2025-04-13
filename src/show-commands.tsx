import { Action, ActionPanel, closeMainWindow, confirmAlert, List, useNavigation } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";
import { useEffect, useMemo, useState } from "react";
import { CommandConfig, storage } from "../utils";
import CreateCommand from './create-command'

const glyphs: { [key: string]: string } = {
  command: '⌘',
  control: '⌃',
  option: '⌥',
  shift: '⇧',
}

function getGlyphs(modifiers: string[]) {
  const mods = modifiers.map(mod => glyphs[mod])
  return mods.toString().replaceAll(',', '')
}

async function runCommand(
  command: CommandConfig
): Promise<void> {
  const mods = command.modifiers.length > 0
    ? `using {${command.modifiers.join(" down, ")} down}`
    : "";

  await runAppleScript(`
    tell application "System Events"
      keystroke "${command.commandKeys}" ${mods}
    end tell
  `);

  closeMainWindow();
}

export default function ShowCommands() {
  console.log('RENDER!')
  const { push } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [commands, setCommands] = useState<CommandConfig[]>([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const placeholder = isSearchMode ? 'Search for command or press tab to toggle search mode' : 'Press key to run command or tab to search'

  async function loadData() {
    setLoading(true);
    const allCommands = await storage.getAllCommands()
    setCommands(allCommands)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const commandItems = useMemo(() => {
    if (searchValue?.length) {
      return commands.filter(i => (
        i.title.toLowerCase().includes(searchValue)
        || i.description.toLowerCase().includes(searchValue)
      ))
    }

    return commands;
  }, [searchValue, commands])

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={placeholder}
      onSearchTextChange={val => {
        if (isSearchMode) {
          setSearchValue(val)
          return;
        }

        const command = commands.filter(item => item.shortcutKey === val)?.[0];
        if (!command) return;
        runCommand(command)
      }}
    >
      {!commandItems?.length && !searchValue ? (
        <List.EmptyView
          title="No commands configured"
          description='Create a new command to get started'
          actions={
            <ActionPanel>
              <Action
                title="Create command"
                onAction={() => push(<CreateCommand />, loadData)}
              />
              <Action
                title="Toggle search mode"
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(prev => !prev)}
              />
            </ActionPanel>
          }
        />
      ) : !commandItems?.length ? (
        <List.EmptyView
          title="No matching commands"
          description='Command matching your search could not be found'
          actions={
            <ActionPanel>
              <Action
                title="Create command"
                onAction={() => push(<CreateCommand />, loadData)}
              />
              <Action
                title="Toggle search mode"
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(prev => !prev)}
              />
            </ActionPanel>
          }
        />
      ) : commandItems.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.description}
          accessories={[{
            text: `${getGlyphs(item.modifiers)}${item.commandKeys.toUpperCase()}`,
          }, {
            tag: item.shortcutKey?.toUpperCase()
          }]}
          actions={
            <ActionPanel>
              <Action
                title="Run command"
                onAction={() => runCommand(item)}
              />
              <Action
                title="Edit command"
                onAction={() => {
                }}
              />
              <Action
                title="Delete command"
                shortcut={{ modifiers: ['ctrl'], key: "x" }}
                onAction={async () => {
                  const deleteConfirmation = {
                    title: 'Delete command?',
                    message: 'Are you sure you want to delete this command configuration? This action cannot be undone.'
                  };
                  if (await confirmAlert(deleteConfirmation)) {
                    storage.deleteCommand(item.id)
                    loadData()
                  }
                }}
              />
              <Action
                title="Create new command"
                onAction={() => push(<CreateCommand />)}
              />
              <Action
                title="Toggle search mode"
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(prev => !prev)}
              />
            </ActionPanel>
          }
        />
      ))
      }
    </List>
  );
}
