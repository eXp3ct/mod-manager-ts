import React, { createContext, useContext, useState } from 'react'
import { Mod } from 'src/types'

interface SelectedModsContextProps {
  selectedMods: Mod[]
  toggleModSelection: (mod: Mod) => void
  clearSelectedMods: () => void
  showing: 'mods' | 'modpacks'
  setShowing: (showing: 'mods' | 'modpacks') => void
}

const SelectedModsContext = createContext<SelectedModsContextProps | undefined>(undefined)

export const SelectedModsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [selectedMods, setSelectedMods] = useState<Mod[]>([])
  const [showing, setShowing] = useState<'mods' | 'modpacks'>('mods')

  const toggleModSelection = (mod: Mod): void => {
    setSelectedMods((prevSelectedMods) => {
      const isSelected = prevSelectedMods.some((selectedMod) => selectedMod.id === mod.id)

      if (showing === 'mods') {
        return isSelected
          ? prevSelectedMods.filter((selectedMod) => selectedMod.id !== mod.id)
          : [...prevSelectedMods, { ...mod, selected: true }]
      }

      if (showing === 'modpacks') {
        return isSelected ? [] : [{ ...mod, selected: true }]
      }

      return prevSelectedMods
    })
  }
  const clearSelectedMods = (): void => {
    setSelectedMods([])
  }
  return (
    <SelectedModsContext.Provider
      value={{ selectedMods, toggleModSelection, clearSelectedMods, showing, setShowing }}
    >
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
