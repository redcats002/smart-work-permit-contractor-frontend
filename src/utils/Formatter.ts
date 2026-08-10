import { type App } from 'vue'
import { type RouteRecordNameGeneric } from 'vue-router'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import { formatTitle, type TTitleName } from '@/enums/TitleName.enum'

export enum EPhoneNumberType {
  HOME = 'HOME',
  PERSONAL = 'PERSONAL'
}
export type TPhoneNumberType = keyof typeof EPhoneNumberType | undefined

export interface IFormatter {
  numberParseFloat(_number: string | number): number
  numberFormat(_number: string | number): string
  numberFormatWithDecimal(_number: number | string, min: number, max: number): string
  numberFormat2Decimal(_number: string | number): string
  numberFormat3Decimal(_number: number | string): string
  numberFormatNoDecimal(_number: number | string): string
  stringFormatSnakeToCamelCase(snakeCaseString: string): string
  stringFormatTitleToCamelCase(input: string): string
  stringFormatToCapitalize(_input: string): string
  stringFormatSnakeToTitleCase(_snakeCaseString: string): string
  stringFormatParenthesisToNumber(_input: string): string
  stringFormatKebabCaseToTitleCase(kebabCaseString: string): string
  stringFormatCamelCaseToTitleCase(input: string): string
  phoneNumberFormat(_phoneNumber: string, type?: TPhoneNumberType): string
  bankAccountNumberFormat(_input: string): string
  pageRouteTitleFormat(_string: RouteRecordNameGeneric): string
  getActionNameToast(_actionName: string): string
  thaiCitizenId(value: string): string
  thaiBaht(value: number | string, prefix?: string): string
  fullName (e?: { titleName?: TTitleName, title?: TTitleName, firstName?: string, lastName?: string }): string
  fullPhoneNumber (e: { phoneNumber?: string, phoneNumber2?: string }): string
  fullAddress (data?: Partial<IAddressRequest>): string
  numberToThaiText (amount: number): string
}

const numberParseFloat = (_number: string | number): number => {
  if (typeof _number === 'string') {
    return parseFloat(_number.replace(/,/g, '').replace('฿', ''))
  }
  return _number
}

const numberFormat = (_number: string | number = 0): string => {
  const num: number = numberParseFloat(_number)
  if (num === 0 || num) {
    return num
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return '-'
}

function numberFormatWithDecimal (_number: number | string = 0, min: number = 0, max: number = 4): string {
  const num = numberParseFloat(_number)
  if (num === 0 || num) {
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: min > max ? min : max
    })
  }
  return '-'
}

function numberFormat2Decimal (_number: number | string = 0): string {
  return numberFormatWithDecimal(_number, 2, 2)
}

function numberFormat3Decimal (_number: number | string = 0): string {
  return numberFormatWithDecimal(_number, 3, 3)
}

function numberFormatNoDecimal (_number: number | string = 0): string {
  return numberFormatWithDecimal(_number, 0, 0)
}

function getActionNameToast (_actionName: string): string {
  return stringFormatCamelCaseToTitleCase(_actionName?.replace(/^on/, ''))
}

function pageRouteTitleFormat (_string: RouteRecordNameGeneric): string {
  if (!_string) return ''
  const words = _string.toString().split(/(?=[A-Z])/)
  const filteredWords = words.filter((word: string): boolean => !['Setting', 'Page', 'Create', 'Edit'].includes(word))
  return filteredWords.join(' ').trim()
}


function stringFormatToCapitalize (input: string): string {
  if (!input) return ''
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
}

