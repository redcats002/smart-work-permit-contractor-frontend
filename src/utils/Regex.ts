interface IRegex {
  emailRegex: RegExp
  passwordRegex: RegExp
  fullPassword: RegExp
  a2ZSomeone: RegExp
  zero2NineSomeOne: RegExp
  atLeastOneNumber: RegExp
  upperCaseOneCharRegex: RegExp
  numberOneDigitRegex: RegExp
  passportRegex: RegExp
}

const emailRegex: RegExp = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/
const passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
const fullPassword: RegExp = /^[a-zA-Z0-9!@#$%^&*]{8,}$/
const a2ZSomeone: RegExp = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{1,}$/g
const zero2NineSomeOne: RegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{1,}$/g
const upperCaseOneCharRegex: RegExp = /^(?=.*[A-Z]).{1,}$/
const numberOneDigitRegex: RegExp = /^(?=.*\d).{1,}$/
const passportRegex: RegExp = /^[A-Z0-9]{9}$/
const atLeastOneNumber: RegExp = /[0-9]/

export const regex: IRegex = {
  emailRegex,
  passwordRegex,
  fullPassword,
  a2ZSomeone,
  zero2NineSomeOne,
  upperCaseOneCharRegex,
  numberOneDigitRegex,
  passportRegex,
  atLeastOneNumber
}
