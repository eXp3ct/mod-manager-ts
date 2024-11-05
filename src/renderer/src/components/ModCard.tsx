import React, { useState } from 'react'
import { Mod } from '../../../types/index'

type ModCardProp = {
  mod: Mod
}

export const ModCard: React.FC<ModCardProp> = ({ mod }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors h-full flex flex-col">
      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{mod.name}</h3>
          <p className="text-sm text-gray-400 mb-1">{mod.slug}</p>
          <p className="text-sm text-gray-400 text-clip line-clamp-3">{mod.summary}</p>
        </div>
        {!imageError && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={mod.logo.url}
              alt={mod.name}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>
      {/* Добавьте кнопки здесь */}
      <div className="mt-4 space-x-2">
        {/* Применяйте эти стили для кнопок:
          - bg-blue-500 для фона
          - px-4 py-2 для внутренних отступов
          - rounded для скругления углов
          - hover:bg-blue-600 для эффекта при наведении
        */}
        <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">Выбрать</button>
        <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">Подробнее</button>
      </div>
    </div>
  )
}
