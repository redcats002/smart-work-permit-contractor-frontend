import type { IAssetDetailInfo, IAssetDocument, IAssetHistoryItem, IAssetMedia, IContractDetailInfo } from '@/models/asset/AssetDetail.model'
import type { IAssetList } from '@/models/response/asset/AssetRes.model'

export const assetMockItems: IAssetList[] = []

export interface IAssetDetailMock {
  assetInfo: IAssetDetailInfo
  contractInfo: IContractDetailInfo
  images: IAssetMedia[]
  documents: IAssetDocument[]
  history: IAssetHistoryItem[]
}

export function getAssetDetailMock (assetId?: number): IAssetDetailMock {
  const selected = assetMockItems.find((item: (typeof assetMockItems)[number]): boolean => item.id === assetId)

  const assetInfo: IAssetDetailInfo = {
    status: selected?.status || 'WAITING',
    assetNo: selected?.assetNo || 'AS-00001',
    assetCategory: selected?.category || 'อสังหาริมทรัพย์ - ที่ดิน',
    assetGroup: 'น.ส.4 (ตราครุฑสีแดง)',
    appraisalValue: '120,000 บาท',
    address: '288 หมู่ 6 ต.สำราญ อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
    storageCode: 'BR001-31-13'
  }

  const contractInfo: IContractDetailInfo = {
    contractStatus: assetId && assetId % 2 === 0 ? 'ยกเลิก' : 'ใช้งานอยู่',
    contractNo: 'LC-00001',
    contractDate: '12/3/40',
    employee: 'นางสาว โชติกา ประชาสิริกุล'
  }

  const images: IAssetMedia[] = [
    { id: 1, label: 'รูปภาพ 1' },
    { id: 2, label: 'รูปภาพ 2' }
  ]

  const documents: IAssetDocument[] = [
    { id: 1, name: 'โฉนดที่ดิน.pdf' },
    { id: 2, name: 'โฉนดที่ดิน.pdf' }
  ]

  const history: IAssetHistoryItem[] = [
    { id: 1, date: '12/3/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นาย จันทร์ พงษ์พัฒนาโยธิน', receivedBy: '-', status: 'รอรับ' },
    { id: 2, date: '12/4/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นาง พันทวา จิรวรางวงศ์', receivedBy: 'นางสาว รัตน์กร ยีนตั้ง', status: 'สำเร็จ' },
    { id: 3, date: '12/5/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นางสาว โชติกา ประชาสิริกุล', receivedBy: 'นาย วิชัย เกรียงพฤกษ์', status: 'สำเร็จ' },
    { id: 4, date: '12/6/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นาย ปิยะพร รุ่งดัง', receivedBy: 'นาย อภิสิตา เขาคำ', status: 'สำเร็จ' },
    { id: 5, date: '12/7/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นาย ธรรมศักดิ์ องค์พิทักษ์', receivedBy: 'นางสาว ทิพวดี เรืองทอง', status: 'สำเร็จ' },
    { id: 6, date: '12/8/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นางสาว นัฐพร สุขนาวร', receivedBy: 'นาง สุคนธ์ สุวรรณกร', status: 'สำเร็จ' },
    { id: 7, date: '12/9/67', origin: 'สาขาขอนแก่น : KK01-04-13', destination: 'สำนักงานใหญ่ : BR001-31-13', sentBy: 'นาง สุทธิพร อุกฤษศาสตร์การ', receivedBy: 'นาย ปุณชัย ชัยยุทธการ', status: 'สำเร็จ' }
  ]

  return {
    assetInfo,
    contractInfo,
    images,
    documents,
    history
  }
}
