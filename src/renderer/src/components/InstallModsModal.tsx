import { useSelectedMods } from '@renderer/contexts/SelectedModsContext'
import React from 'react'
import ModTableRow from './ModTableRow'
import { SearchState } from 'src/types'

type InstallModsModalProps = {
  onClose: () => void
  searchParams: Partial<SearchState>
}
const InstallModsModal: React.FC<InstallModsModalProps> = ({ onClose, searchParams }) => {
  const { selectedMods, clearSelectedMods } = useSelectedMods()

  console.log(selectedMods)
  return (
    <div
      className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose} // Обработчик клика для закрытия окна
    >
      <div
        className="bg-gray-800 p-6 rounded-lg max-w-[70vw] w-full overflow-y-auto max-h-[90vh] overscroll-contain" // Останавливаем всплытие события
        onClick={(e) => e.stopPropagation()}
      >
        {selectedMods.length > 0 ? (
          <div className="overflow-x-auto rounded-lg">
            <h1 className="text-lg mb-6 font-bold">Выбранные моды {selectedMods.length}</h1>
            <table className="min-w-full bg-gray-800 text-white rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <td className="w-1" />
                  {/* Заголовки столбцов */}
                  <th className="p-4 text-left font-bold">Название</th>

                  {/* Добавьте заголовок для нового столбца здесь */}
                  <th className="p-4 text-left font-bold">Статус</th>

                  {/* Пример для кнопок действий */}
                  <th className="p-4 text-left font-bold">Дата обновления</th>
                  <th className="p-4 text-left font-bold">Файл</th>
                  <th className="p-4 text-left font-bold">Доступность</th>
                </tr>
              </thead>
              <tbody>
                {/* Строка для одного мода */}
                {selectedMods.map((mod) => (
                  <ModTableRow key={mod.id} mod={mod} searchParams={searchParams} />
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-between items-center">
              <div className="mt-6 text-white px-4 py-2 rounded-lg">
                *<span className="text-blue-400 mr-2">Релиз</span>
                <span className="text-orange-400 mr-2">Бета</span>
                <span className="text-yellow-400 mr-2">Альфа</span>
              </div>
              <div className="block">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-6"
                  onClick={() => clearSelectedMods()}
                >
                  Очистить
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Установить
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <h1 className="text-lg">Нет выбранных модов</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstallModsModal
