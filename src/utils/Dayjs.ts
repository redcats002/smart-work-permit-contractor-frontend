import { dayjs } from '@/plugins/dayjs.plugin'
import type dayjsType from 'dayjs'

type TUseDayjs = typeof dayjsType & {
  formatDurationThai: (ms: number) => string
  formatAgeYear: (input: string | Date) => string
  formatAge: (input: string | Date) => string
  formatDate: (input?: string | Date) => string
  formatTime: (input?: string | Date) => string
  formatDateTime: (input?: string | Date) => string
  formatDateRequest: (input?: string | Date) => string | undefined
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

  // for this project using ISO 8601 format for date request
  const formatDateRequest = (input?: string | Date): string | undefined => {
    return input ? dayjs(input)?.toISOString() : undefined
  }

  const formatAge = (input: string | Date): string => {
    const birthDate = dayjs(input)
    const now = dayjs()

    const years = now.diff(birthDate, 'year')
    const months = now.diff(birthDate.add(years, 'year'), 'month')
    const days = now.diff(birthDate.add(years, 'year').add(months, 'month'), 'day')

    const parseYears = Number.isNaN(years) ? 0 : years
    const parseMonths = Number.isNaN(months) ? 0 : months
    const parseDays = Number.isNaN(days) ? 0 : days

    return `${parseYears} ปี ${parseMonths} เดือน ${parseDays} วัน`
  }

  const formatDate = (input?: string | Date): string => {
    // return input ? dayjs(input).format('DD/MM/BB') : '-'
    return input ? dayjs(input).format('DD/MM/YYYY') : '-' // use 'YYYY' for UAT
  }
  const formatTime = (input?: string | Date): string => {
    return input ? dayjs(input).format('HH:mm[น.]') : '-'
  }
  const formatDateTime = (input?: string | Date): string => {
    // return input ? dayjs(input).format('DD/MM/BBBB HH:mm') : '-'
    return input ? dayjs(input).format('DD/MM/YYYY HH:mm') : '-' // use 'YYYY' for UAT
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
