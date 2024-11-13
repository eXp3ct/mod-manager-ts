import { ModLoaderType } from './index'

export type MinecraftVersionData = {
  data: MinecraftVersion[]
}

export type MinecraftModLoaderData = {
  data: MinecraftModLoader[]
}

export type MinecraftVersion = {
  id: number
  gameVersioFnId: number
  versionString: string
  jarDownloadUrl: string
  jsonDownloadUrl: string
  approved: boolean
  dateModified: string
  gameVersionTypeId: number
  gameVersionStatus: GameVersionStatus
  gameVersionTypeStatus: GameVersionTypeStatus
}

export enum GameVersionStatus {
  Approved = 1,
  Deleted = 2,
  New = 3
}

export enum GameVersionTypeStatus {
  Normal = 1,
  Deleted = 2
}

export type MinecraftModLoader = {
  name: string
  gameVersion: string
  latest: boolean
  recommended: boolean
  dateModified: string
  type: ModLoaderType
}

export type Manifest = {
  minecraft: {
    version: string
    modLoaders: { id: string; primary: boolean }[]
  }
  manifestType: string
  manifestVersion: number
  name: string
  version: string
  author: string
  files: { projectID: number; fileID: number; required: boolean }[]
  overrides: string
}
