import React, { useState } from 'react'
import { Mod } from 'src/types'
import { useError } from './ErrorProvider'
import { Download, SquareArrowOutUpRight } from 'lucide-react'
import HtmlModal from './HtmlModal'
import { fetchDetails } from 'src/curse_client/services/modService'

type ModCardProp = {
  mod: Mod
}

export const ModCard: React.FC<ModCardProp> = ({ mod }) => {
  const { logError } = useError()
  const [imageError, setImageError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [htmlContent, setHtmlContent] = useState<string>('')

  const handleDetailsClick = async (): Promise<void> => {
    try {
      // Делаем запрос к API для получения HTML
      fetchDetails(mod.id)
        .then((data) => setHtmlContent(data))
        .catch((error) => {
          logError('Ошибка загрузки описания', {
            type: 'DEV_ONLY',
            error,
            details: { 'Mod id': mod.id }
          })
        })

      setShowModal(true)
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
    }
  }
  const handleImageError = (): void => {
    logError('Ошибка загрузки изображения', {
      type: 'DEV_ONLY'
    })
    setImageError(true)
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors h-full flex flex-col">
      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{mod.name}</h3>
          <p className="text-sm text-gray-400 mb-1">{mod.slug}</p>
          <p className="text-sm text-gray-400 text-clip line-clamp-3">{mod.summary}</p>
          <span className="text-sm text-gray-400 flex mt-2 items-start">
            <Download className="mr-2" size={20} />
            {new Intl.NumberFormat('ru-RU').format(mod.downloadCount)}
          </span>
        </div>
        {!imageError && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={mod.logo.url}
              alt={mod.slug}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        )}
      </div>

      {/* Добавленные кнопки */}
      <div className="mt-4 flex items-center space-x-2">
        {/* Чекбокс выбора мода */}
        <div className="inline-flex items-center">
          <label className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              className="peer h-10 w-10 cursor-pointer transition-all appearance-none rounded-lg bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-500"
              id="check-custom-style"
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
        </div>

        {/* Кнопка "Подробнее" */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleDetailsClick}
        >
          Подробнее
        </button>

        {/* Показываем модальное окно, если showModal = true */}
        {showModal && <HtmlModal htmlContent={htmlContent} onClose={() => setShowModal(false)} />}

        {/* Кнопка-ссылка с иконкой */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          onClick={() => window.open(mod.links.websiteUrl, '_blank')}
        >
          <SquareArrowOutUpRight />
        </button>
      </div>
    </div>
  )
}
