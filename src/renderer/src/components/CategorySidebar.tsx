import React, { useState } from 'react'
import { Category } from 'src/types'
import { ChevronRight, ChevronDown } from 'lucide-react'

const MAX_PARENT_CATEGORY_ID = 6

type CategoryItemProps = {
  category: Category
  categories: Category[]
  level: number
  onClick: (category: Category) => void
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, categories, level, onClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  const childCategories = categories.filter((cat) => cat.parentCategoryId === category.id)
  const hasChildren = childCategories.length > 0

  return (
    <div className="w-full">
      <div
        className="flex items-center w-full px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={(e) => {
          e.preventDefault()
          onClick(category)
        }}
      >
        {hasChildren ? (
          <span className="mr-1 text-gray-400 h-full">
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
        <span className="text-gray-200 text-sm">{category.name}</span>
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
}> = ({ categories, onChange }) => {
  const rootCategories = categories.filter(
    (category) => category.parentCategoryId === MAX_PARENT_CATEGORY_ID || !category.parentCategoryId
  )

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
            />
          ))
        ) : (
          <div className="text-gray-400">Нет доступных категорий</div>
        )}
      </div>
    </aside>
  )
}