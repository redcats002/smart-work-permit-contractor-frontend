import type platformEn from '@/locales/en/platform'

const platform: typeof platformEn = {
  appName: 'SafePermit',
  appTagline: 'SMART WORK PERMIT · v3.0',
  accountType: 'บัญชีผู้รับเหมา',
  sidebarSection: 'ผู้รับเหมา',
  nav: {
    permits: 'ใบอนุญาตของฉัน',
    newPermit: 'สร้างใหม่',
    history: 'ประวัติ',
    certificates: 'ใบรับรองการทำงาน'
  },
  localeSwitcher: {
    en: 'EN',
    th: 'ไทย'
  },
  menu: 'เมนู',
  logout: 'ออกจากระบบ',
  auth: {
    title: 'เข้าสู่ระบบ',
    subtitle: 'กรอกอีเมลและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    submit: 'เข้าสู่ระบบ',
    loginSuccess: 'ยินดีต้อนรับเข้าสู่ระบบ',
    validation: {
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      passwordRequired: 'กรุณากรอกรหัสผ่าน'
    },
    resetPassword: {
      title: 'ตั้งรหัสผ่านใหม่',
      subtitle: 'กรอกรหัสผ่านใหม่ของคุณ',
      newPassword: 'รหัสผ่านใหม่',
      confirmNewPassword: 'ยืนยันรหัสผ่านใหม่',
      submit: 'ยืนยัน',
      success: 'ตั้งรหัสผ่านใหม่สำเร็จ',
      tokenInvalidTitle: 'โทเค้นหมดอายุ',
      tokenInvalidDescription: 'กรุณากดขอลิงก์รีเซ็ตพาสเวิร์ดอีกครั้ง',
      tokenInvalidToast: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
      validation: {
        passwordLength: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว',
        passwordUpper: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว',
        passwordNumber: 'ต้องมี 0-9 อย่างน้อย 1 ตัว',
        confirmRequired: 'กรุณากรอกยืนยันรหัสผ่าน',
        confirmMismatch: 'รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน'
      }
    }
  }
}

export default platform
