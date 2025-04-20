import { useEffect, useMemo, useState } from "react";
import { Action, ActionPanel, List, confirmAlert, useNavigation, Icon } from "@raycast/api";
import { CommandConfig, getModifierGlyph, runCommandConfig, storage } from "../utils";
import CreateCommand from './create-command'

export default function ShowCommands() {
  const { push } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [commands, setCommands] = useState<CommandConfig[]>([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchValue, setSearchValue] = useState('')

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
    if (!searchValue?.length) return commands;

    return commands.filter(i => (
      i.title.toLowerCase().includes(searchValue)
      || i.description.toLowerCase().includes(searchValue)
    ))
  }, [searchValue, commands])

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={
        !commandItems?.length && !isSearchMode
          ? 'Press "enter" to create a new command'
          : isSearchMode
            ? 'Search or press tab to toggle search mode'
            : 'Press key to run command or tab to search'
      }
      searchText={searchValue}
      onSearchTextChange={(val) => {
        if (isSearchMode) {
          setSearchValue(val)
          return;
        }

        const command = commands.filter(c => c.shortcutKey === val.toUpperCase())?.[0];
        if (!command) return;
        runCommandConfig(command)
      }}
      searchBarAccessory={
        commands.length > 0 ? (
          <List.Dropdown
            tooltip="Change mode"
            value={isSearchMode ? 'search' : 'action'}
            onChange={mode => setIsSearchMode(mode === 'search')}
          >
            <List.Dropdown.Item key="action" title="Action mode" value="action" />
            <List.Dropdown.Item key="search" title="Search mode" value="search" />
          </List.Dropdown>
        ) : undefined
      }
    >
      {!commandItems?.length ? (
        <List.EmptyView
          title={
            searchValue?.length
              ? 'No matching commands'
              : 'No commands configured'
          }
          description={
            searchValue?.length
              ? 'Command matching your search could not be found'
              : 'Create a new command to get started'
          }
          actions={
            <ActionPanel>
              {commands.length === 0 && (
                <Action
                  key='create-command'
                  title="Create Command"
                  icon={Icon.Plus}
                  shortcut={{ modifiers: ['cmd', 'shift'], key: "enter" }}
                  onAction={() => push(<CreateCommand />, loadData)}
                />
              )}
              <Action
                key='toggle-search'
                title="Toggle Search"
                icon={Icon.MagnifyingGlass}
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(prev => !prev)}
              />
            </ActionPanel>
          }
        />
      ) : commandItems.map((command) => (
        <List.Item
          key={command.id}
          title={command.title}
          subtitle={command.description}
          accessories={[{
            text: `${getModifierGlyph(command.modifiers)}${command.commandKeys}`,
          }, {
            tag: command.shortcutKey
          }]}
          actions={
            <ActionPanel>
              <Action
                key='run-command'
                title="Run Command"
                icon={Icon.Play}
                onAction={() => runCommandConfig(command)}
              />
              <Action
                key='edit-command'
                title="Edit Command"
                icon={Icon.Pencil}
                shortcut={{ modifiers: ['ctrl'], key: "e" }}
                onAction={() => push(<CreateCommand id={command.id} />, loadData)}
              />
              <Action
                key='delete-command'
                title="Delete Command"
                icon={Icon.Trash}
                shortcut={{ modifiers: ['ctrl'], key: "x" }}
                onAction={async () => {
                  const deleteConfirmation = {
                    title: 'Delete command?',
                    message: 'Are you sure you want to delete this command configuration? This action cannot be undone.'
                  };
                  if (await confirmAlert(deleteConfirmation)) {
                    await storage.deleteCommand(command.id)
                    await loadData()
                  }
                }}
              />
              <Action
                key='create-new-command'
                title="Create Command"
                icon={Icon.Plus}
                shortcut={{ modifiers: ['cmd', 'shift'], key: "enter" }}
                onAction={() => push(<CreateCommand />, loadData)}
              />
              <Action
                key='toggle-search'
                title="Toggle Search"
                icon={Icon.MagnifyingGlass}
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
