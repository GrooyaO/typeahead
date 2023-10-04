export interface User {
  id: number
  avatar_url: string
  login: string
}

export interface Response {
  items: User[]
}

export interface TypeaheadOption {
  name: string
  id: number
  value: {
    login: string
    avatar_url: string
  }
}

export interface RenderListItemProps {
  option: Option
}

// export interface TypeaheadProps {
//   options: any[]
//   multiple?: boolean
//   placeholder?: string
//   delay?: number
//   onSearch: (query: string) => Promise<any>
//   isLoading: boolean
//   renderListItem: (props: Option) => React.JSX.Element
// }

export type TypeaheadProps<T> = {
  multiple?: boolean
  placeholder?: string
  delay?: number
  onSearch: (query: string) => Promise<T[]>
  isLoading: boolean
  renderListItem: (option: T) => JSX.Element
}

export type Option = string | Record<string, any>
export type Cache = Record<string, Option[]>
