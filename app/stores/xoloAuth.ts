interface XoloUserProfile {
  email: string
  firstName: string
  lastName: string
  profilePhoto: string
  userId: string | null
  username: string
}

interface XoloSession {
  accessToken: string
  accountId: string
  expiresAt: number
  temporalSecret: string
  user: XoloUserProfile
}

interface XoloAuthenticatedResponse {
  access_token: string
  email: string
  first_name: string
  last_name: string
  metadata: Record<string, string>
  profile_photo: string
  temporal_secret: string
  user_id?: string | null
  username: string
}

export interface XoloLoginCredentials {
  accountId: string
  apiKey: string
  password: string
  scope: string
  username: string
}

const SESSION_DURATION_MS = 15 * 60 * 1000
const SESSION_STORAGE_KEY = 'portfolio.xolo-admin-session.v1'

function isStoredSession (value: unknown): value is XoloSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<XoloSession>

  return typeof candidate.accessToken === 'string'
    && typeof candidate.accountId === 'string'
    && typeof candidate.expiresAt === 'number'
    && typeof candidate.temporalSecret === 'string'
    && Boolean(candidate.user)
    && typeof candidate.user?.username === 'string'
}

async function responseErrorMessage (response: Response) {
  if (response.status === 401 || response.status === 403) {
    return 'Xolo rejected these credentials.'
  }

  try {
    const payload = await response.json() as { detail?: Array<{ msg?: string }> | string }

    if (typeof payload.detail === 'string') {
      return payload.detail
    }

    const validationMessage = payload.detail?.find(item => item.msg)?.msg

    if (validationMessage) {
      return validationMessage
    }
  } catch {
    // Xolo can return an empty or non-JSON error response.
  }

  return `Xolo authentication failed (${response.status}).`
}

export const useXoloAuthStore = defineStore('xolo-auth', () => {
  const config = useRuntimeConfig()
  const session = ref<XoloSession | null>(null)
  const isLoading = ref(false)
  const authError = ref('')
  let validationPromise: Promise<boolean> | null = null

  const isAuthenticated = computed(() => Boolean(
    session.value && session.value.expiresAt > Date.now(),
  ))
  const user = computed(() => session.value?.user ?? null)

  function xoloEndpoint (accountId: string, action = '') {
    const baseUrl = config.public.xoloUrl.replace(/\/$/, '')
    const suffix = action ? `/${action}` : ''

    return `${baseUrl}/api/v4/accounts/${encodeURIComponent(accountId)}/users${suffix}`
  }

  function clearSession () {
    session.value = null

    if (!import.meta.client) {
      return
    }

    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // The in-memory session is still cleared when storage is unavailable.
    }
  }

  function persistSession () {
    if (!import.meta.client || !session.value) {
      return
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session.value))
    } catch {
      // Authentication remains valid in memory for this page lifecycle.
    }
  }

  function restoreSession () {
    if (!import.meta.client || session.value) {
      return isAuthenticated.value
    }

    try {
      const storedValue = sessionStorage.getItem(SESSION_STORAGE_KEY)
      const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : null

      if (!isStoredSession(parsedValue) || parsedValue.expiresAt <= Date.now()) {
        clearSession()
        return false
      }

      session.value = parsedValue
      return true
    } catch {
      clearSession()
      return false
    }
  }

  async function login (credentials: XoloLoginCredentials) {
    isLoading.value = true
    authError.value = ''
    console.log('Logging in with credentials:', credentials)
    try {
      const response = await fetch(xoloEndpoint(credentials.accountId.trim(), 'auth'), {
        body: JSON.stringify({
          expiration: '15m',
          password: credentials.password,
          renew_token: false,
          scope: credentials.scope.trim(),
          username: credentials.username.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': credentials.apiKey.trim(),
        },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(await responseErrorMessage(response))
      }

      const authenticated = await response.json() as XoloAuthenticatedResponse

      if (!authenticated.access_token || !authenticated.temporal_secret || !authenticated.username) {
        throw new Error('Xolo returned an incomplete authentication response.')
      }

      session.value = {
        accessToken: authenticated.access_token,
        accountId: credentials.accountId.trim(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
        temporalSecret: authenticated.temporal_secret,
        user: {
          email: authenticated.email,
          firstName: authenticated.first_name,
          lastName: authenticated.last_name,
          profilePhoto: authenticated.profile_photo,
          userId: authenticated.user_id ?? null,
          username: authenticated.username,
        },
      }
      persistSession()

      return true
    } catch (error) {
      clearSession()
      authError.value = error instanceof Error
        ? error.message
        : 'Unable to connect to Xolo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function validateSession () {
    if (!restoreSession() || !session.value) {
      return false
    }

    if (validationPromise) {
      return validationPromise
    }

    validationPromise = (async () => {
      const activeSession = session.value

      if (!activeSession || activeSession.expiresAt <= Date.now()) {
        clearSession()
        return false
      }

      try {
        const response = await fetch(xoloEndpoint(activeSession.accountId), {
          headers: {
            Authorization: `Bearer ${activeSession.accessToken}`,
            'Temporal-Secret-Key': activeSession.temporalSecret,
          },
          method: 'GET',
        })

        if (!response.ok) {
          clearSession()
          return false
        }

        return true
      } catch {
        authError.value = 'Unable to validate the current Xolo session.'
        return false
      }
    })().finally(() => {
      validationPromise = null
    })

    return validationPromise
  }

  async function logout () {
    const activeSession = session.value
    isLoading.value = true

    try {
      if (activeSession) {
        await fetch(xoloEndpoint(activeSession.accountId, 'logout'), {
          body: JSON.stringify({
            access_token: activeSession.accessToken,
            username: activeSession.user.username,
          }),
          headers: {
            Authorization: `Bearer ${activeSession.accessToken}`,
            'Content-Type': 'application/json',
            'Temporal-Secret-Key': activeSession.temporalSecret,
          },
          method: 'POST',
        })
      }
    } catch {
      // Local logout must succeed even if Xolo is temporarily unavailable.
    } finally {
      clearSession()
      authError.value = ''
      isLoading.value = false
    }
  }

  return {
    authError,
    clearSession,
    isAuthenticated,
    isLoading,
    login,
    logout,
    restoreSession,
    user,
    validateSession,
  }
})
