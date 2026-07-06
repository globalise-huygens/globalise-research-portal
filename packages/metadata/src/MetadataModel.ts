export type MetadataEntry = {
  label: string
  value: string
  url?: string
  children: MetadataEntry[]
};