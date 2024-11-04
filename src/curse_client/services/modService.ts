import { ModData } from '../../types'
import { get } from '../apiClient'

const URL = '/v1/mods/search?gameId=432'

export function searchMods(): Promise<ModData> {
  return get<ModData>(URL)
}
