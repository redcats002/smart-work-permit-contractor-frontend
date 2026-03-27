import { schema } from '@/utils/Schema'
import { AssetTypeEnum } from '@/enums/modules/asset/AssetType.enum'
import { ContractStatusEnum } from '@/enums/modules/contract/ContractStatus.enum'
import { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import { DocumentStorageAssetStatusEnum } from '@/enums/modules/document-storage/DocumentStorageAssetStatus.enum'
import { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import { ETitleName } from '@/enums/TitleName.enum'
import { z } from 'zod'

export const DocumentAssetSchema = z.object({
  id: schema.id('รหัสสินทรัพย์'),
  idNo: z.string().optional(),
  status: schema.enum(DocumentStorageAssetStatusEnum, 'สถานะ'),
  type: schema.enum(AssetTypeEnum, 'ประเภทสินทรัพย์'),
  contract: z.object({
    id: schema.id('สัญญา'),
    idNo: z.string().optional(),
    status: schema.enum(ContractStatusEnum, 'สถานะสัญญา').optional(),
    customer: z.object({
      id: schema.id('สัญญา'),
      titleName: schema.enum(ETitleName, 'คำนำหน้าชื่อ').optional(),
      idNo: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional(),
      status: schema.enum(CustomerStatusEnum, 'สถานะลูกค้า').optional()
    })
  }),
  location: z.object({
    id: schema.id('สถานที่จัดเก็บ'),
    name: z.string().optional(),
    warehouse: z.object({
      id: schema.id('คลังสินค้า'),
      name: z.string().optional(),
      status: schema.enum(WarehouseStatusEnum, 'สถานะคลังสินค้า')
    }).optional()
  })
})

export type DocumentAssetFormValues = z.infer<typeof DocumentAssetSchema>

export function useFormInitialValues (): DocumentAssetFormValues {
  return {
    status: undefined,
    type: undefined,
    contract: {
      id: undefined,
      customer: {
        id: undefined,
        titleName: undefined,
        idNo: undefined,
        firstName: undefined,
        lastName: undefined
      }
    },
    location: {
      id: undefined,
      name: undefined
    }
  }
}

export function useDev (): DocumentAssetFormValues {
  return {
    status: DocumentStorageAssetStatusEnum.ACTIVE,
    type: AssetTypeEnum.VEHICLE_CAR,
    contract: {
      id: 1,
      customer: {
        id: 1,
        titleName: ETitleName.MR,
        idNo: '1103700000001',
        firstName: 'สมชาย',
        lastName: 'ใจดี'
      },
      idNo: 'CT-2026-0001'
    },
    location: {
      id: 1,
      name: 'คลัง A'
    }
  }
}
