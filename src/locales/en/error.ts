const error = {
  GAS_OUT_OF_RANGE: 'Unsafe atmosphere reading. The backend rejected this reading — correct the gas test and resubmit.',
  ENTRANTS_STILL_INSIDE: 'Closure blocked — one or more entrants are still checked in.',
  CERT_EXPIRED: 'A registered worker has a missing or expired certificate.',
  FIRE_WATCH_NOT_ELAPSED: 'Closure is locked until the 30-minute Fire Watch countdown ends.',
  unknown: 'Something went wrong. Please try again.'
}

export default error
