/**
 * wayfinder 068/070 — "the permit carries a real-world coordinate, parsed from a pasted map URL."
 *
 * Mirrors `parse-map-coordinate.util.ts` in the api (`smart-work-permit-api/src/modules/permit/lib/`)
 * REGEX-FOR-REGEX, on purpose — this is a convenience parse for instant feedback, never a gate
 * (`../../PROMPT-LOG.md` "the server's verdict is authoritative"). The server re-parses whatever
 * is typed here and its answer wins; a divergence between the two copies would show the user a
 * green field the server then rejects, or vice versa, so keep this in lockstep with the api file
 * rather than "improving" it independently.
 *
 * Accepted forms:
 *   - https://www.google.com/maps/@13.7563,100.5018,17z
 *   - https://www.google.com/maps/place/.../@13.7563,100.5018,17z/...
 *   - https://www.openstreetmap.org/#map=17/13.7563/100.5018
 *   - a bare "13.7563, 100.5018"
 *
 * REJECTED, ALWAYS, NEVER FOLLOWED: a `goo.gl` / `maps.app.goo.gl` shortener — resolving one
 * would be an outbound request to a third party on user-supplied input (the standing first-party
 * rule AND an SSRF shape). Unparseable input is a form error, never a silent no-op.
 */

export interface IParsedMapCoordinate {
  ok: true
  latitude: number
  longitude: number
}

export interface IUnparsedMapCoordinate {
  ok: false
  reason: string
}

export type TParseMapCoordinateResult = IParsedMapCoordinate | IUnparsedMapCoordinate

export const LATITUDE_RANGE = { min: -90, max: 90 }
export const LONGITUDE_RANGE = { min: -180, max: 180 }

const SHORTENER_HOSTNAMES = ['goo.gl', 'maps.app.goo.gl']

function isShortenerHostname (hostname: string): boolean {
  return SHORTENER_HOSTNAMES.some((domain: string): boolean => hostname === domain || hostname.endsWith(`.${domain}`))
}

function inRange (value: number, range: { min: number, max: number }): boolean {
  return Number.isFinite(value) && value >= range.min && value <= range.max
}

function toResult (latitude: number, longitude: number): TParseMapCoordinateResult {
  if (!inRange(latitude, LATITUDE_RANGE)) {
    return { ok: false, reason: `Latitude ${latitude} is out of range (${LATITUDE_RANGE.min} to ${LATITUDE_RANGE.max})` }
  }
  if (!inRange(longitude, LONGITUDE_RANGE)) {
    return { ok: false, reason: `Longitude ${longitude} is out of range (${LONGITUDE_RANGE.min} to ${LONGITUDE_RANGE.max})` }
  }
  return { ok: true, latitude, longitude }
}

const GOOGLE_AT_PATTERN = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/
const OSM_MAP_PATTERN = /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/
const BARE_PAIR_PATTERN = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/

export function parseMapCoordinate (input: string): TParseMapCoordinateResult {
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    return { ok: false, reason: 'No coordinate or map URL was provided' }
  }

  try {
    const url = new URL(trimmed)
    if (isShortenerHostname(url.hostname)) {
      return {
        ok: false,
        reason: 'This is a shortened map link, which cannot be read without opening it. Open the link, then paste the full URL from your browser\'s address bar.'
      }
    }
  } catch {
    // Not a URL at all — fall through to the bare "lat, lng" pattern below.
  }

  const bareMatch = BARE_PAIR_PATTERN.exec(trimmed)
  if (bareMatch) {
    return toResult(Number(bareMatch[1]), Number(bareMatch[2]))
  }

  const googleMatch = GOOGLE_AT_PATTERN.exec(trimmed)
  if (googleMatch) {
    return toResult(Number(googleMatch[1]), Number(googleMatch[2]))
  }

  const osmMatch = OSM_MAP_PATTERN.exec(trimmed)
  if (osmMatch) {
    return toResult(Number(osmMatch[1]), Number(osmMatch[2]))
  }

  return {
    ok: false,
    reason: 'Could not read a coordinate from this text. Paste a Google Maps or OpenStreetMap URL, or a "latitude, longitude" pair.'
  }
}

export default parseMapCoordinate
