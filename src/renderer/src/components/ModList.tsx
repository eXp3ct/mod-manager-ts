import React from 'react'
import { Mod } from '../../../types'
import { ModCard } from './ModCard'
import Pagination from './Pagination'
import ModCardSkeleton from './ModCardSkeleton'

type ModListProps = {
  mods: Mod[]
  pageNumber: number
  nextPage: (index: number) => void
  prevPage: (index: number) => void
  isLastPage: boolean
  isLoading: boolean
}

export const ModList: React.FC<ModListProps> = ({
  mods,
  pageNumber,
  nextPage,
  prevPage,
  isLastPage,
  isLoading
}) => {
  const lastPage = mods.length <= 0
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skeletons.map((s) => (
          <ModCardSkeleton key={s} />
        ))}
      </div>
    )
  }
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
