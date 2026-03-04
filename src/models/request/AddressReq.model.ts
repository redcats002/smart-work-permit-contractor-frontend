export interface IAddress {
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
  mapUrl?: string
  isSameCitizenAddress?: boolean
  isSameCurrentAddress?: boolean
}

export interface IAddressRequest {
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
}

export interface ICurrentAddressRequest {
  isSameCitizenAddress?: boolean
  currentAddress: string
  currentSubDistrict: string
  currentDistrict: string
  currentProvince: string
  currentPostalCode: string
  currentUrlMap?: string
}

export interface IWorkAddressRequest {
  isSameCitizenAddress?: boolean
  isSameCurrentAddress?: boolean
  workAddress: string
  workSubDistrict: string
  workDistrict: string
  workProvince: string
  workPostalCode: string
  workUrlMap?: string
}
