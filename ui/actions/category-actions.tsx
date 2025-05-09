import { Action, ActionPanel, Icon, confirmAlert } from "@raycast/api";
import { storage } from "../../utils";
import { SharedActions } from "./shared-actions";
import { CategoryItemProps } from "../list-items/category-item";
import CreateCategory from "../../src/create-category";
import ShowCommands from "../../src/show-commands";
import CreateCommand from "../../src/create-command";
export function CategoryActions({ category, loadData, isSearchMode, setIsSearchMode }: CategoryItemProps) {
  return (
    <ActionPanel>
      <Action.Push
        key='open-category'
        title="Open Category"
        icon={Icon.Folder}
        target={<ShowCommands category={category.id} />}
      />
      <Action.Push
        key='edit-category'
        title="Edit Category"
        icon={Icon.Pencil}
        shortcut={{ modifiers: ['ctrl'], key: "e" }}
        target={<CreateCategory id={category.id} />}
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
      <Action
        key='delete-category'
        title="Delete Category"
        icon={Icon.Trash}
        shortcut={{ modifiers: ['ctrl'], key: "x" }}
        onAction={async () => {
          const deleteConfirmation = {
            title: 'Delete category?',
            message: 'Are you sure you want to delete this category? This action cannot be undone.'
          };
          if (await confirmAlert(deleteConfirmation)) {
            await storage.deleteCategory(category.id)
            await storage.updateCommandsForDeletedCategory(category.id)
            await loadData()
          }
        }}
      />
      <Action.Push
        key='create-command'
        title="Create Command"
        icon={Icon.Plus}
        shortcut={{ modifiers: ['ctrl'], key: "n" }}
        target={<CreateCommand category={category.id} />}
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