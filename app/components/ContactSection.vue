<script setup lang="ts">
  import type { VForm } from 'vuetify/components'

  const contactStore = useContactStore()
  const { email, message, name } = storeToRefs(contactStore)

  const formRef = ref<VForm | null>(null)
  const isSubmitting = ref(false)

  const requiredRule = (value: string) => value.trim().length > 0 || 'This field is required.'
  function emailRule (value: string) {
    const normalizedEmail = value.trim()
    const atIndex = normalizedEmail.indexOf('@')
    const domain = normalizedEmail.slice(atIndex + 1)
    const isValid = atIndex > 0
      && atIndex === normalizedEmail.lastIndexOf('@')
      && domain.includes('.')
      && !normalizedEmail.includes(' ')

    return isValid || 'Enter a valid email address.'
  }

  async function submitContactForm () {
    isSubmitting.value = true

    const { valid } = await formRef.value?.validate() ?? { valid: false }

    if (valid) {
      contactStore.queueSubmission()
      formRef.value?.resetValidation()
    }

    isSubmitting.value = false
  }
</script>

<template>
  <div class="contact-layout">
    <v-card class="contact-details glass-card pa-6 pa-md-8" rounded="xl">
      <p class="text-h5 font-weight-bold mb-3">
        Let’s connect
      </p>

      <p class="text-body-1 text-medium-emphasis mb-8">
        Reach out about software architecture, distributed systems, research, teaching, or potential collaborations.
      </p>

      <div class="contact-links">
        <v-btn
          class="contact-link text-none"
          href="mailto:ignacio.bcastillo@gmail.com"
          prepend-icon="mdi-email-outline"
          variant="tonal"
        >
          ignacio.bcastillo@gmail.com
        </v-btn>

        <v-btn
          class="contact-link text-none"
          href="https://github.com/nachocodexx"
          prepend-icon="mdi-github"
          rel="noopener noreferrer"
          target="_blank"
          variant="tonal"
        >
          GitHub
        </v-btn>

        <v-btn
          class="contact-link text-none"
          href="https://www.linkedin.com/in/jcastillox/"
          prepend-icon="mdi-linkedin"
          rel="noopener noreferrer"
          target="_blank"
          variant="tonal"
        >
          LinkedIn
        </v-btn>
      </div>
    </v-card>

    <v-card class="glass-card pa-6 pa-md-8" rounded="xl">
      <p class="text-h5 font-weight-bold mb-6">
        Leave a message
      </p>

      <v-form ref="formRef" @submit.prevent="submitContactForm">
        <v-text-field
          v-model="name"
          autocomplete="name"
          label="Name"
          name="name"
          :rules="[requiredRule]"
          variant="outlined"
        />

        <v-text-field
          v-model="email"
          autocomplete="email"
          label="Email"
          name="email"
          :rules="[requiredRule, emailRule]"
          type="email"
          variant="outlined"
        />

        <v-textarea
          v-model="message"
          auto-grow
          label="Message"
          name="message"
          rows="5"
          :rules="[requiredRule]"
          variant="outlined"
        />

        <v-btn
          class="text-none"
          color="primary"
          :loading="isSubmitting"
          prepend-icon="mdi-send-outline"
          rounded="xl"
          size="large"
          type="submit"
        >
          Submit message
        </v-btn>
      </v-form>

      <v-alert
        v-if="contactStore.hasQueuedSubmission"
        class="mt-6"
        closable
        color="primary"
        icon="mdi-information-outline"
        title="Message saved locally"
        variant="tonal"
        @click:close="contactStore.dismissConfirmation()"
      >
        Email delivery is not connected yet. Your message is stored only for this browser session.
      </v-alert>
    </v-card>
  </div>
</template>

<style scoped>
  .contact-layout {
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .contact-layout :deep(.v-card),
  .contact-layout :deep(.v-form),
  .contact-layout :deep(.v-input) {
    max-width: 100%;
    min-width: 0;
  }

  .contact-details {
    align-self: start;
  }

  .contact-links {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .contact-link {
    justify-content: flex-start;
    max-width: 100%;
  }

  :deep(.contact-link .v-btn__content) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 800px) {
    .contact-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .contact-details,
    .contact-layout > :deep(.v-card) {
      padding: 20px !important;
    }

    .contact-link {
      min-height: 48px;
      width: 100%;
    }

    :deep(.contact-link .v-btn__content) {
      overflow-wrap: anywhere;
      white-space: normal;
    }
  }
</style>
