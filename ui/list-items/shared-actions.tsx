import { Action, Icon, confirmAlert, LocalStorage } from "@raycast/api";

export interface SharedActionsProps {
  loadData: () => Promise<void>;
  isSearchMode: boolean;
  setIsSearchMode: (isSearchMode: boolean) => void;
}

export function SharedActions({ loadData, isSearchMode, setIsSearchMode }: SharedActionsProps) {
  return (
    <>
      <Action
        key='toggle-mode'
        title={isSearchMode ? 'Toggle Actions' : 'Toggle Search'}
        icon={isSearchMode ? Icon.BullsEye : Icon.MagnifyingGlass}
        shortcut={{ modifiers: [], key: "tab" }}
        onAction={() => setIsSearchMode(!isSearchMode)}
      />
      <Action
        key='delete-all'
        title="Delete All"
        icon={Icon.Trash}
        onAction={async () => {
          const deleteConfirmation = {
            title: 'Delete all data?',
            message: 'Are you sure you want to do this? All of your data will be deleted. This action cannot be undone.'
          };
          if (await confirmAlert(deleteConfirmation)) {
            await LocalStorage.clear()
            await loadData()
          }
        }}
      />
    </>
  )
}