import type { IPagination } from '@/composables/usePagination'

interface IGenerator {
  generateRandomThaiCitizenId: () => string
  generateRandomPhoneNumber: () => string
  generateOrder (index: number, pagination?: IPagination): number
}

function generateRandomThaiCitizenId (): string {
  // Step 1: Generate the first 12 digits
  const firstDigit = Math.floor(Math.random() * 8) + 1 // 1-8 (0 and 9 are not used for Thai Citizen IDs)
  const digits2to5 = Math.floor(Math.random() * 10000).toString().padStart(4, '0') // Province code (random 4 digits)
  const digits6to12 = Math.floor(Math.random() * 10000000).toString().padStart(7, '0') // Sequential number (random 7 digits)

  // Combine the first 12 digits
  const first12Digits = `${firstDigit}${digits2to5}${digits6to12}`

  // Step 2: Calculate the checksum (13th digit)
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(first12Digits[i], 10)
    const weight = 13 - i // Weights from 13 to 2
    sum += digit * weight
  }

  const remainder = sum % 11
  const checksum = (11 - remainder) % 10 // Last digit of (11 - remainder), or 0 if remainder is 1

  // Step 3: Combine all digits
  const thaiCitizenId = `${first12Digits}${checksum}`

  return thaiCitizenId
}


// Thai mobile numbers: 06x, 08x, 09x — 10 digits total
function generateRandomPhoneNumber (): string {
  const prefixes = ['06', '08', '09']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return `${prefix}${remaining}`
}

function generateOrder (index: number, pagination?: IPagination): number {
  const page = pagination?.page || 1
  const limit = pagination?.limit || 10
  return (page - 1) * limit + index + 1
}

export const generator: IGenerator = {
  generateRandomThaiCitizenId,
  generateRandomPhoneNumber,
  generateOrder
}
