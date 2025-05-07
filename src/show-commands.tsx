import { List, useNavigation } from "@raycast/api";
import EmptyCommandsView from "../ui/empty-commands-list";
import useCommandsListData from "../utils/use-commands-list-data";
import { CategoryConfig, CommandConfig, runCommandConfig } from "../utils";
import { CategoryItem } from "../ui/list-items/category-item";
import { CommandItem } from "../ui/list-items/command-item";

interface ShowCommandsProps {
  category?: string;
}

export default function ShowCommands({ category }: ShowCommandsProps) {
  const {
    loading,
    isSearchMode,
    setIsSearchMode,
    searchValue,
    setSearchValue,
    hasCommands,
    listItems,
    loadData,
  } = useCommandsListData(category);

  const { push } = useNavigation();

  const sharedListItemProps = {
    loadData,
    isSearchMode,
    setIsSearchMode,
  };

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={
        loading
          ? "Loading..."
          : !hasCommands
            ? 'Press "enter" to create your first command'
            : isSearchMode
              ? "Search or press tab to toggle actions"
              : "Press key to run command or tab to search"
      }
      searchText={searchValue}
      onSearchTextChange={(val) => {
        if (isSearchMode) {
          setSearchValue(val);
          return;
        }

        const item = listItems.filter(
          (c) => c.shortcutKey === val.toUpperCase(),
        )?.[0];
        if (!item) return;
        if (item.type === "category") {
          push(<ShowCommands category={item.id} />);
        } else {
          runCommandConfig(item as CommandConfig);
        }
      }}
      searchBarAccessory={
        loading || !hasCommands ? undefined : (
          <List.Dropdown
            tooltip="Change mode"
            placeholder="Select mode"
            value={isSearchMode ? "search" : "action"}
            onChange={(mode) => setIsSearchMode(mode === "search")}
          >
            <List.Dropdown.Item
              key="action"
              title="Action mode"
              value="action"
            />
            <List.Dropdown.Item
              key="search"
              title="Search mode"
              value="search"
            />
          </List.Dropdown>
        )
      }
    >
      {loading ? (
        <></>
      ) : !listItems?.length ? (
        <EmptyCommandsView
          searchValue={searchValue}
          hasCommands={hasCommands}
          loadData={loadData}
          isSearchMode={isSearchMode}
          setIsSearchMode={setIsSearchMode}
        />
      ) : (
        listItems.map((item) =>
          item.type === "category" ? (
            <CategoryItem
              key={item.id}
              category={item as CategoryConfig}
              {...sharedListItemProps}
            />
          ) : (
            <CommandItem
              key={item.id}
              command={item as CommandConfig}
              {...sharedListItemProps}
            />
          ),
        )
      )}
    </List>
  );
}
