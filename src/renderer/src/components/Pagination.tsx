import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PaginationProps {
  pageNumber: number
  nextPage: (newPage: number) => void
  prevPage: (newPage: number) => void
  isLastPage: boolean // новый пропс, чтобы понимать, когда достигли последней страницы
}

const Pagination: React.FC<PaginationProps> = ({ pageNumber, nextPage, prevPage, isLastPage }) => {
  // Определяем, доступны ли кнопки "Назад" и "Вперед"
  const prevAvailable = pageNumber > 1
  const nextAvailable = !isLastPage

  return (
    <div className="flex justify-center mt-5 items-center">
      {/* Кнопка "Назад" */}
      <ChevronLeft
        className={`rounded-lg ${prevAvailable ? 'hover:cursor-pointer text-blue-500' : 'text-blue-300 hover:cursor-not-allowed'}`}
        onClick={() => {
          if (prevAvailable) {
            prevPage(pageNumber - 1)
          }
        }}
      />
      {/* Текущая страница */}
      <div className="mx-2 flex">
        <div className="bg-blue-500 w-6 h-6 rounded-lg flex justify-center items-center text-white">
          {pageNumber}
        </div>
      </div>
      {/* Кнопка "Вперед" */}
      <ChevronRight
        className={`rounded-lg ${nextAvailable ? 'hover:cursor-pointer text-blue-500' : 'text-blue-300 hover:cursor-not-allowed'}`}
        onClick={() => {
          if (nextAvailable) {
            nextPage(pageNumber + 1)
          }
        }}
      />
    </div>
  )
}

export default Pagination
