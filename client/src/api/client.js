const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function api(path, options = {}) {
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 204) return null
  const ct = res.headers.get('content-type')
  let data
  if (ct && ct.includes('application/json')) {
    data = await res.json()
  } else {
    data = { error: await res.text() }
  }
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}
