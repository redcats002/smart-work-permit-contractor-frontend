import type { IAssetList } from '@/models/response/asset/AssetRes.model'
import type {
  IAssetDetailInfo,
  IAssetDocument,
  IAssetHistoryItem,
  IAssetMedia,
  IContractDetailInfo
} from '@/models/asset/AssetDetail.model'

export const assetMockItems: IAssetList[] = [
  { id: 1, assetNo: 'AS-00001', customerName: 'นาย จันทร์ พงษ์พัฒนาโยธิน', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 800000, status: 'WAITING' },
  { id: 2, assetNo: 'AS-00002', customerName: 'นาง พันทวา จิรวรางวงศ์', category: 'อสังหาริมทรัพย์ - บ้าน', value: 1200000, status: 'WAITING' },
  { id: 3, assetNo: 'AS-00003', customerName: 'นางสาว โชติกา ประชาสิริกุล', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 600000, status: 'IN_USE' },
  { id: 4, assetNo: 'AS-00004', customerName: 'นาย ปิยะพร รุ่งดัง', category: 'อสังหาริมทรัพย์ - ห้องชุด', value: 1300000, status: 'IN_USE' },
  { id: 5, assetNo: 'AS-00005', customerName: 'นาย ธรรมศักดิ์ องค์พิทักษ์', category: 'ยานพาหนะ', value: 300000, status: 'SOLD' },
  { id: 6, assetNo: 'AS-00006', customerName: 'นางสาว นัฐพร สุขนาวร', category: 'ยานพาหนะ', value: 900000, status: 'SOLD' },
  { id: 7, assetNo: 'AS-00007', customerName: 'นาง สุทธิพร อุกฤษศาสตร์การ', category: 'ยานพาหนะ', value: 1100000, status: 'IN_USE' },
  { id: 8, assetNo: 'AS-00008', customerName: 'นาย อนุชิต ศุภคำ', category: 'เครื่องมือการเกษตร', value: 500000, status: 'IN_USE' },
  { id: 9, assetNo: 'AS-00009', customerName: 'นางสาว รัตน์กร ยีนตั้ง', category: 'เครื่องมือการเกษตร', value: 1400000, status: 'IN_USE' },
  { id: 10, assetNo: 'AS-00010', customerName: 'นาย วิชัย เกรียงพฤกษ์', category: 'เครื่องมือการเกษตร', value: 250000, status: 'IN_USE' },
  { id: 11, assetNo: 'AS-00011', customerName: 'นาย อภิสิตา เขาคำ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 700000, status: 'IN_USE' },
  { id: 12, assetNo: 'AS-00012', customerName: 'นางสาว ทิพวดี เรืองทอง', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1000000, status: 'IN_USE' },
  { id: 13, assetNo: 'AS-00013', customerName: 'นาง สุคนธ์ สุวรรณกร', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 350000, status: 'IN_USE' },
  { id: 14, assetNo: 'AS-00014', customerName: 'นาย ปุณชัย ชัยยุทธการ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1500000, status: 'IN_USE' },
  { id: 15, assetNo: 'AS-00015', customerName: 'นางสาว มานิต สุขโชติแก้ว', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 2000000, status: 'IN_USE' },
  { id: 16, assetNo: 'AS-00016', customerName: 'นาย สุพชัย องค์ชวาชาญ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 400000, status: 'IN_USE' },
  { id: 17, assetNo: 'AS-00017', customerName: 'นาง กาญจนา ชัยวนิช', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1600000, status: 'IN_USE' }
]

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
