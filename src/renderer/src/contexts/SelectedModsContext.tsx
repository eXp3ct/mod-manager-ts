import React, { createContext, useContext, useState } from 'react'
import { Mod } from 'src/types'

interface SelectedModsContextProps {
  selectedMods: Mod[]
  toggleModSelection: (mod: Mod) => void
  clearSelectedMods: () => void
}

const SelectedModsContext = createContext<SelectedModsContextProps | undefined>(undefined)

export const SelectedModsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [selectedMods, setSelectedMods] = useState<Mod[]>([])

  const toggleModSelection = (mod: Mod): void => {
    setSelectedMods((prevSelectedMods) => {
      if (prevSelectedMods.some((selectedMod) => selectedMod.id === mod.id)) {
        return prevSelectedMods.filter((selectedMod) => selectedMod.id !== mod.id)
      } else {
        return [...prevSelectedMods, { ...mod, selected: true }]
      }
    })
  }
  const clearSelectedMods = (): void => {
    setSelectedMods([])
  }
  return (
    <SelectedModsContext.Provider value={{ selectedMods, toggleModSelection, clearSelectedMods }}>
      {children}
    </SelectedModsContext.Provider>
  )
}

export const useSelectedMods = (): SelectedModsContextProps => {
  const context = useContext(SelectedModsContext)
  if (!context) {
    throw new Error('useSelectedMods must be used within a SelectedModsProvider')
  }
  return context
}