function stringFormatSnakeToTitleCase (snakeCaseString: string): string {
  const reservedWords = ['OPD', 'IPD', 'POS'] // NOTE: refactor this
  if (reservedWords.includes(snakeCaseString)) return snakeCaseString
  return snakeCaseString
    .toLowerCase()
    .split('_')
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function stringFormatSnakeToCamelCase (snakeCaseString: string): string {
  return snakeCaseString
    .toLowerCase()
    .split('_')
    .map((word: string, index: number): string => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('')
}

function stringFormatCamelCaseToTitleCase (input: string): string {
  return input
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^./, (str: string): string => str.toUpperCase()) // Capitalize the first letter
    .trim() // Remove any leading/trailing whitespace
}

function stringFormatKebabCaseToTitleCase (kebabCaseString: string): string {
  return kebabCaseString
    .toLowerCase()
    .split('-')
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function phoneNumberFormat (phoneNumber: string, type: TPhoneNumberType = 'PERSONAL'): string {
  if (type === 'PERSONAL') return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  return phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
}

function bankAccountNumberFormat (input: string): string {
  return input.replace(/(\d{3})(\d{4})(\d{3})/, '$1-$2-$3')
}

function stringFormatParenthesisToNumber (_input: string): string {
  const titleCase = stringFormatSnakeToTitleCase(_input)
  const match = titleCase.match(/(\d+)$/)
  if (match) {
    const number = match[1]
    return titleCase.replace(number, `(${number})`)
  }
  return titleCase
}

function stringFormatTitleToCamelCase (input: string): string {
  return input
    .split(' ') // Split by spaces
    .map((word: string, index: number): string => {
      if (index === 0) {
        // Lowercase the first word entirely
        return word.toLowerCase()
      } else {
        // Capitalize the first letter of subsequent words, keeping the rest as is
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
    })
    .join('') // Rejoin the words without spaces
    .replace(/([A-Z])/g, (match: string, group: string): string => {
      // Handle special cases like slashes or dashes
      const previousChar = input[input.indexOf(match) - 1]
      if (previousChar === '/' || previousChar === '-') {
        return group
      }
      return match
    })
}

function thaiCitizenId (value: string): string {
  if (!value) return ''
  const cleanedValue = value.replace(/\D/g, '') // Remove non-digit characters
  if (cleanedValue.length !== 13) return value // Return original if not 13 digits
  return cleanedValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5')
}

function thaiBaht (value: number | string, prefix?: string): string {
  const formatted = formatter.numberFormat2Decimal(formatter.numberParseFloat(value))
  if (prefix) return `${prefix} ฿${formatted}`
  return `฿${formatted}`
}

function fullName (e: { titleName?: TTitleName, title?: TTitleName, firstName?: string, lastName?: string }): string {
  const actualTitle = e?.titleName || e?.title
  if (!e?.firstName && !e?.lastName) return 'ไม่ระบุ'
  if (e?.firstName && !e.lastName) return e.firstName
  if (!e?.firstName && e?.lastName) return e.lastName
  const isEng = (/[a-zA-Z]/).test(e.firstName ?? '')
  const title = formatTitle(actualTitle, isEng)
  return `${title} ${e.firstName} ${e.lastName}`
}

function fullPhoneNumber (e: { phoneNumber?: string, phoneNumber2?: string }): string {
  if (!e?.phoneNumber && !e?.phoneNumber2) return 'ไม่ระบุ'
  if (e?.phoneNumber && !e.phoneNumber2) return phoneNumberFormat(e.phoneNumber)
  if (!e?.phoneNumber && e?.phoneNumber2) return phoneNumberFormat(e.phoneNumber2)
  return `${phoneNumberFormat(e?.phoneNumber || '')}, ${phoneNumberFormat(e?.phoneNumber2 || '')}`
}

function fullAddress (data?: Partial<IAddressRequest>): string {
  const villageNo = data?.villageNo ? `หมู่ ${data.villageNo}` : ''
  return `${data?.address || ''}, ${villageNo}, ${data?.district || ''}, ${data?.subDistrict || ''}, ${data?.province || ''}, ${data?.postCode || ''}`
    .replace(/(, )+/g, ', ')
    .replace(/^(, )+|(, )+$/g, '')
    .trim()
}

function numberToThaiText (amount: number): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Input must be a valid number')
  }

  const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน']

  // Converts a number in range 1–999999 to Thai text
  const convertGroup = (n: number): string => {
    if (n === 0) return ''
    let text = ''
    const digits = n.toString().split('').reverse()
    digits.forEach((digit: string, index: number): void => {
      const d = Number(digit)
      if (d === 0) return
      if (index === 1) {
        // tens position: สิบ / ยี่สิบ / สามสิบ...
        if (d === 1) text = `สิบ${text}`
        else if (d === 2) text = `ยี่สิบ${text}`
        else text = `${ones[d]}สิบ${text}`
      } else {
        // ones position in a multi-digit number uses เอ็ด instead of หนึ่ง
        const digitText = (index === 0 && d === 1 && n >= 10) ? 'เอ็ด' : ones[d]
        text = `${digitText}${units[index]}${text}`
      }
    })
    return text
  }

  // Recursively converts any non-negative integer to Thai text,
  // splitting at ล้าน (1,000,000) to avoid modulo unit wrap-around
  const convertToThaiText = (n: number): string => {
    if (n === 0) return 'ศูนย์'
    if (n < 1_000_000) return convertGroup(n)
    const millions = Math.floor(n / 1_000_000)
    const remainder = n % 1_000_000
    const millionText = `${convertGroup(millions)}ล้าน`
    return remainder > 0 ? `${millionText}${convertGroup(remainder)}` : millionText
  }

  const [integerPart, decimalPart] = amount.toFixed(2).split('.')
  const integerText = convertToThaiText(Number(integerPart))
  const decimalValue = Number(decimalPart)

  if (decimalValue === 0) {
    return `${integerText}บาทถ้วน`
  }
  return `${integerText}บาทจุด${convertToThaiText(decimalValue)}สตางค์`
}

export const formatter: IFormatter = {
  numberFormat,
  numberFormat2Decimal,
  numberFormat3Decimal,
  numberFormatNoDecimal,
  numberParseFloat,
  pageRouteTitleFormat,
  fullName,
  fullPhoneNumber,
  phoneNumberFormat,
  bankAccountNumberFormat,
  numberFormatWithDecimal,
  getActionNameToast,
  thaiCitizenId,
  stringFormatSnakeToTitleCase,
  stringFormatSnakeToCamelCase,
  stringFormatToCapitalize,
  stringFormatParenthesisToNumber,
  stringFormatCamelCaseToTitleCase,
  stringFormatTitleToCamelCase,
  stringFormatKebabCaseToTitleCase,
  thaiBaht,
  fullAddress,
  numberToThaiText
}

export default {
  install: (app: App<Element>): void => {
    app.config.globalProperties.$format = formatter
  }
}
