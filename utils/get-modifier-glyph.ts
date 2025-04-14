const glyphs: { [key: string]: string } = {
  command: '⌘',
  control: '⌃',
  option: '⌥',
  shift: '⇧',
}

export function getModifierGlyph(modifiers: string[]) {
  const mods = modifiers.map(mod => glyphs[mod])
  return mods.toString().replaceAll(',', '')
}
