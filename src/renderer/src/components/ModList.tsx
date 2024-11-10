import React from 'react'
import { Mod } from '../../../types'
import { ModCard } from './ModCard'
import Pagination from './Pagination'

type ModListProps = {
  mods: Mod[]
  pageNumber: number
  nextPage: (index: number) => void
  prevPage: (index: number) => void
  isLastPage: boolean
}

export const ModList: React.FC<ModListProps> = ({
  mods,
  pageNumber,
  nextPage,
  prevPage,
  isLastPage
}) => {
  const lastPage = mods.length <= 0
  return (
    <>
      {mods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <h1 className="text-lg">Ничего не удалось найти</h1>
        </div>
      )}
      <Pagination
        pageNumber={pageNumber}
        prevPage={prevPage}
        nextPage={nextPage}
        isLastPage={isLastPage || lastPage}
      />
    </>
  )
}
