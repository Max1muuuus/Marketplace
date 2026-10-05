const API_BASE = '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('marketplace-token')
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const responseText = await response.text()
    const details = (() => {
      try {
        return JSON.parse(responseText)
      } catch {
        return null
      }
    })()
    if (response.status === 401) {
      localStorage.removeItem('marketplace-token')
      localStorage.removeItem('marketplace-user')
      window.dispatchEvent(new Event('marketplace:unauthorized'))
    }
    const message = details?.message || details?.title || `${response.status} ${response.statusText}`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  }),
  put: (path, body, options = {}) => request(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
}

export default api
