export interface IAddressRequest {
  address: string
  district: string
  postalCode: string
  subDistrict: string
  province: string
  urlGoogleMap?: string
  isSameCitizenAddress?: boolean
  isSameCurrentAddress?: boolean
}
