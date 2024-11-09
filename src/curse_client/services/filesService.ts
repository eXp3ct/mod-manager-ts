import { get } from '../apiClient'
import { CurseData, ModLoaderType } from './../../types/index'
import { File } from 'src/types'

export async function fetchModFiles(
  modId: number,
  gameVersion?: string,
  modLoaderType?: ModLoaderType
): Promise<File[]> {
  const queryParams = new URLSearchParams()
  if (gameVersion !== undefined) queryParams.append('gameVersion', gameVersion)
  if (modLoaderType !== undefined) queryParams.append('modLoaderType', ModLoaderType[modLoaderType])
  queryParams.append('index', '0')
  queryParams.append('pageSize', '50')

  const url = `/v1/mods/${modId}/files?${queryParams.toString()}`
  const response = await get<CurseData<File[]>>(url)

  return response.data
}
