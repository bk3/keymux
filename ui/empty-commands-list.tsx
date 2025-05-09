import { Action, ActionPanel, List, Icon } from "@raycast/api";
import CreateCommand from "../src/create-command";
import CreateCategory from "../src/create-category";
interface EmptyCommandsViewProps {
    searchValue: string; 
    hasCommands: boolean;
    loadData: () => Promise<void>;
    isSearchMode: boolean;
    setIsSearchMode: (isSearchMode: boolean) => void;
    category?: string;
}

export default function EmptyCommandsView({ 
    loadData, 
    hasCommands,
    searchValue, 
    isSearchMode,
    setIsSearchMode,
    category
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
            <Action.Push
                key='create-command'
                title="Create Command"
                icon={Icon.Plus}
                shortcut={{ modifiers: ['ctrl'], key: "n" }}
                target={<CreateCommand category={category} />}
                onPop={loadData}
            />
            <Action.Push
                key='create-category'
                title="Create Category"
                icon={Icon.PlusTopRightSquare}
                shortcut={{ modifiers: ['ctrl'], key: "c" }}
                target={<CreateCategory />}
                onPop={loadData}
            />
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