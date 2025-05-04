import { Action, ActionPanel, List, Icon } from "@raycast/api";
import CreateCommand from "../src/create-command";

interface EmptyCommandsViewProps {
    searchValue: string; 
    hasCommands: boolean;
    loadData: () => Promise<void>;
    isSearchMode: boolean;
    setIsSearchMode: (isSearchMode: boolean) => void;
}

export default function EmptyCommandsView({ 
    loadData, 
    hasCommands,
    searchValue, 
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
            {!hasCommands && (
            <Action.Push
                key='create-command'
                title="Create Command"
                icon={Icon.Plus}
                shortcut={{ modifiers: ['cmd', 'shift'], key: "enter" }}
                target={<CreateCommand />}
                onPop={loadData}
            />
            )}
            {hasCommands && (
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