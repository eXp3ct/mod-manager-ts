import { Category, CurseData, Mod } from '../../types'
import { get } from '../apiClient'

const SEARCH_URL = '/v1/mods/search?gameId=432&index=0&pageSize=50'
const CATEGORIES_URL = '/v1/categories?gameId=432&classId=6'

export async function searchMods(): Promise<Mod[]> {
  const response = await get<CurseData<Mod[]>>(SEARCH_URL)
  return response.data
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await get<CurseData<Category[]>>(CATEGORIES_URL)
  return response.data
}
