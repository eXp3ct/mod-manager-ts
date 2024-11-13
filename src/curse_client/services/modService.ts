import { Category, CurseData, Mod } from 'src/types'
import { get } from '../apiClient'

export async function fetchCategories(classId: number | undefined): Promise<Category[]> {
  const response = await get<CurseData<Category[]>>(`/v1/categories?gameId=432&classId=${classId}`)
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

export async function fetchModById(modId: number): Promise<Mod> {
  const response = await get<CurseData<Mod>>(`/v1/mods/${modId}`)
  return response.data
}
