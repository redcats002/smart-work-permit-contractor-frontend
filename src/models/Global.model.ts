export interface IAuthor {
  id: number | string | null
  idNo?: string | null
  firstName: string
  lastName: string
  fullName?: string
}

export interface IEntity {
  id: string | number
  idNo?: string
  createdAt?: string
  deletedAt?: string
  updatedAt?: string
  createdBy?: IAuthor
  updatedBy?: IAuthor
}

export interface IEntityId {
  id: string | number
  idNo?: string
}

export interface IBaseOption<T = string | number> {
  label: string
  value?: T | null | boolean
  alt?: string | number | null
}
export type TBaseOption<T = string | number> = IBaseOption<T>
export interface IBaseModel<T = string | number> {
  id: T | null | boolean
  name: string
  idNo?: string
  disabled?: boolean
}
export type TBaseModel<T = string | number> = IBaseModel<T>

export type TActionMode = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
