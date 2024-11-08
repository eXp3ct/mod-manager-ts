import { Category, CurseData } from '../../types'
import { get } from '../apiClient'

const CATEGORIES_URL = '/v1/categories?gameId=432&classId=6'

export async function fetchCategories(): Promise<Category[]> {
  const response = await get<CurseData<Category[]>>(CATEGORIES_URL)
  return response.data
}

export async function fetchDetails(modId: number): Promise<string> {
  const response = await get<CurseData<string>>(`/v1/mods/${modId}/description`, {
    headers: {
      Accept: 'application/json'
    }
  })
  return response.data
}
