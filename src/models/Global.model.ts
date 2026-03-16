export interface IAuthor {
  id: number | string | null
  firstName: string
  lastName: string
}

export interface IEntity {
  id?: number
  idNo?: string
  createdAt?: string
  deletedAt?: string
  updatedAt?: string
  createdBy?: IAuthor
  updatedBy?: IAuthor
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
}
export type TBaseModel<T = string | number> = IBaseModel<T>
