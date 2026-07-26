export interface IAddressRequest {
  id?: number // for update
  villageNo?: string
  address: string
  district: string
  postCode: string
  subDistrict: string
  province: string
  urlGoogleMap?: string
  isSameCitizenAddress?: boolean
  isSameCurrentAddress?: boolean
}
