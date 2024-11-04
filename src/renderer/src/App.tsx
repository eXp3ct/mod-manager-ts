import { useEffect, useState } from 'react'
import { ModList } from './components/ModList'
import { Mod } from 'src/types'
import { searchMods } from '../../curse_client/services/modService'

function App(): JSX.Element {
  const [mods, setMods] = useState<Mod[]>([])

  useEffect(() => {
    const loadMods = async (): Promise<void> => {
      try {
        const mods = await searchMods()

        setMods(mods.data)
      } catch (error) {
        console.error('Error fetching mods', error)
      }
    }

    loadMods()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
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
        {/* Боковая панель */}
        <aside className="w-1/6 bg-gray-800 p-4">
          <h2 className="text-xl font-bold mb-4">Категории</h2>
          <ul className="space-y-2">
            <li className="hover:bg-gray-700 p-2 rounded-lg cursor-pointer">Все</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Популярные</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Последние</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">По версии</li>
          </ul>
        </aside>

        {/* Основная панель */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Кнопки фильтров и сортировки */}
          <div className="flex items-center justify-between mb-4">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Фильтры</button>

            <div className="flex space-x-4">
              {/* Фильтр по версии игры */}
              <select className="bg-gray-700 text-white p-2 rounded focus:outline-none">
                <option>Версия игры</option>
                <option>1.18</option>
                <option>1.17</option>
                <option>1.16</option>
                {/* Добавить другие версии */}
              </select>

              {/* Тип мод лоадера */}
              <select className="bg-gray-700 text-white p-2 rounded focus:outline-none">
                <option>Тип мод лоадера</option>
                <option>Forge</option>
                <option>Fabric</option>
                <option>Quilt</option>
              </select>

              {/* Сортировка */}
              <div className="relative">
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Сортировка
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg z-10 hidden group-hover:block">
                  <ul className="p-2">
                    <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">По имени</li>
                    <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">
                      По популярности
                    </li>
                    <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">По дате</li>
                  </ul>
                </div>
              </div>

              {/* Флажок возрастание/убывание */}
              <div className="flex items-center space-x-2">
                <span className="text-sm">По убыванию</span>
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" />
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
