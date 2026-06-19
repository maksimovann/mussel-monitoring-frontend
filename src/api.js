const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem('access_token')
  },
  setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
  },
  clear() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}

export const apiRequest = async (path, options = {}) => {
  const token = tokenStorage.getAccessToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    let message = 'Ошибка запроса'

    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      message = response.statusText || message
    }

    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const apiGet = (path) => apiRequest(path)

export const apiPost = (path, data) =>
  apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(data)
  })

export const apiPut = (path, data) =>
  apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(data)
  })

export const apiDelete = (path) =>
  apiRequest(path, {
    method: 'DELETE'
  })
