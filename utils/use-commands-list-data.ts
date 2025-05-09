import { useEffect, useMemo, useState } from "react"
import { CommandConfig, CategoryConfig } from "./types"
import * as storage from "./storage"

export function useCommandsListData(category?: string) {
  const [loading, setLoading] = useState(true)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [commands, setCommands] = useState<CommandConfig[]>([])
  const [categories, setCategories] = useState<CategoryConfig[]>([])

  async function loadData() {
    setLoading(true);
    const allCommands = await storage.getAllCommands()
    const allCategories = await storage.getAllCategories()
    setCommands(allCommands)
    setCategories(allCategories)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const listItems: (CommandConfig | CategoryConfig)[] = useMemo(() => {
    let items = [];

    if (!category) {
      const commandsWithoutCategory = commands.filter(c => !c.category || c.category === 'no-category')
      items = [...categories, ...commandsWithoutCategory]
    } else {
      items = commands.filter(c => c.category === category)
    }

    if (!searchValue?.length) return items;

    return items.filter(i => (
      i.title.toLowerCase().includes(searchValue)
      || i.description.toLowerCase().includes(searchValue)
    ))
  }, [searchValue, commands, categories, category])

  return {
    loading,
    isSearchMode,
    setIsSearchMode,
    searchValue,
    setSearchValue,
    hasCommands: commands.length > 0,
    listItems,
    loadData
  }
}