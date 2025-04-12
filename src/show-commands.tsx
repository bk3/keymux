import { List, useNavigation } from "@raycast/api";
import runKeyboardShortcut from '../utils/run-keyboard-shortcut';

const glyphs: { [key: string]: string } = {
  command: '⌘',
  control: '⌃',
  option: '⌥',
  shift: '⇧',
}

function convertModifiersToGlyphs(modifiers: string[]) {
  const mods = modifiers.map(mod => glyphs[mod])
  return mods.toString().replaceAll(',', '')
}

const items = [
  {
    id: '1',
    title: 'Arc',
    description: 'Open Arc web browser',
    shortcutKey: 'a',
    modifiers: ['command', 'option', 'control'],
    commandKeys: 'a',
  },
  {
    id: '2',
    title: 'Notion',
    description: 'Open Notion application',
    shortcutKey: 'w',
    modifiers: ['command', 'option', 'control'],
    commandKeys: 'w',
  },
]

export default function ShowCommands() {
  const { pop } = useNavigation()

  return (
    <List
      searchBarPlaceholder="Press key to run command"
      onSearchTextChange={val => {
        const shortcut = items.filter(item => item.shortcutKey === val)?.[0];
        if (!shortcut) return;
        runKeyboardShortcut(shortcut.modifiers, shortcut.commandKeys)
        pop();
      }}
    >
      {items.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.description}
          accessories={[{
            text: `${convertModifiersToGlyphs(item.modifiers)}${item.commandKeys.toUpperCase()}`,
          }, {
            tag: item.shortcutKey?.toUpperCase()
          }]}
        />
      ))}
    </List>
  );
}
