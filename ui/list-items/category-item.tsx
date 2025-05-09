import { CategoryConfig } from "../../utils";
import { List } from "@raycast/api";
import { CategoryActions } from "../actions/category-actions";
import { SharedActionsProps } from "../actions/shared-actions";

export interface CategoryItemProps extends SharedActionsProps {
  category: CategoryConfig;
}

export function CategoryItem({ category, loadData, isSearchMode, setIsSearchMode }: CategoryItemProps) {
  return (
    <List.Item
      key={category.id}
      title={category.title}
      subtitle={category.description}
      accessories={[{ tag: category.shortcutKey }]}
      actions={
        <CategoryActions
          category={category} 
          loadData={loadData} 
          isSearchMode={isSearchMode} 
          setIsSearchMode={setIsSearchMode} 
        />
      }
    />
  )
}