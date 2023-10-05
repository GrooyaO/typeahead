export type TypeaheadProps<T> = {
  onSelectItem?: (option: any[]) => void
  onDeleteItem?: (option: any[]) => void
  labelKey: string
  multiple?: boolean
  placeholder?: string
  delay?: number
  onSearch: (query: string) => Promise<T[]>
  isLoading: boolean
  renderListItem: (option: any) => React.JSX.Element
}

export type Option = string | Record<string, any>
export type Cache = Record<string, Option[]>
