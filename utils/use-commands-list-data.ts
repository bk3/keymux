import { useEffect, useMemo, useState } from "react"
import { CommandConfig, CategoryConfig } from "./types"
import * as storage from "./storage"

export default function useCommandsListData() {
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

  const commandListItems: (CommandConfig | CategoryConfig)[] = useMemo(() => {
    const commandsWithoutCategory = commands.filter(c => !c.category || c.category === 'no-category')
    const items = [...categories, ...commandsWithoutCategory]
    if (!searchValue?.length) return items;

    return items.filter(i => (
      i.title.toLowerCase().includes(searchValue)
      || i.description.toLowerCase().includes(searchValue)
    ))
  }, [searchValue, commands, categories])

  return {
    loading,
    isSearchMode,
    setIsSearchMode,
    searchValue,
    setSearchValue,
    commands,
    commandListItems,
    categories,
    loadData
  }
}