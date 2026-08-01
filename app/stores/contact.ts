import type {
  CreateContactMessageMutation,
  CreateContactMessageVariables,
} from '@/graphql/contact'
import { CREATE_CONTACT_MESSAGE_MUTATION } from '@/graphql/contact'

type ContactSnackbarColor = 'error' | 'success'

export const useContactStore = defineStore('contact', () => {
  const { $apollo } = useNuxtApp()
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const submitPending = ref(false)
  const snackbarOpen = ref(false)
  const snackbarColor = ref<ContactSnackbarColor>('success')
  const snackbarMessage = ref('')

  function resetForm () {
    name.value = ''
    email.value = ''
    message.value = ''
  }

  function showSnackbar (text: string, color: ContactSnackbarColor) {
    snackbarColor.value = color
    snackbarMessage.value = text
    snackbarOpen.value = true
  }

  function dismissSnackbar () {
    snackbarOpen.value = false
  }

  async function submitMessage () {
    if (submitPending.value) {
      return false
    }

    submitPending.value = true
    dismissSnackbar()

    const variables: CreateContactMessageVariables = {
      email: email.value.trim(),
      message: message.value.trim(),
      name: name.value.trim(),
    }

    try {
      const result = await $apollo.mutate<CreateContactMessageMutation>({
        mutation: CREATE_CONTACT_MESSAGE_MUTATION,
        variables,
      })

      if (!result.data?.createContactMessage) {
        throw new Error('The contact service returned an empty response.')
      }

      resetForm()
      showSnackbar('Message sent successfully.', 'success')

      return true
    } catch {
      showSnackbar('We could not send your message. Please try again.', 'error')

      return false
    } finally {
      submitPending.value = false
    }
  }

  return {
    dismissSnackbar,
    email,
    message,
    name,
    resetForm,
    snackbarColor,
    snackbarMessage,
    snackbarOpen,
    submitMessage,
    submitPending,
  }
})
