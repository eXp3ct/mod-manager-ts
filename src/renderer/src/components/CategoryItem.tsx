import React, { useState } from 'react'
import { Category } from 'src/types'
import { ChevronRight, ChevronDown } from 'lucide-react'

type CategoryItemProps = {
  category: Category
  categories: Category[]
  level: number
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, categories, level }) => {
  const [isOpen, setIsOpen] = useState(false)

  const childCategories = categories.filter((cat) => cat.parentCategoryId === category.id)
  const hasChildren = childCategories.length > 0

  return (
    <div className="w-full">
      <div
        className="flex items-center w-full px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <span className="mr-1 text-gray-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CategorySidebar: React.FC<{ categories: Category[] }> = ({ categories }) => {
  console.log('All categories:', categories) // Добавляем лог для проверки данных

  const rootCategories = categories.filter(
    (category) => category.parentCategoryId === 6 || !category.parentCategoryId
  )

  console.log('Root categories:', rootCategories) // Проверяем корневые категории

  return (
    <aside className="w-1/6 bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Категории</h2>
      <div className="space-y-1">
        {rootCategories && rootCategories.length > 0 ? (
          rootCategories.map((category) => (
            <CategoryItem key={category.id} category={category} categories={categories} level={0} />
          ))
        ) : (
          <div className="text-gray-400">Нет доступных категорий</div>
        )}
      </div>
    </aside>
  )
}
