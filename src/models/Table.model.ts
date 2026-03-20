type CellValueFn<T = any> = (row: T) => any

export interface IColumn<T = any> {
  field: keyof T | (string & {})
  header: string
  sortable?: boolean
  minWidth?: number
  width?: number
  value?: CellValueFn<T>
  frozen?: boolean
  alignFrozen?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  style?: string | object
  class?: string
  headerStyle?: string | object
  headerClass?: string
  bodyStyle?: string | object
  bodyClass?: string
  rowGroup?: boolean
}

export interface IFooter {
  colspan: number
  field: string
  value: string
  footerStyle?: string
  footerClass?: string
}
