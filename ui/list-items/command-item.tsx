import { List } from "@raycast/api";
import { CommandConfig, getModifierGlyph } from "../../utils";
import { CommandActions } from "./command-actions";
import { SharedActionsProps } from "./shared-actions";

export interface CommandItemProps extends SharedActionsProps {
  command: CommandConfig;
}

export function CommandItem({ command, loadData, isSearchMode, setIsSearchMode }: CommandItemProps) {
  return (
    <List.Item
      key={command.id}
      title={command.title}
      subtitle={command.description}
      accessories={[{
        text: `${getModifierGlyph(command.modifiers)}${command.commandKeys}`,
      }, {
        tag: command.shortcutKey
      }]}
      actions={
        <CommandActions 
          command={command} 
          loadData={loadData} 
          isSearchMode={isSearchMode} 
          setIsSearchMode={setIsSearchMode} 
        />
      }
    />
  )
}