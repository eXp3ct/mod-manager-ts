import React, { useState } from 'react'
import { Category } from 'src/types'
import { ChevronRight, ChevronDown } from 'lucide-react'

type CategoryItemProps = {
  category: Category
  categories: Category[]
  level: number
  onClick: (category: Category) => void
  selectedCategoryId: number | undefined
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  categories,
  level,
  onClick,
  selectedCategoryId
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const isSelected = selectedCategoryId === category.id
  const childCategories = categories.filter((cat) => cat.parentCategoryId === category.id)
  const hasChildren = childCategories.length > 0

  return (
    <div className="w-full">
      <div
        className={`flex items-center w-full px-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-200 ${
          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={(e) => {
          e.preventDefault()
          onClick(category)
        }}
      >
        {hasChildren ? (
          <span className="mr-1 text-gray-400 h-full" onClick={(e) => e.stopPropagation()}>
            {isOpen ? (
              <ChevronDown className="w-4" onClick={() => setIsOpen(!isOpen)} />
            ) : (
              <ChevronRight className="w-4" onClick={() => setIsOpen(!isOpen)} />
            )}
          </span>
        ) : (
          <span className="w-5" />
        )}
        <div className="w-6 h-6 flex-shrink-0 mr-2">
          <img
            src={category.iconUrl}
            alt={category.slug}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <span className="text-sm">{category.name}</span>
      </div>

      {isOpen && hasChildren && (
        <div className="mt-1">
          {childCategories.map((childCategory) => (
            <CategoryItem
              key={childCategory.id}
              category={childCategory}
              categories={categories}
              level={level + 1}
              onClick={onClick}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CategorySidebar: React.FC<{
  categories: Category[]
  onChange: (category: Category) => void
  selectedCategoryId: number | undefined
  maxParentId: number | undefined
}> = ({ categories, onChange, selectedCategoryId, maxParentId }) => {
  const rootCategories = categories.filter((category) => category.parentCategoryId === maxParentId)

  return (
    <aside className="w-1/6 bg-gray-800 p-4 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Категории</h2>
      <div className="space-y-1">
        {rootCategories && rootCategories.length > 0 ? (
          rootCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              categories={categories}
              level={0}
              onClick={onChange}
              selectedCategoryId={selectedCategoryId}
            />
          ))
        ) : (
          <div className="text-gray-400">Нет доступных категорий</div>
        )}
      </div>
    </aside>
  )
}
