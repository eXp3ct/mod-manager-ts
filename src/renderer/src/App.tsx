import { useEffect, useState } from 'react'
import { ErrorProvider, useError } from './components/ErrorProvider'
import { fetchMinecraftVersions } from 'src/curse_client/services/minecraftService'
import { fetchCategories } from 'src/curse_client/services/modService'
import { Mod, Category, ModLoaderType, SearchSortField, SearchState } from 'src/types'
import { MinecraftVersion } from 'src/types/minecraft'
import { CategorySidebar } from './components/CategorySidebar'
import { ModList } from './components/ModList'
import { searchMods } from 'src/curse_client/services/searchService'

// Оборачиваем основное содержимое в компонент для доступа к хуку useError
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
    modLoaderType: ModLoaderType.Forge,
    index: 0,
    pageSize: 15
  })
  const [searchInput, setSearchInput] = useState<string>('')

  const loaders = Object.keys(ModLoaderType)
    .filter((key) => isNaN(Number(key))) // Оставляем только строковые ключи
    .map((key) => key as keyof typeof ModLoaderType)

  const sortFields = Object.keys(SearchSortField)
    .filter((key) => isNaN(Number(key))) // Оставляем только строковые ключи
    .map((key) => key as keyof typeof SearchSortField)

  useEffect(() => {
    searchMods(searchParams)
      .then(setMods)
      .catch((error) => {
        logError('Ошибка при поиске модов', {
          type: 'DEV_ONLY',
          error,
          details: { searchParams }
        })
      })
  }, [searchParams])

  useEffect(() => {
    Promise.all([fetchCategories(), fetchMinecraftVersions(true)])
      .then((value) => {
        setCategories(value[0])
        setVersions(value[1])
      })
      .catch((error) => {
        // Логируем ошибку загрузки как DEV_ONLY
        logError('Ошибка загрузки данных', {
          type: 'CRITICAL',
          error,
          details: { component: 'App', action: 'initial-load' }
        })
      })
  }, [logError])

  const handleVersionChange = (gameVersion: string): void => {
    setSearchParams((prev) => ({ ...prev, gameVersion }))
  }

  const handleModLoaderChange = (modLoaderType: ModLoaderType): void => {
    setSearchParams((prev) => ({ ...prev, modLoaderType }))
  }

  const handleSortFieldChange = (sortField: SearchSortField): void => {
    setSearchParams((prev) => ({ ...prev, sortField }))
  }

  const handleSearchFilterChange = (filter: string): void => {
    setSearchParams((prev) => ({ ...prev, searchFilter: filter }))
  }

  const handleCategoryChange = (category: Category | undefined): void => {
    setSearchParams((prev) => ({ ...prev, categoryId: category?.id }))
  }

  // Остальной код компонента остается тем же
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Навбар */}
      <nav className="flex items-center justify-between bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Minecraft Mod Manager</h1>
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-1/3"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchFilterChange(searchInput)
          }}
        />
        <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Обновить</button>
      </nav>

      <div className="flex h-full">
        {/* Боковая панель с прокруткой */}
        <CategorySidebar categories={categories} onChange={handleCategoryChange} />

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
                    <option key={loader.length} value={ModLoaderType[loader]}>
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
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Default checkbox
                </label>
              </div>
            </div>
          </div>

          {/* Сетка карточек модов */}
          <ModList mods={mods} />
        </main>
      </div>
    </div>
  )
}

// Основной компонент теперь оборачивает контент в ErrorProvider
function App(): JSX.Element {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  )
}

export default App
