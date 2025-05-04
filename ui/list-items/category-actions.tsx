import { Action, ActionPanel, Icon, confirmAlert } from "@raycast/api";
import { runCommandConfig, storage } from "../../utils";
import { CategoryItemProps } from "./category-item";
import { SharedActions } from "./shared-actions";
import CreateCategory from "../../src/create-category";

export function CategoryActions({ category, loadData, isSearchMode, setIsSearchMode }: CategoryItemProps) {
  return (
    <ActionPanel>
      <Action
        key='open-category'
        title="Open Category"
        icon={Icon.Play}
        onAction={() => runCommandConfig(category)}
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
            await loadData()
          }
        }}
      />
      <SharedActions 
        loadData={loadData} 
        isSearchMode={isSearchMode} 
        setIsSearchMode={setIsSearchMode} 
      />
    </ActionPanel>
  )
}