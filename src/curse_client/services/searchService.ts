import { Mod, SearchState, SearchSortField, ModLoaderType, SortOrder, CurseData } from 'src/types'
import { get } from '../apiClient'

/**
 * Преобразует параметры поиска в строку запроса
 */
function createSearchParams(searchState: Partial<SearchState>): string {
  // Создаем объект URLSearchParams для правильного кодирования параметров
  const params = new URLSearchParams()

  // Добавляем только определенные параметры
  if (searchState.gameId !== undefined) {
    params.append('gameId', searchState.gameId.toString())
  }

  if (searchState.classId !== undefined) {
    params.append('classId', searchState.classId.toString())
  }

  if (searchState.categoryId !== undefined) {
    params.append('categoryId', searchState.categoryId.toString())
  }

  if (searchState.gameVersion) {
    params.append('gameVersion', searchState.gameVersion)
  }

  if (searchState.searchFilter) {
    params.append('searchFilter', searchState.searchFilter)
  }

  if (searchState.sortField !== undefined) {
    params.append('sortField', searchState.sortField.toString())
  }

  if (searchState.sortOrder !== undefined) {
    params.append('sortOrder', searchState.sortOrder.toLowerCase())
  }

  if (searchState.modLoaderType !== undefined) {
    params.append('modLoaderType', ModLoaderType[searchState.modLoaderType])
  }

  if (searchState.authorId !== undefined) {
    params.append('authorId', searchState.authorId.toString())
  }

  if (searchState.slug) {
    params.append('slug', searchState.slug)
  }

  // Пагинация всегда должна быть определена
  params.append('index', (searchState.index ?? 0).toString())
  params.append('pageSize', (searchState.pageSize ?? 10).toString())

  return params.toString()
}

/**
 * Поиск модов с заданными параметрами
 */
export async function searchMods(searchParams: Partial<SearchState> = {}): Promise<Mod[]> {
  // Устанавливаем значения по умолчанию
  const defaultParams: Partial<SearchState> = {
    gameId: 432, // Minecraft
    index: 0,
    pageSize: 10,
    sortOrder: SortOrder.Desc,
    sortField: SearchSortField.TotalDownloads
  }

  // Объединяем параметры по умолчанию с переданными параметрами
  const finalParams = { ...defaultParams, ...searchParams }

  // Создаем URL с параметрами
  const searchUrl = `/v1/mods/search?${createSearchParams(finalParams)}`

  try {
    const response = await get<CurseData<Mod[]>>(searchUrl)
    return response.data
  } catch (error) {
    throw new Error(`Failed to search mods: ${error}`)
  }
}
