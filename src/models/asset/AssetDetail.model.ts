export interface IAssetDetailInfo {
  status: string
  assetNo: string
  assetCategory: string
  assetGroup: string
  appraisalValue: string
  address: string
  storageCode: string
}

export interface IContractDetailInfo {
  contractStatus: string
  contractNo: string
  contractDate: string
  employee: string
}

export interface IAssetMedia {
  id: number
  label: string
}

export interface IAssetDocument {
  id: number
  name: string
}

export interface IAssetHistoryItem {
  id: number
  date: string
  origin: string
  destination: string
  sentBy: string
  receivedBy: string
  status: string
}
