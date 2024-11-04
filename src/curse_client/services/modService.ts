import { Mod, ModData } from '../../types'
import { get } from '../apiClient'

const URL = '/v1/mods/search?gameId=432&index=0&pageSize=10'

export async function searchMods(): Promise<Mod[]> {
  const response = await get<ModData>(URL)
  return response.data
}
