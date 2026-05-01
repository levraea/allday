import axios from 'axios'

const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'allday_auth_token'

function normalizeBody(body) {
  if (typeof body !== 'string') return body
  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

export async function api(path, options = {}) {
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const token = getAuthToken()
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await axios.request({
      url,
      method: options.method || 'GET',
      data: options.body !== undefined ? normalizeBody(options.body) : undefined,
      headers: { ...authHeader, ...(options.headers || {}) },
      withCredentials: false,
      validateStatus: () => true,
    })

    if (res.status === 204) return null

    if (res.status < 200 || res.status >= 300) {
      const err = new Error(res.data?.error || res.statusText || 'Request failed')
      err.status = res.status
      err.body = res.data
      throw err
    }

    return res.data
  } catch (error) {
    if (error?.status) throw error
    const err = new Error(error?.message || 'Network error')
    err.status = 0
    err.body = null
    throw err
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}
