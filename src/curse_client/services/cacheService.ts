import { File, Mod, ModLoaderType, SearchState } from 'src/types'
import { searchMods } from './searchService'
import { fetchModFiles } from './filesService'

// Кэш для хранения данных по уникальным параметрам
const modsCache = new Map<string, Mod[]>()
const filesCache = new Map<number, File[]>()

export const fetchMods = async (searchParams: Partial<SearchState>): Promise<Mod[]> => {
  const cacheKey = JSON.stringify(searchParams) // Формируем ключ на основе параметров

  // Проверяем, есть ли данные в кэше
  if (modsCache.has(cacheKey)) {
    return modsCache.get(cacheKey) as Mod[] // Возвращаем кэшированные данные
  }

  try {
    const mods = await searchMods(searchParams)

    // Сохраняем результат в кэше
    modsCache.set(cacheKey, mods)

    return mods
  } catch (error) {
    console.error('Ошибка загрузки модов:', error)
    throw error
  }
}

export const fetchModFilesCached = async (
  modId: number,
  gameVersion?: string,
  modLoaderType?: ModLoaderType
): Promise<File[]> => {
  if (filesCache.has(modId)) return filesCache.get(modId) as File[]

  try {
    const files = await fetchModFiles(modId, gameVersion, modLoaderType)

    filesCache.set(modId, files)

    return files
  } catch (error) {
    console.error('Ошибка при загрузке файлов', error)
    throw error
  }
}
