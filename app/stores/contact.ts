export interface ContactSubmission {
  name: string
  email: string
  message: string
  submittedAt: string
}

export const useContactStore = defineStore('contact', () => {
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const queuedSubmissions = ref<ContactSubmission[]>([])
  const hasQueuedSubmission = ref(false)

  function resetForm () {
    name.value = ''
    email.value = ''
    message.value = ''
  }

  function queueSubmission () {
    queuedSubmissions.value.push({
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      submittedAt: new Date().toISOString(),
    })

    resetForm()
    hasQueuedSubmission.value = true
  }

  function dismissConfirmation () {
    hasQueuedSubmission.value = false
  }

  return {
    dismissConfirmation,
    email,
    hasQueuedSubmission,
    message,
    name,
    queueSubmission,
    queuedSubmissions,
    resetForm,
  }
})
