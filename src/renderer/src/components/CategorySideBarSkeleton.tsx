import React from 'react'

const CategorySkeleton: React.FC = () => {
  return (
    <div className="flex items-center w-full px-2 py-1.5 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200">
      {/* Chevron placeholder */}
      <span className="mr-1 text-gray-400 h-full">
        <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
      </span>

      {/* Icon placeholder */}
      <div className="w-6 h-6 bg-gray-700 rounded-lg flex-shrink-0 mr-2 animate-pulse" />

      {/* Name placeholder */}
      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
    </div>
  )
}

const CategoriesListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <aside className="w-1/6 bg-gray-800 p-4 sticky top-0 h-screen overflow-y-auto">
      {/* Заголовок */}
      <h2 className="text-xl font-bold mb-4 text-white">Категории</h2>

      <div className="space-y-1">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
      </div>
    </aside>
  )
}

export default CategoriesListSkeleton
