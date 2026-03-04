export interface IAuthor {
  id: number | string | null
  firstName: string
  lastName: string
}

export interface IEntity {
  id: number | string | null
  idNo?: string | null
  createdAt?: string | null
  deletedAt?: string | null
  updatedAt?: string | null
  createdBy?: IAuthor
  updatedBy?: IAuthor
}


export interface IBaseOption<T = string | number> {
  title: string
  value: T | null | boolean
}

export type TBaseOption<T = string | number> = IBaseOption<T>
