import { useEffect, useMemo, useState } from 'react'
import { ErrorProvider, useError } from './components/ErrorProvider'
import { fetchMinecraftVersions } from 'src/curse_client/services/minecraftService'
import { fetchCategories } from 'src/curse_client/services/modService'
import { Mod, Category, ModLoaderType, SearchSortField, SearchState, SortOrder } from 'src/types'
import { MinecraftVersion } from 'src/types/minecraft'
import { CategorySidebar } from './components/CategorySidebar'
import { ModList } from './components/ModList'
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'
import { fetchMods } from 'src/curse_client/services/cacheService'
import { SelectedModsProvider } from './contexts/SelectedModsContext'
import InstallModsModal from './components/InstallModsModal'
import CategoriesListSkeleton from './components/CategorySideBarSkeleton'

const PAGINATION_LIMIT = 10000

function AppContent(): JSX.Element {
  const { logError } = useError()
  const [mods, setMods] = useState<Mod[]>([])
  const [versions, setVersions] = useState<MinecraftVersion[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchParams, setSearchParams] = useState<Partial<SearchState>>({
    gameId: 432,
    gameVersion: '1.12.2',
    classId: 6,
    sortField: SearchSortField.TotalDownloads,
    sortOrder: SortOrder.Desc,
    modLoaderType: ModLoaderType.Forge,
    index: 0,
    pageSize: 15
  })
  const [searchInput, setSearchInput] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false)
  const [isModLoading, setModIsLoading] = useState<boolean>(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true)

  const loaders = Object.keys(ModLoaderType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => key as keyof typeof ModLoaderType)

  const sortFields = Object.keys(SearchSortField)
    .filter((key) => isNaN(Number(key)))
    .map((key) => key as keyof typeof SearchSortField)

  useMemo(() => {
    setModIsLoading(true)
    fetchMods(searchParams)
      .then((mods) => {
        setMods(mods)
        setModIsLoading(false)
      })
      .catch((error) => {
        logError('Ошибка поиска', 'Были введены некорреткные данные', {
          type: 'DEV_ONLY',
          error,
          details: { searchParams }
        })
      })
  }, [searchParams])

  useEffect(() => {
    setIsCategoriesLoading(true)
    Promise.all([fetchCategories(), fetchMinecraftVersions(true)])
      .then((value) => {
        setCategories(value[0])
        setVersions(value[1])
        setIsCategoriesLoading(false)
      })
      .catch((error) => {
        // Логируем ошибку загрузки как DEV_ONLY
        logError('Ошибка загрузки данных', 'Выбраны некорреткные данные', {
          type: 'CRITICAL',
          error,
          details: { component: 'App', action: 'initial-load' }
        })
      })
  }, [logError])

  const handleVersionChange = (gameVersion: string): void => {
    setSearchParams((prev) => ({ ...prev, gameVersion, index: 0 }))
    setPageNumber(1)
  }

  const handleModLoaderChange = (modLoaderType: ModLoaderType): void => {
    setSearchParams((prev) => ({ ...prev, modLoaderType, index: 0 }))
    setPageNumber(1)
  }

  const handleSortFieldChange = (sortField: SearchSortField): void => {
    setSearchParams((prev) => ({ ...prev, sortField, index: 0 }))
    setPageNumber(1)
  }

  const handleSearchFilterChange = (filter: string): void => {
    setSearchParams((prev) => ({ ...prev, searchFilter: filter, index: 0 }))
    setPageNumber(1)
  }

  const handleCategoryChange = (category: Category | undefined): void => {
    if (category?.id === searchParams.categoryId) {
      setSearchParams((prev) => ({ ...prev, categoryId: undefined, index: 0 }))
      setPageNumber(1)
      return
    }
    setSearchParams((prev) => ({ ...prev, categoryId: category?.id, index: 0 }))
    setPageNumber(1)
  }

  const handleIndexChangePrev = (pageNumber: number): void => {
    const pageSize = searchParams.pageSize as number
    setSearchParams((prev) => ({ ...prev, index: (prev.index as number) - pageSize }))
    setPageNumber(pageNumber)
  }

  const handleIndexChangeNext = (pageNumber: number): void => {
    const pageSize = searchParams.pageSize as number
    setSearchParams((prev) => ({ ...prev, index: (prev.index as number) + pageSize }))
    setPageNumber(pageNumber)
  }

  const toggleSortOrder = (): void => {
    let order: SortOrder
    if (searchParams.sortOrder === SortOrder.Desc) order = SortOrder.Asc
    else order = SortOrder.Desc

    setSearchParams((prev) => ({ ...prev, sortOrder: order }))
  }

  // Остальной код компонента остается тем же
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Навбар */}
      <nav className="flex items-center justify-between bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          Minecraft Mod Manager {import.meta.env.VITE_APP_VERSION}
        </h1>
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-1/3"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchFilterChange(searchInput)
          }}
        />
      </nav>

      <div className="flex h-full">
        {/* Боковая панель с прокруткой */}
        {isCategoriesLoading ? (
          <CategoriesListSkeleton count={16} />
        ) : (
          <CategorySidebar
            categories={categories}
            onChange={handleCategoryChange}
            selectedCategoryId={searchParams.categoryId}
          />
        )}

        {/* Основная панель с прокруткой */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Кнопки фильтров и сортировки */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              {/* Фильтр по версии игры */}
              <div className="flex flex-col w-40">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Версия игры
                </label>
                <select
                  value={searchParams.gameVersion}
                  className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full"
                  onChange={(e) => handleVersionChange(e.target.value)}
                >
                  {versions.map((version) => (
                    <option key={version.id}>{version.versionString}</option>
                  ))}
                </select>
              </div>

              {/* Тип мод лоадера */}
              <div className="flex flex-col w-40">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Загрузчик
                </label>
                <select
                  value={searchParams.modLoaderType}
                  onChange={(e) => handleModLoaderChange(ModLoaderType[e.target.value])}
                  className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full"
                >
                  {loaders.map((loader) => (
                    <option key={loader} value={ModLoaderType[loader]}>
                      {loader}
                    </option>
                  ))}
                </select>
              </div>

              {/* Сортировка */}
              <div className="flex flex-col w-40">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Сортировать по
                </label>
                <select
                  value={searchParams.sortField}
                  onChange={(e) => handleSortFieldChange(SearchSortField[e.target.value])}
                  className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full"
                >
                  {sortFields.map((field) => (
                    <option key={field} value={SearchSortField[field]}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              {/* Флажок возрастание/убывание */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={toggleSortOrder} // добавьте метод для переключения порядка сортировки
                  className="p-2 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600"
                >
                  {searchParams.sortOrder === SortOrder.Desc ? (
                    <ArrowDownWideNarrow size={24} />
                  ) : (
                    <ArrowUpWideNarrow size={24} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <button
                className="p-2 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600"
                onClick={() => setShowInstallModal(true)}
              >
                Начать установку
              </button>
              {showInstallModal && (
                <InstallModsModal
                  onClose={() => setShowInstallModal(false)}
                  searchParams={searchParams}
                />
              )}
            </div>
          </div>

          {/* Сетка карточек модов */}
          <ModList
            mods={mods}
            pageNumber={pageNumber}
            prevPage={handleIndexChangePrev}
            nextPage={handleIndexChangeNext}
            isLastPage={
              (searchParams.index as number) + (searchParams.pageSize as number) > PAGINATION_LIMIT
            }
            isLoading={isModLoading}
          />
        </main>
      </div>
    </div>
  )
}

// Основной компонент теперь оборачивает контент в ErrorProvider
function App(): JSX.Element {
  return (
    <ErrorProvider>
      <SelectedModsProvider>
        <AppContent />
      </SelectedModsProvider>
    </ErrorProvider>
  )
}

export default App
