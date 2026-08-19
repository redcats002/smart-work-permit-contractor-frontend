import type permitEn from '@/locales/en/permit'

const permit: typeof permitEn = {
  status: {
    DRAFT: 'ร่าง',
    PENDING: 'รออนุมัติ',
    REJECTED: 'ถูกปฏิเสธ',
    ACTIVE: 'ดำเนินการ',
    FIRE_MONITOR: 'ตรวจตราไฟ',
    CLOSED: 'ปิดแล้ว',
    EXPIRED: 'หมดอายุ'
  },
  type: {
    hot: 'งานที่มีความร้อน / ประกายไฟ',
    confined: 'ที่อับอากาศ',
    heights: 'ทำงานบนที่สูง'
  },
  wizard: {
    step: {
      1: 'เลือกประเภทงาน',
      2: 'ข้อมูลทั่วไป',
      3: 'ตรวจสอบความปลอดภัย',
      4: 'อุปกรณ์ป้องกัน และ ผู้ปฏิบัติงาน',
      5: 'การวิเคราะห์งานเพื่อความปลอดภัย',
      6: 'ตรวจทานและส่ง'
    },
    stepOf: 'ขั้นตอนที่ {current} จาก {total}',
    back: 'ย้อนกลับ',
    next: 'ถัดไป',
    submit: 'ส่งคำขอ',
    // TODO: TH copy — design (SmartWorkPermit-v3.dc.html line 421) never localizes
    // this note, only the English string appears in the prototype (same as
    // list.card.inside below), and it names a safety "reading" — leaving it
    // English rather than inventing safety terminology.
    blockedNote: 'Resolve the blocked reading to continue'
  },
  list: {
    title: 'ใบอนุญาตของฉัน',
    // Design's own Thai copy (SmartWorkPermit-v3.dc.html T.t10) is this short —
    // not a truncation on our side.
    subtitle: 'ใบขออนุญาตทำงาน',
    newPermit: 'สร้างใหม่',
    filter: {
      all: 'ทั้งหมด'
    },
    card: {
      // TODO: TH copy — design (T table) never localizes the "N inside" entrant
      // indicator, only the English string appears in SmartWorkPermit-v3.dc.html.
      inside: '{count} inside'
    },
    empty: {
      title: 'ยังไม่มีใบอนุญาต',
      description: 'ใบอนุญาตที่ตรงกับตัวกรองนี้จะแสดงที่นี่เมื่อคุณสร้างหรือส่งคำขอ'
    },
    error: {
      loadFailed: 'ไม่สามารถโหลดรายการใบอนุญาตได้ กรุณาลองใหม่อีกครั้ง'
    }
  },
  create: {
    title: 'สร้างใบอนุญาตใหม่',
    steps: {
      // Steps 3-6 are still internal build markers for the next agents (PMT-006..009), never
      // shown as finished-feature copy, so they stay in English — see the block below.
      type: {
        prompt: 'เลือกประเภทของงานที่ใบอนุญาตนี้ครอบคลุม',
        field: 'ประเภทใบอนุญาต',
        blurb: {
          hot: 'งานเชื่อม ตัด เจียร หรืองานที่ก่อให้เกิดประกายไฟ เปลวไฟ หรือความร้อน',
          confined: 'ถัง ภาชนะ บ่อ หรือพื้นที่ปิดที่มีทางเข้า-ออกจำกัดและอากาศถ่ายเทน้อย',
          heights: 'งานที่ทำเหนือระดับพื้นดินหรือแท่นถาวร'
        }
      },
      basicInfo: {
        field: {
          title: 'โครงการ',
          contractor: 'ผู้รับเหมา',
          foreman: 'หัวหน้างาน',
          workDate: 'วันที่',
          workTimeStart: 'เวลาเริ่ม',
          workTimeEnd: 'เวลาสิ้นสุด',
          location: 'สถานที่'
        },
        mapPlaceholder: 'ตำแหน่งบนแผนที่ — เร็ว ๆ นี้',
        validation: {
          endAfterStart: 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม'
        }
      },
      safetyChecks: {
        marker: 'Safety reading fields land here — PMT-006',
        body: 'Indoor/outdoor toggle, gas reading cards and the pass/fail checklist are not built yet.'
      },
      ppeWorkers: {
        marker: 'PPE evidence and worker table land here — PMT-007',
        body: 'Photo-evidence slots and the worker roster with role chips are not built yet.'
      },
      jsa: {
        marker: 'JSA table lands here — PMT-008',
        body: 'The Pre / Process / Post job safety analysis table is not built yet.'
      },
      review: {
        marker: 'Review summary and submit land here — PMT-009',
        body: 'The read-only review summary and the submit call are not built yet.'
      }
    }
  },
  detail: {
    placeholderBadge: 'เร็ว ๆ นี้',
    title: 'รายละเอียดใบอนุญาต',
    comingSoon: 'ยังไม่ได้พัฒนาหน้ารายละเอียดใบอนุญาต — นี่คือหน้าชั่วคราว'
  }
}

export default permit
