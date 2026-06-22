const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const AUTH_EXPIRED_MESSAGE = 'Сессия истекла. Войдите в систему заново'

const translatedMessages = {
  Unauthorized: AUTH_EXPIRED_MESSAGE,
  'Internal Server Error': 'Ошибка сервера. Попробуйте позже',
  'Bad Request': 'Проверьте введенные данные',
  Forbidden: 'Недостаточно прав для выполнения действия',
  'Not Found': 'Запись не найдена'
}

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

const normalizeMessage = (message) => {
  const text = Array.isArray(message) ? message.join(', ') : message
  return translatedMessages[text] || text || 'Ошибка запроса'
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

    if (response.status === 401) {
      tokenStorage.clear()

      if (path !== '/auth/login' && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }

      throw new Error(AUTH_EXPIRED_MESSAGE)
    }

    throw new Error(normalizeMessage(message))
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
