import { get, post } from '../apiClient'
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

export async function fetchFiles(ids: number[]): Promise<File[]> {
  const fileIds = {
    fileIds: ids
  }
  const response = await post<CurseData<File[]>>('/v1/mods/files', fileIds)
  return response.data
}

export async function fetchDownloadUrl(modId: number, fileId: number): Promise<string> {
  const response = await get<CurseData<string>>(`/v1/mods/${modId}/files/${fileId}/download-url`)
  return response.data
}
