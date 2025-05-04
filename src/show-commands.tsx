import { List } from "@raycast/api";
import EmptyCommandsView from "../ui/empty-commands-list";
import useCommandsListData from "../utils/use-commands-list-data";
import { CategoryConfig, CommandConfig, runCommandConfig } from "../utils";
import { CategoryItem } from "../ui/list-items/category-item";
import { CommandItem } from "../ui/list-items/command-item";

export default function ShowCommands() {
  const { 
    loading, 
    isSearchMode, 
    setIsSearchMode, 
    searchValue, 
    setSearchValue, 
    commandListItems, 
    commands,
    // categories, 
    loadData 
  } = useCommandsListData()

  const sharedListItemProps = {
    loadData,
    isSearchMode,
    setIsSearchMode,
  }

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={
        loading 
          ? 'Loading...' 
          : !commands?.length
            ? 'Press "enter" to create your first command'
            : isSearchMode
              ? 'Search or press tab to toggle actions'
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
        loading || commands?.length === 0 ? undefined : (
          <List.Dropdown
            tooltip="Change mode"
            placeholder="Select mode"
            value={isSearchMode ? 'search' : 'action'}
            onChange={mode => setIsSearchMode(mode === 'search')}
          >
            <List.Dropdown.Item key="action" title="Action mode" value="action" />
            <List.Dropdown.Item key="search" title="Search mode" value="search" />
          </List.Dropdown>
        )
      }
    >
      {loading ? (<></>) : !commandListItems?.length ? (
        <EmptyCommandsView 
          searchValue={searchValue} 
          commands={commands} 
          loadData={loadData} 
          isSearchMode={isSearchMode}
          setIsSearchMode={setIsSearchMode} 
        />
      ) : commandListItems.map((item) => (
        item.type === 'category' ? (
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
        )
      ))}
    </List>
  );
}
