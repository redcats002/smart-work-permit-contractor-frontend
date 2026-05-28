import type { App } from 'vue'
import { ToastService } from 'primevue'
import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { registerToastService } from './toast'

export const primeVueConfig: PrimeVueConfiguration = {
  unstyled: true,
  locale: {
    fileSizeTypes: [],
    dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
    dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    dayNamesMin: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    monthNames: [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ],
    monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    chooseMonth: 'เลือกเดือน',
    chooseYear: 'เลือกปี',
    chooseDate: 'เลือกวันที่',
    today: 'วันนี้',
    weekHeader: 'สัปดาห์',
    firstDayOfWeek: 1,
    showMonthAfterYear: false
  },
  pt: {
    directives: {
      tooltip: {
        root: {
          class: `hidden w-fit pointer-events-none absolute max-w-48 group drop-shadow-lg animate-fade-in
                  data-[p-position=top]:py-1 data-[p-position=bottom]:py-1
                  data-[p-position=left]:px-1 data-[p-position=right]:px-1
                  `
        },
        arrow: {
          class: `absolute w-0 h-0 border-transparent border-solid border-[.25rem]
                  group-data-[p-position=top]:border-y-surface-700 group-data-[p-position=top]:-ml-1 group-data-[p-position=top]:border-b-0
                  group-data-[p-position=bottom]:border-y-surface-700 group-data-[p-position=bottom]:-ml-1 group-data-[p-position=bottom]:border-t-0
                  group-data-[p-position=left]:border-l-surface-700 group-data-[p-position=left]:-mt-1 group-data-[p-position=left]:border-r-0
                  group-data-[p-position=right]:border-r-surface-700 group-data-[p-position=right]:-mt-1 group-data-[p-position=right]:border-l-0
                  `
        },
        text: {
          class: 'break-words whitespace-pre-line bg-surface-700 text-surface-0 px-3 py-2 rounded'
        }
      }
    }
  }
}

export function registerPrimeVue (app: App<Element>): void {
  app.directive('tooltip', Tooltip)
  app.use(PrimeVue, primeVueConfig)
  app.use(ToastService)
  registerToastService(app)
}

export default PrimeVue
