import React, { useState } from 'react'
import { Mod } from '../../../types/index'

type ModCardProp = {
  mod: Mod
}

export const ModCard: React.FC<ModCardProp> = ({ mod }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{mod.name}</h3>
          <p className="text-sm text-gray-400">{mod.slug}</p>
          <p className="text-sm text-gray-400 text-clip">{mod.summary}</p>
          <p className="text-sm text-gray-400">Game ID: {mod.gameId}</p>
        </div>
        {!imageError && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={mod.logo.url}
              alt={mod.slug}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
