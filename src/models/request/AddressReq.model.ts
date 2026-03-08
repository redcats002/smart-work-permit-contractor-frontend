export interface IAddressRequest {
  id?: number // for update
  address: string
  district: string
  postCode: string
  subDistrict: string
  province: string
  urlGoogleMap?: string
  isSameCitizenAddress?: boolean
  isSameCurrentAddress?: boolean
}
