import React from 'react'

const ModCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="flex-1">
          {/* Заголовок */}
          <div className="h-7 bg-gray-700 rounded-md mb-2 w-3/4 animate-pulse" />

          {/* Слаг */}
          <div className="h-4 bg-gray-700 rounded-md mb-1 w-1/2 animate-pulse" />

          {/* Описание - три строки */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded-md w-full animate-pulse" />
            <div className="h-4 bg-gray-700 rounded-md w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded-md w-4/6 animate-pulse" />
          </div>

          {/* Количество загрузок */}
          <div className="flex items-center mt-2">
            <div className="w-5 h-5 bg-gray-700 rounded-md mr-2 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded-md w-20 animate-pulse" />
          </div>
        </div>

        {/* Изображение */}
        <div className="w-32 h-32 bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
      </div>

      {/* Кнопки */}
      <div className="mt-4 flex items-center space-x-2">
        {/* Чекбокс */}
        <div className="h-10 w-10 bg-gray-700 rounded-lg animate-pulse" />

        {/* Кнопка "Подробнее" */}
        <div className="h-10 bg-gray-700 rounded-lg w-28 animate-pulse" />

        {/* Кнопка-ссылка */}
        <div className="h-10 w-10 bg-gray-700 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}

export default ModCardSkeleton
