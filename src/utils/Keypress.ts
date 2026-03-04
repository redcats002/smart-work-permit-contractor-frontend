export interface IKeypress {
  number (evt: any): boolean
  numberNoDecimal (evt: any): boolean
  telInput (evt: any): boolean
  telInputWithPrefix (evt: any): boolean
  numberTwoDecimal (evt: any): boolean
  emailNoThai (evt: any): boolean
}

export function numberTwoDecimal (evt: any): boolean {
  const event = evt || window.event
  const charCode = event.which ? event.which : event.keyCode

  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    event.preventDefault()
    return false
  }

  const input = event.target as HTMLInputElement
  const value = input.value
  const cursorPosition = input.selectionStart || 0

  if (charCode === 46) {
    if (value.includes('.')) {
      event.preventDefault()
      return false
    }
  }
  if (value.includes('.') && charCode >= 48 && charCode <= 57) {
    const decimalPart = value.split('.')[1]
    const decimalPosition = value.indexOf('.') + 1
    if (decimalPart && cursorPosition > decimalPosition && decimalPart.length >= 2) {
      event.preventDefault()
      return false
    }
  }

  return true
}

export function number (evt: any): boolean {
  const event = (evt) || window.event
  const charCode = (event.which) ? event.which : event.keyCode
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    event.preventDefault()
    return false
  }
  return true
}

export function numberNoDecimal (evt: any, discountType?: string, currentValue?: number): boolean {
  const event = evt || window.event
  const charCode = event.which ? event.which : event.keyCode

  // อนุญาตเฉพาะตัวเลข (0-9) เท่านั้น ห้ามจุดทศนิยม (46)
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 46) {
    event.preventDefault()
    return false
  }

  // ถ้าเป็นเปอร์เซ็นต์ จำกัดไม่เกิน 100
  if (discountType === 'PERCENTAGE') {
    const current = currentValue !== undefined ? currentValue : 0
    const newDigit = parseInt(String.fromCharCode(charCode), 10)
    const newValue = parseInt(`${current}${newDigit}`, 10)

    if (newValue > 100) {
      event.preventDefault()
      return false
    }
  }

  return true
}

export function telInput (evt: any): boolean {
  const event = evt || window.event
  const charCode = event.which ? event.which : event.keyCode
  if (
    ((charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 46) && charCode !== 43
  ) {
    event.preventDefault()
    return false
  }
  return true
}

export function telInputWithPrefix (evt: any): boolean {
  const event = evt || window.event
  const charCode = event.which ? event.which : event.keyCode
  if (charCode === 32 || charCode === 40 || charCode === 41 || charCode === 43 || charCode === 45) {
    return true
  }
  return telInput(evt)
}

export function emailNoThai (evt: any): boolean {
  const event = evt || window.event
  const char = event.key

  if (
    event.ctrlKey
    || event.metaKey
    || char === 'Backspace'
    || char === 'Delete'
    || char === 'ArrowLeft'
    || char === 'ArrowRight'
    || char === 'Tab'
  ) {
    return true
  }

  if ((/[\u0E00-\u0E7F]/).test(char)) {
    event.preventDefault()
    return false
  }

  return true
}

const keypress: IKeypress = {
  numberTwoDecimal,
  number,
  numberNoDecimal,
  telInput,
  telInputWithPrefix,
  emailNoThai
}

export default keypress
