import { MinecraftModLoader, MinecraftVersion } from './../../types/minecraft'
import { get } from '../apiClient'
import { CurseData } from 'src/types'

const VERSIONS_URL = '/v1/minecraft/version'
const MODLOADERS_URL = '/v1/minecraft/modloader'

export async function fetchMinecraftVersions(sortDesc: boolean): Promise<MinecraftVersion[]> {
  const response = await get<CurseData<MinecraftVersion[]>>(
    `${VERSIONS_URL}?sortDescending=${sortDesc}`
  )
  return response.data
}

export async function fetchModLoaders(
  version: string,
  includeAll: boolean
): Promise<MinecraftModLoader[]> {
  const response = await get<CurseData<MinecraftModLoader[]>>(
    `${MODLOADERS_URL}?version=${version}&includeAll=${includeAll}`
  )
  return response.data
}
