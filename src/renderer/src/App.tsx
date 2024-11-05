import { useEffect, useState } from 'react'
import { ModList } from './components/ModList'
import { Category, Mod, ModLoaderType, SearchSortFields } from 'src/types/index'
import { fetchCategories, searchMods } from 'src/curse_client/services/modService'
import { MinecraftVersion } from 'src/types/minecraft'
import { fetchMinecraftVersions } from 'src/curse_client/services/minecraftService'
import { CategorySidebar } from './components/CategoryItem'

function App(): JSX.Element {
  const [mods, setMods] = useState<Mod[]>([])
  const [versions, setVersions] = useState<MinecraftVersion[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  let loaders = Object.values(ModLoaderType) as string[]
  loaders = loaders.splice(0, loaders.length / 2) as string[]

  let sortFields = Object.values(SearchSortFields) as string[]
  sortFields = sortFields.splice(0, sortFields.length / 2) as string[]

  useEffect(() => {
    const loadMods = async (): Promise<void> => {
      try {
        const mods = await searchMods()

        setMods(mods)
      } catch (error) {
        console.error('Error fetching mods', error)
      }
    }
    const loadVersions = async (sortDesc: boolean): Promise<void> => {
      try {
        const versions = await fetchMinecraftVersions(sortDesc)

        setVersions(versions)
      } catch (error) {
        console.error('Error fetching versions', error)
      }
    }
    const loadCategories = async (): Promise<void> => {
      try {
        const categories = await fetchCategories()

        setCategories(categories)
      } catch (error) {
        console.error('Error fetching categories', error)
      }
    }

    loadCategories()
    loadVersions(true)
    loadMods()
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Навбар */}
      <nav className="flex items-center justify-between bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Minecraft Mod Manager</h1>
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-1/3"
        />
        <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Обновить</button>
      </nav>

      <div className="flex h-full">
        {/* Боковая панель с прокруткой */}
        <CategorySidebar categories={categories} />

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
                <select className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full">
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
                <select className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full">
                  {loaders.map((loader) => (
                    <option key={loader.length}>{loader}</option>
                  ))}
                </select>
              </div>

              {/* Сортировка */}
              <div className="flex flex-col w-40">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Сортировать по
                </label>
                <select className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full">
                  {sortFields.map((field) => (
                    <option key={field.length}>{field}</option>
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

export default App
