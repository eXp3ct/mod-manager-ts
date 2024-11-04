import React from 'react'
import { Mod } from '../../../types/index'

type ModCardProp = {
  mod: Mod
}

export const ModCard: React.FC<ModCardProp> = ({ mod }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
      <h3 className="text-xl font-bold text-white mb-2">{mod.name}</h3>
      <p className="text-sm text-gray-400">Slug: {mod.slug}</p>
      <p className="text-sm text-gray-400">ID: {mod.id}</p>
      <p className="text-sm text-gray-400">Game ID: {mod.gameId}</p>
    </div>
  )
}
