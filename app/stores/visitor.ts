import type { RegisterUserMutation, UserQuery } from '@/graphql/posts'
import {
  REGISTER_USER_MUTATION,
  USER_QUERY,
} from '@/graphql/posts'

const VISITOR_ID_KEY = 'portfolio.visitor-id.v1'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function createVisitorId () {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const useVisitorStore = defineStore('visitor', () => {
  const { $apollo } = useNuxtApp()
  const userId = ref('')
  const isPersistent = ref(false)
  const isRegistered = ref(false)
  let registrationPromise: Promise<string> | null = null

  function initializeVisitor () {
    if (!import.meta.client || userId.value) {
      return userId.value
    }

    let storedId: string

    try {
      storedId = localStorage.getItem(VISITOR_ID_KEY) ?? ''
    } catch {
      storedId = ''
    }

    userId.value = UUID_PATTERN.test(storedId) ? storedId : createVisitorId()

    try {
      localStorage.setItem(VISITOR_ID_KEY, userId.value)
      isPersistent.value = true
    } catch {
      isPersistent.value = false
    }

    return userId.value
  }

  async function findRegisteredUser (id: string) {
    const result = await $apollo.query<UserQuery>({
      fetchPolicy: 'network-only',
      query: USER_QUERY,
      variables: { userId: id },
    })

    return result.data?.user ?? null
  }

  async function ensureRegistered () {
    const id = initializeVisitor()

    if (!id) {
      throw new Error('Visitor identity is only available in the browser.')
    }

    if (isRegistered.value) {
      return id
    }

    if (registrationPromise) {
      return registrationPromise
    }

    registrationPromise = (async () => {
      const existingUser = await findRegisteredUser(id)

      if (!existingUser) {
        try {
          await $apollo.mutate<RegisterUserMutation>({
            mutation: REGISTER_USER_MUTATION,
            variables: { userId: id },
          })
        } catch (error) {
          const registeredByAnotherRequest = await findRegisteredUser(id)

          if (!registeredByAnotherRequest) {
            throw error
          }
        }
      }

      isRegistered.value = true
      return id
    })().finally(() => {
      registrationPromise = null
    })

    return registrationPromise
  }

  return {
    ensureRegistered,
    initializeVisitor,
    isPersistent,
    isRegistered,
    userId,
  }
})
