import { useEffect, useMemo, useState } from "react";
import { Action, ActionPanel, confirmAlert, List, useNavigation } from "@raycast/api";
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

  const createAndToggleActions = [
    <Action
      title="Create command"
      onAction={() => push(<CreateCommand />, loadData)}
    />,
    <Action
      title="Toggle search mode"
      shortcut={{ modifiers: [], key: "tab" }}
      onAction={() => setIsSearchMode(prev => !prev)}
    />
  ]

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={
        isSearchMode
          ? 'Search for command or press tab to toggle search mode'
          : 'Press key to run command or tab to search'
      }
      onSearchTextChange={val => {
        if (isSearchMode) {
          setSearchValue(val)
          return;
        }

        const command = commands.filter(item => item.shortcutKey === val)?.[0];
        if (!command) return;
        runCommandConfig(command)
      }}
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
              {createAndToggleActions}
            </ActionPanel>
          }
        />
      ) : commandItems.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.description}
          accessories={[{
            text: `${getModifierGlyph(item.modifiers)}${item.commandKeys}`,
          }, {
            tag: item.shortcutKey
          }]}
          actions={
            <ActionPanel>
              <Action
                title="Run command"
                onAction={() => runCommandConfig(item)}
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
                    await storage.deleteCommand(item.id)
                    await loadData()
                  }
                }}
              />
              {createAndToggleActions}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
