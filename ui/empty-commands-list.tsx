import { Action, ActionPanel, List, Icon } from "@raycast/api";
import CreateCommand from "../src/create-command";
import { CommandConfig } from "../utils";

interface EmptyCommandsViewProps {
    searchValue: string; 
    commands: CommandConfig[];
    loadData: () => void;
    isSearchMode: boolean;
    setIsSearchMode: (isSearchMode: boolean) => void;
}

export default function EmptyCommandsView({ 
    searchValue, 
    commands, 
    loadData, 
    isSearchMode,
    setIsSearchMode 
}: EmptyCommandsViewProps) {
  return (
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
            <Action.Push
                key='create-command'
                title="Create Command"
                icon={Icon.Plus}
                shortcut={{ modifiers: ['cmd', 'shift'], key: "enter" }}
                target={<CreateCommand />}
                onPop={loadData}
            />
            )}
            {commands.length !== 0 && (
            <Action
                key='toggle-search'
                title="Toggle Search"
                icon={Icon.MagnifyingGlass}
                shortcut={{ modifiers: [], key: "tab" }}
                onAction={() => setIsSearchMode(!isSearchMode)}
            />
            )}
        </ActionPanel>
        }
    />
  )
}