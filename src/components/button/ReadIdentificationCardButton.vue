<template>
  <Button
    v-bind="attrs"
    class="bg-white"
    color="primary"
    outlined
    @click="handleReadIdCard()">
    <div class="text-sm font-medium">
      อ่านข้อมูลบัตรประชาชน
    </div>
  </Button>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'

interface IReadIdCardResult {
  title: string
  firstName: string
  lastName: string
  gender: string
  nation: string
  idCard: string
  birthDay: string
  address: {
    houseNo: string
    moo: string
    soi: string
    road: string
    subDistrict: string
    district: string
    province: string
  }
}

interface IEmits {
  readSuccess: [data: IReadIdCardResult]
}

const attrs = useAttrs()

const isLoading = ref(false)

let ws: WebSocket | null = null
const WS_URL = 'ws://localhost:14820/TDKWAgent'

function openWs (): Promise<WebSocket> {
  return new Promise((resolve: any, reject: any): void => {
    if (ws && ws.readyState === WebSocket.OPEN) return resolve(ws)
    ws?.close?.()
    ws = new WebSocket(WS_URL)
    ws.onopen = (): void => resolve(ws as WebSocket)
    ws.onerror = (): any => reject(new Error('เชื่อมต่อ TDKW Agent ไม่ได้'))
  })
}

function send (cmd: Record<string, any>): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('WebSocket ยังไม่พร้อม')
  ws.send(JSON.stringify(cmd))
}

function wait<T = any> (predicate: (msg: any) => boolean, timeoutMs: number = 10000): Promise<T> {
  return new Promise((resolve: any, reject: any): any => {
    if (!ws) return reject(new Error('WebSocket ปิดอยู่'))
    const timer = setTimeout((): void => {
      cleanup()
      reject(new Error('อ่านบัตรไม่ทันเวลา'))
    }, timeoutMs)

    const handler = (ev: MessageEvent<string>): void => {
      try {
        const msg = JSON.parse(ev.data)
        if (predicate(msg)) {
          cleanup()
          resolve(msg)
        }
      } catch { /* ignore parse errors */ }
    }

    const cleanup = (): void => {
      clearTimeout(timer)
      ws?.removeEventListener('message', handler)
    }
    ws.addEventListener('message', handler)
  })
}

async function handleReadIdCard (): Promise<void> {
  handleLoading(async (): Promise<any> => {
    isLoading.value = true
    try {
      await openWs()

      send({ Command: 'GetReaderList' })
      const listResp = await wait((m: any): any => m.Message === 'GetReaderListR')
      if (!listResp || listResp.Status <= 0 || !Array.isArray(listResp.ReaderList) || listResp.ReaderList.length === 0) {
        throw new Error('ไม่พบเครื่องอ่านบัตร')
      }

      const readerName = listResp.ReaderList[0] || ''
      send({ Command: 'SelectReader', ReaderName: readerName })
      const selResp = await wait((m: any): any => m.Message === 'SelectReaderR')
      if (!selResp || selResp.Status <= 0) throw new Error('เลือกเครื่องอ่านไม่สำเร็จ')

      send({
        Command: 'ReadIDCard',
        IDNumberRead: true,
        IDTextRead: true,
        IDATextRead: true,
        IDPhotoRead: true
      })


      const readResp = await wait(
        (m: any): any => (m.Message === 'ReadIDCardR' || m.Message === 'AutoReadIDCardE') && m.Status === 0, 15000
      )
      console.log(readResp)
      const dataSplit = readResp.ID_Text.split('#')
      const gender = dataSplit[17] === '1' ? 'MALE' : 'FEMALE'
      const title = switchTitle(dataSplit[1])
      const payload: IReadIdCardResult = {
        title: title,
        firstName: dataSplit[2],
        lastName: dataSplit[4],
        gender: gender,
        nation: 'ไทย',
        idCard: dataSplit[0],
        birthDay: thaiYMDToISOString(dataSplit[18]),
        address: {
          houseNo: dataSplit[9],
          moo: dataSplit[10],
          soi: dataSplit[12],
          road: dataSplit[13],
          subDistrict: dataSplit[14],
          district: dataSplit[15],
          province: dataSplit[16]
        }
      }
      // NOTE: debugged here
      toast.success('อ่านบัตรสำเร็จ')
      emits('readSuccess', payload)
    } catch (err: any) {
      toast.error('อ่านบัตรไม่สำเร็จ: ' + (err?.message || 'เกิดข้อผิดพลาด'))
      console.error('❌ อ่านบัตรไม่สำเร็จ:', err?.message || err)
    } finally {
      isLoading.value = false
    }
  })
}
function thaiYMDToIsoDate (value: string): string {
  if (!(/^\d{8}$/).test(value)) throw new Error('รูปแบบวันที่ต้องเป็น YYYYMMDD')
  const yearBE = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6))
  const day = Number(value.slice(6, 8))
  const yearCE = yearBE - 543

  return [
    String(yearCE).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join('-')
}

function thaiYMDToISOString (value: string): string {
  const isoDate = thaiYMDToIsoDate(value)
  const d = new Date(`${isoDate}T00:00:00+07:00`)
  return d.toISOString()
}

function switchTitle (title: string): string {
  switch (title) {
    case 'นาย':
      return 'Mr.'
    case 'นาง':
      return 'Mrs.'
    case 'น.ส.':
      return 'Ms.'
    default:
      return ''
  }
}

const emits = defineEmits<IEmits>()
</script>

<style scoped>

</style>
