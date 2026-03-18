import { dayjs } from '@/plugins/dayjs.plugin'
import type dayjsType from 'dayjs'

type TUseDayjs = typeof dayjsType & {
  formatDurationThai: (ms: number) => string
  formatAgeYear: (input: string | Date) => string
  formatAge: (input: string | Date) => string
  formatDate: (input?: string | Date) => string
  formatTime: (input?: string | Date) => string
  formatDateTime: (input?: string | Date) => string
  formatDateRequest: (input?: string | Date) => string | null
  formatThaiAgeYear: (input: string | Date) => string
}

export function useDayjs (): TUseDayjs {
  const $dayjs = dayjs as TUseDayjs

  if (!$dayjs) {
    throw new Error('$dayjs is not available')
  }

  const formatDurationThai = (ms: number): string => {
    const dur = $dayjs.duration(ms)
    const hours = Math.floor(dur.asHours())
    const minutes = dur.minutes()
    const seconds = dur.seconds()

    const pad = (num: number): string => num.toString().padStart(2, '0')
    return hours > 0
      ? `${hours}.${pad(minutes)}.${pad(seconds)} นาที`
      : `${pad(minutes)}.${pad(seconds)} นาที`
  }

  const formatAgeYear = (input: string | Date): string => {
    const birthDate = dayjs(input)
    const now = dayjs()

    const years = now.diff(birthDate, 'year')

    return `${years} ปี`
  }

  const formatDateRequest = (input?: string | Date): string | null => {
    return input ? dayjs(input).format('YYYY-MM-DD') : null
  }

  const formatAge = (input: string | Date): string => {
    const birthDate = dayjs(input)
    const now = dayjs()

    const years = now.diff(birthDate, 'year')
    const months = now.diff(birthDate.add(years, 'year'), 'month')
    const days = now.diff(birthDate.add(years, 'year').add(months, 'month'), 'day')

    return `${years} ปี ${months} เดือน ${days} วัน`
  }

  const formatDate = (input?: string | Date): string => {
    return input ? dayjs(input).format('DD/MM/BBBB') : '-'
  }
  const formatTime = (input?: string | Date): string => {
    return input ? dayjs(input).format('HH:mm[น.]') : '-'
  }
  const formatDateTime = (input?: string | Date): string => {
    return input ? dayjs(input).format('DD/MM/BBBB HH:mm') : '-'
  }

  $dayjs.formatDurationThai = formatDurationThai
  $dayjs.formatAgeYear = formatAgeYear
  $dayjs.formatAge = formatAge
  $dayjs.formatDate = formatDate
  $dayjs.formatTime = formatTime
  $dayjs.formatDateTime = formatDateTime
  $dayjs.formatDateRequest = formatDateRequest

  return $dayjs
}
