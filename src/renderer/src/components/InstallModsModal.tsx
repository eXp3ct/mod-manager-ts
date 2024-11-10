import { useSelectedMods } from '@renderer/contexts/SelectedModsContext'
import React, { useState } from 'react'
import ModTableRow from './ModTableRow'
import { File, RelationType, SearchState } from 'src/types'
import { fetchModFilesCached } from 'src/curse_client/services/cacheService'
import { fetchFiles } from 'src/curse_client/services/filesService'
import { useError } from './ErrorProvider'

type InstallModsModalProps = {
  onClose: () => void
  searchParams: Partial<SearchState>
}
const InstallModsModal: React.FC<InstallModsModalProps> = ({ onClose, searchParams }) => {
  const { logError } = useError()
  const { selectedMods, clearSelectedMods } = useSelectedMods()
  const [selectedFiles, setSelectedFiles] = useState<{ [modId: number]: number }>({})
  const [fodlerPath, setFolderPath] = useState<string>('')
  const [isInstalling, setIsInstalling] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [canClose, setCanClose] = useState<boolean>(true)

  // Рекурсивная функция для добавления обязательных зависимостей
  const addRequiredDependencies = async (modId: number, fileId: number): Promise<void> => {
    const files = await fetchModFilesCached(
      modId,
      searchParams.gameVersion,
      searchParams.modLoaderType
    )
    const selectedFile = files.find((file) => file.id === fileId)

    if (!selectedFile) return

    // Обрабатываем все зависимости выбранного файла
    for (const dependency of selectedFile.dependencies) {
      if (dependency.relationType !== RelationType.RequiredDependency) continue
      // Если мод с этой зависимостью ещё не добавлен, то добавляем
      if (!selectedFiles[dependency.modId]) {
        const dependencyFiles = await fetchModFilesCached(
          dependency.modId,
          searchParams.gameVersion,
          searchParams.modLoaderType
        )
        const primaryFile = dependencyFiles[0] // выбираем первый файл как основной, можно поменять логику

        if (primaryFile) {
          setSelectedFiles((prevSelectedFiles) => ({
            ...prevSelectedFiles,
            [dependency.modId]: primaryFile.id
          }))

          // Рекурсивно добавляем обязательные зависимости зависимого мода
          await addRequiredDependencies(dependency.modId, primaryFile.id)
        }
      }
    }
  }

  const handleFileSelectionChange = async (modId: number, fileId: number): Promise<void> => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [modId]: fileId
    }))
    await addRequiredDependencies(modId, fileId)
  }

  const handleStartInstalling = async (): Promise<void> => {
    let tempPath: string = ''
    if (!fodlerPath) {
      const path = await window.electron.selectFolder()
      if (path) {
        setFolderPath(path)
        tempPath = path
      } else return
    }
    const fileIds = [...new Set(Object.values(selectedFiles))]

    let files: File[] = []
    try {
      files = await fetchFiles(fileIds)
    } catch (error) {
      logError('Ошибка загрузки файлов', 'Произошла ошибка при получении файлов выбранных модов', {
        type: 'DEV_ONLY',
        error,
        details: { Dict: selectedFiles }
      })
      return
    }

    const downloadUrls = [...new Set(files.map((file) => file.downloadUrl))]

    setIsInstalling(true)
    setProgress(0)
    setCanClose(false)
    for (let i = 0; i < downloadUrls.length; i++) {
      const url = downloadUrls[i]
      await window.electron.downloadFiles([url], tempPath ? tempPath : fodlerPath)

      // Обновляем прогресс после каждого файла
      setProgress(((i + 1) / downloadUrls.length) * 100)
    }

    setCanClose(true)
    setIsInstalling(false)
    setProgress(0)
  }

  return (
    <div
      className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => canClose && onClose()}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg max-w-[70vw] w-full overflow-y-auto max-h-[90vh] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedMods.length > 0 ? (
          <div className="overflow-x-auto rounded-lg">
            <h1 className="text-lg mb-6 font-bold">Выбранные моды {selectedMods.length}</h1>
            <table className="min-w-full bg-gray-800 text-white rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <td className="w-1" />
                  <th className="p-4 text-left font-bold">Название</th>
                  <th className="p-4 text-left font-bold">Статус</th>
                  <th className="p-4 text-left font-bold">Дата обновления</th>
                  <th className="p-4 text-left font-bold">Файл</th>
                  <th className="p-4 text-left font-bold">Доступность</th>
                </tr>
              </thead>
              <tbody>
                {selectedMods.map((mod) => (
                  <ModTableRow
                    key={mod.id}
                    mod={mod}
                    searchParams={searchParams}
                    onFileSelect={handleFileSelectionChange}
                  />
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-6 gap-4">
              <div className="text-white px-4 py-2 rounded-lg">
                *<span className="text-blue-400 mr-2">Релиз</span>
                <span className="text-orange-400 mr-2">Бета</span>
                <span className="text-yellow-400 mr-2">Альфа</span>
              </div>

              {isInstalling && (
                <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isInstalling
                      ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                  onClick={clearSelectedMods}
                  disabled={isInstalling}
                >
                  Очистить
                </button>

                <button
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isInstalling
                      ? 'bg-blue-400 text-blue-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={handleStartInstalling}
                  disabled={isInstalling}
                >
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
