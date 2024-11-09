import { useSelectedMods } from '@renderer/contexts/SelectedModsContext'
import React, { useEffect, useState } from 'react'
import { File, Mod, ModStatus, ReleaseType, SearchState } from 'src/types'
import { useError } from './ErrorProvider'
import { fetchModFilesCached } from 'src/curse_client/services/cacheService'

type ModTableRowProps = {
  mod: Mod
  searchParams: Partial<SearchState>
  onFileSelect: (modId: number, fileId: number) => void
}

const ModTableRow: React.FC<ModTableRowProps> = ({ mod, searchParams, onFileSelect }) => {
  const { logError } = useError()
  const { toggleModSelection } = useSelectedMods()
  const [files, setFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchModFilesCached(mod.id, searchParams.gameVersion, searchParams.modLoaderType)
      .then((files) => {
        setFiles(files)
        setSelectedFile(files[0])
        if (files[0]) {
          onFileSelect(mod.id, files[0].id) // Инициализируем выбранный файл в родительском компоненте
        }
      })
      .catch((error) => {
        logError(
          'Ошибка загрузки файлов',
          `Произошла ошибка при загрузке списка файлов для мода ${mod.name}`,
          {
            type: 'DEV_ONLY',
            error,
            details: { Mod: mod }
          }
        )
      })
  }, [])

  const handleFileChange = (fileId: number): void => {
    const file = files.find((f) => f.id === fileId)
    setSelectedFile(file || null)
    onFileSelect(mod.id, fileId) // Обновляем выбранный файл в родительском состоянии
  }

  return (
    <tr key={mod.id} className="border-b border-gray-700">
      <td className="p-4">
        <div className="inline-flex items-center">
          <label className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-lg bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-500"
              checked={mod.selected}
              onChange={() => toggleModSelection(mod)}
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
      </td>
      <td className="p-4">{mod.name}</td>
      <td className="p-4">{ModStatus[mod.status]}</td>
      <td className="p-4">
        {new Intl.DateTimeFormat('ru-RU', {
          dateStyle: 'short'
        }).format(new Date(mod.dateModified))}
      </td>
      <td className="p-4">
        <select
          className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none w-full"
          value={selectedFile?.id || ''}
          onChange={(e) => handleFileChange(Number.parseInt(e.target.value))}
        >
          {files.map((file) => (
            <option
              key={file.id}
              value={file.id}
              className={
                file.releaseType === ReleaseType.Release
                  ? 'text-blue-400'
                  : file.releaseType === ReleaseType.Beta
                    ? 'text-orange-400'
                    : 'text-yellow-400'
              }
            >
              {file.displayName}
            </option>
          ))}
        </select>
      </td>
      <td className="p-4">
        {mod.isAvailable &&
        selectedFile?.isAvailable &&
        mod.status !==
          (ModStatus.Abandoned || ModStatus.Deleted || ModStatus.Inactive || ModStatus.Rejected) ? (
          <span className="text-green-400">Доступен</span>
        ) : (
          <span className="text-red-400">Недоступен</span>
        )}
      </td>
    </tr>
  )
}

export default ModTableRow
