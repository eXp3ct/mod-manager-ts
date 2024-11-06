export type CurseData<T> = {
  data: T
}

export type Mod = {
  id: number
  gameId: number
  name: string
  slug: string
  links: Link
  summary: string
  status: number
  downloadCount: number
  isFeatured: boolean
  primaryCategoryId: number
  categories: Category[]
  classId: number
  authors: Author[]
  logo: Logo
  screenshots: Logo[]
  mainFileId: number
  latestFiles: File[]
  latestFilesIndexes: LatestFilesIndex[]
  latestEarlyAccessFilesIndexes: LatestFilesIndex[]
  dateCreated: Date
  dateModified: Date
  dateReleased: Date
  allowModDistribution: boolean
  gamePopularityRank: number
  isAvailable: boolean
  thumbsUpCount: number
  rating: number
}

export enum ModStatus {
  New = 1,
  ChangesRequired = 2,
  UnderSoftReview = 3,
  Approved = 4,
  Rejected = 5,
  ChangesMade = 6,
  Inactive = 7,
  Abandoned = 8,
  Deleted = 9,
  UnderReview = 10
}

export enum ReleaseType {
  Release = 1,
  Beta = 2,
  Alpha = 3
}

export enum ModLoaderType {
  Any = 0,
  Forge = 1,
  Cauldron = 2,
  LiteLoader = 3,
  Fabric = 4,
  Quilt = 5,
  NeoForge = 6
}

export enum FileStatus {
  Processing = 1,
  ChangesRequired = 2,
  UnderReview = 3,
  Approved = 4,
  Rejected = 5,
  MalwareDetected = 6,
  Deleted = 7,
  Archived = 8,
  Testing = 9,
  Released = 10,
  ReadyForReview = 11,
  Deprecated = 12,
  Baking = 13,
  AwaitingPublishing = 14,
  FailedPublishing = 15
}

export type Author = {
  id: number
  name: string
  url: string
}

export type Category = {
  id: number
  gameId: number
  name: string
  slug: string
  url: string
  iconUrl: string
  dateModified: Date
  isClass: boolean
  classId: number
  parentCategoryId: number
  displayIndex: number
}

export type LatestFilesIndex = {
  gameVersion: string
  fileId: number
  filename: string
  releaseType: ReleaseType
  gameVersionTypeId: number
  modLoader: ModLoaderType
}

export type File = {
  id: number
  gameId: number
  modId: number
  isAvailable: boolean
  displayName: string
  fileName: string
  releaseType: ReleaseType
  fileStatus: FileStatus
  hashes: Hash[]
  fileDate: Date
  fileLength: number
  downloadCount: number
  fileSizeOnDisk: number
  downloadUrl: string
  gameVersions: string[]
  sortableGameVersions: SortableGameVersion[]
  dependencies: Dependency[]
  exposeAsAlternative: boolean
  parentProjectFileId: number
  alternateFileId: number
  isServerPack: boolean
  serverPackFileId: number
  isEarlyAccessContent: boolean
  earlyAccessEndDate: Date
  fileFingerprint: number
  modules: Module[]
}

export type Dependency = {
  modId: number
  relationType: number
}

export type Hash = {
  value: string
  algo: number
}

export type Module = {
  name: string
  fingerprint: number
}

export type SortableGameVersion = {
  gameVersionName: string
  gameVersionPadded: string
  gameVersion: string
  gameVersionReleaseDate: Date
  gameVersionTypeId: number
}

export type Link = {
  websiteUrl: string
  wikiUrl: string
  issuesUrl: string
  sourceUrl: string
}

export type Logo = {
  id: number
  modId: number
  title: string
  description: string
  thumbnailUrl: string
  url: string
}

export enum SearchSortField {
  Featured = 1,
  Popularity = 2,
  LastUpdated = 3,
  Name = 4,
  Author = 5,
  TotalDownloads = 6,
  Category = 7,
  GameVersion = 8,
  EarlyAccess = 9,
  FeaturedReleased = 10,
  ReleasedDate = 11,
  Rating = 12
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type SearchState = {
  gameId: number
  classId: number
  categoryId: number
  gameVersion: string
  searchFilter: string
  sortField: SearchSortField
  sortOrder: SortOrder
  modLoaderType: ModLoaderType
  authorId: number
  slug: string
  index: number
  pageSize: number
}
