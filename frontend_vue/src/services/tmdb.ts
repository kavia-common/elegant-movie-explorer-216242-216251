const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

export interface TmdbMovie {
  id: number
  title?: string
  name?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
}

function headers() {
  if (!API_KEY) {
    console.warn('Missing VITE_TMDB_API_KEY. TMDB requests will fail.')
  }
  return { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json;charset=utf-8' }
}

// PUBLIC_INTERFACE
export async function getTrending(signal?: AbortSignal): Promise<TmdbMovie[]> {
  const res = await fetch(`${BASE_URL}/trending/movie/week`, { headers: headers(), signal })
  if (!res.ok) throw new Error('Failed to fetch trending')
  const json = await res.json()
  return json.results || []
}

// PUBLIC_INTERFACE
export async function getFeatured(signal?: AbortSignal): Promise<TmdbMovie[]> {
  // mix popular and top_rated
  const [popularRes, topRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/popular`, { headers: headers(), signal }),
    fetch(`${BASE_URL}/movie/top_rated`, { headers: headers(), signal }),
  ])
  if (!popularRes.ok || !topRes.ok) throw new Error('Failed to fetch featured')
  const popular = (await popularRes.json()).results || []
  const top = (await topRes.json()).results || []
  // de-duplicate by id
  const seen = new Set<number>()
  const combined: TmdbMovie[] = []
  ;[...popular, ...top].forEach((m: TmdbMovie) => {
    if (!seen.has(m.id)) {
      seen.add(m.id)
      combined.push(m)
    }
  })
  return combined.slice(0, 20)
}

// PUBLIC_INTERFACE
export async function searchMovies(query: string, signal?: AbortSignal): Promise<TmdbMovie[]> {
  if (!query.trim()) return []
  const u = new URL(`${BASE_URL}/search/movie`)
  u.searchParams.set('query', query)
  const res = await fetch(u.toString(), { headers: headers(), signal })
  if (!res.ok) throw new Error('Search failed')
  const json = await res.json()
  return json.results || []
}

// PUBLIC_INTERFACE
export function imgPoster(path?: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' = 'w342') {
  if (!path) return ''
  return `${IMG_BASE}/${size}${path}`
}

// PUBLIC_INTERFACE
export function movieTitle(m: TmdbMovie) {
  return m.title || m.name || 'Untitled'
}
