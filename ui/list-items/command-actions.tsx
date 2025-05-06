import { Action, ActionPanel, Icon, confirmAlert } from "@raycast/api";
import CreateCommand from "../../src/create-command";
import { storage, runCommandConfig } from "../../utils";
import { SharedActions } from "./shared-actions";
import { CommandItemProps } from "./command-item";
import CreateCategory from "../../src/create-category";

export function CommandActions({ command, loadData, isSearchMode, setIsSearchMode }: CommandItemProps) {
  return (
    <ActionPanel>
      <Action
        key='run-command'
        title="Run Command"
        icon={Icon.Play}
        onAction={() => runCommandConfig(command)}
      />
      <Action.Push
        key='edit-command'
        title="Edit Command"
        icon={Icon.Pencil}
        shortcut={{ modifiers: ['ctrl'], key: "e" }}
        target={<CreateCommand id={command.id} />}
        onPop={loadData}
      />
      <Action.Push
        key='create-command'
        title="Create Command"
        icon={Icon.Plus}
        shortcut={{ modifiers: ['ctrl'], key: "n" }}
        target={<CreateCommand />}
        onPop={loadData}
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
      <Action.Push
        key='create-category'
        title="Create Category"
        icon={Icon.PlusTopRightSquare}
        shortcut={{ modifiers: ['ctrl'], key: "c" }}
        target={<CreateCategory />}
        onPop={loadData}
      />
      <SharedActions
        loadData={loadData} 
        isSearchMode={isSearchMode} 
        setIsSearchMode={setIsSearchMode}
      />
    </ActionPanel>
  )
}