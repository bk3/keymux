import { CategoryConfig, CommandConfig } from "./types";

// Type for items being checked
type ItemToCheck = 
  | (Pick<CategoryConfig, "type" | "shortcutKey"> & { id?: string })
  | (Pick<CommandConfig, "type" | "shortcutKey" | "category"> & { id?: string });

/**
 * Checks if there's a shortcut clash between commands and categories.
 * - Commands without a category and categories can't have the same shortcut key
 * - Commands within the same category can't have the same shortcut key
 *
 * @param itemConfig - The command or category configuration being added/updated (with optional id for updates)
 * @param allCommands - All existing commands
 * @param allCategories - All existing categories
 * @returns Object with result and an error message if there's a clash
 */
export function checkForShortcutClash(
  itemConfig: ItemToCheck,
  allCommands: CommandConfig[],
  allCategories: CategoryConfig[]
): { hasClash: boolean; message?: string } {
  const { shortcutKey, type, id: existingItemId } = itemConfig;
  
  // Skip checking against itself when updating
  const filterSelf = (item: CommandConfig | CategoryConfig) => 
    !existingItemId || item.id !== existingItemId;
  
  // Case 1: If it's a category, check against other categories and commands without a category
  if (type === "category") {
    // Check against other categories
    const conflictingCategory = allCategories
      .filter(filterSelf)
      .find(cat => cat.shortcutKey === shortcutKey);
    
    if (conflictingCategory) {
      return {
        hasClash: true,
        message: `Shortcut key "${shortcutKey}" is already used by category "${conflictingCategory.title}"`
      };
    }
    
    // Check against commands without a category
    const conflictingCommand = allCommands
      .filter(filterSelf)
      .filter(cmd => !cmd.category || cmd.category === "no-category")
      .find(cmd => cmd.shortcutKey === shortcutKey);
    
    if (conflictingCommand) {
      return {
        hasClash: true,
        message: `Shortcut key "${shortcutKey}" is already used by command "${conflictingCommand.title}"`
      };
    }
  }
  
  // Case 2: If it's a command, the check depends on its category
  if (type === "command") {
    const category = "category" in itemConfig ? itemConfig.category : undefined;
    
    // If the command has no category, check against categories and other commands without a category
    if (!category || category === "no-category") {
      // Check against categories
      const conflictingCategory = allCategories
        .filter(filterSelf)
        .find(cat => cat.shortcutKey === shortcutKey);
      
      if (conflictingCategory) {
        return {
          hasClash: true,
          message: `Shortcut key "${shortcutKey}" is already used by category "${conflictingCategory.title}"`
        };
      }
      
      // Check against other commands without a category
      const conflictingCommand = allCommands
        .filter(filterSelf)
        .filter(cmd => !cmd.category || cmd.category === "no-category")
        .find(cmd => cmd.shortcutKey === shortcutKey);
      
      if (conflictingCommand) {
        return {
          hasClash: true,
          message: `Shortcut key "${shortcutKey}" is already used by command "${conflictingCommand.title}" without a category`
        };
      }
    } else {
      // If the command has a category, check against other commands in the same category
      const conflictingCommand = allCommands
        .filter(filterSelf)
        .filter(cmd => cmd.category === category)
        .find(cmd => cmd.shortcutKey === shortcutKey);
      
      if (conflictingCommand) {
        return {
          hasClash: true,
          message: `Shortcut key "${shortcutKey}" is already used by command "${conflictingCommand.title}" in the same category`
        };
      }
    }
  }
  
  // No clash found
  return { hasClash: false };
}
