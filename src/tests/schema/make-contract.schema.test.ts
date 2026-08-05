import { PreAssetWarehouseSchema, PreAssetWarehouseListSchema } from '@/pages/contract/pages/pre-contract-detail/schema/make-contract.schema'
import { describe, expect, it } from 'vitest'

describe('PreAssetWarehouseSchema', () => {
  describe('files field', () => {
    it('rejects empty files array', () => {
      const data = {
        id: 1,
        files: [],
        locationId: 2
      }
      const result = PreAssetWarehouseSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        const messages = result.error.issues.map((i: { message: string }) => i.message).join(' ')
        expect(messages).toContain('กรุณาแนบเอกสารหลักทรัพย์อย่างน้อย 1 ไฟล์')
      }
    })

    it('accepts non-empty files array', () => {
      const data = {
        id: 1,
        files: [
          {
            name: 'test.pdf',
            url: 'blob:http://localhost/test',
            path: '/temp/test.pdf',
            isNew: true
          }
        ],
        locationId: 2
      }
      const result = PreAssetWarehouseSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('maintains locationId requirement', () => {
      const data = {
        id: 1,
        files: [
          {
            name: 'test.pdf',
            url: 'blob:http://localhost/test',
            path: '/temp/test.pdf',
            isNew: true
          }
        ],
        locationId: undefined
      }
      const result = PreAssetWarehouseSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('PreAssetWarehouseListSchema', () => {
    it('blocks submission when first asset has empty files', () => {
      const data = [
        {
          id: 1,
          files: [],
          locationId: 2
        },
        {
          id: 2,
          files: [
            {
              name: 'test.pdf',
              url: 'blob:http://localhost/test',
              path: '/temp/test.pdf',
              isNew: true
            }
          ],
          locationId: 3
        }
      ]
      const result = PreAssetWarehouseListSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('accepts list with all assets having files', () => {
      const data = [
        {
          id: 1,
          files: [
            {
              name: 'test.pdf',
              url: 'blob:http://localhost/test',
              path: '/temp/test.pdf',
              isNew: true
            }
          ],
          locationId: 2
        }
      ]
      const result = PreAssetWarehouseListSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('accepts preloaded files from API without isNew flag', () => {
      const data = [
        {
          id: 1,
          files: [
            {
              name: 'existing-doc.pdf',
              url: 'https://api.example.com/doc.pdf',
              path: '/storage/doc.pdf'
            }
          ],
          locationId: 2
        }
      ]
      const result = PreAssetWarehouseListSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
