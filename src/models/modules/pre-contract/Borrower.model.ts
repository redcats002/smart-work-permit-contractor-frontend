export interface IBorrowerList {
  isMain: boolean
  customer: IBorrowerCustomerList
}

export interface IBorrowerCustomerList {
  id: number
  idNo: string
  idCard: string
  email?: string
  firstName: string
  lastName: string
  fullName: string
}
