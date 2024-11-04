import React from 'react'
import { Mod } from '../../../types'
import { ModCard } from './ModCard'

type ModListProps = {
  mods: Mod[]
}

export const ModList: React.FC<ModListProps> = ({ mods }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  )
}
