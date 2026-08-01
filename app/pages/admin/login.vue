<script setup lang="ts">
  const route = useRoute()
  const authStore = useXoloAuthStore()
  const {
    authError,
    isLoading,
  } = storeToRefs(authStore)

  const accountId = ref('')
  const apiKey = ref('')
  const scope = ref('Xolo')
  const username = ref('')
  const password = ref('')
  const isCheckingSession = ref(true)

  const canSubmit = computed(() => [
    accountId.value,
    apiKey.value,
    scope.value,
    username.value,
    password.value,
  ].every(value => value.trim().length > 0))

  const redirectPath = computed(() => {
    const requestedPath = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : ''

    return requestedPath.startsWith('/admin/')
      ? requestedPath
      : '/admin/posts/new'
  })

  async function submitLogin () {
    if (!canSubmit.value || isLoading.value) {
      return
    }

    const authenticated = await authStore.login({
      accountId: accountId.value,
      apiKey: apiKey.value,
      password: password.value,
      scope: scope.value,
      username: username.value,
    })

    apiKey.value = ''
    password.value = ''

    if (authenticated) {
      await navigateTo(redirectPath.value)
    }
  }

  onMounted(async () => {
    if (await authStore.validateSession()) {
      await navigateTo(redirectPath.value)
    }

    isCheckingSession.value = false
  })

  useSeoMeta({
    robots: 'noindex, nofollow',
    title: 'Admin login',
  })
</script>

<template>
  <div class="admin-login">
    <v-container class="admin-login__container" max-width="520">
      <v-card class="admin-login__card pa-5 pa-sm-8" rounded="xl">
        <div class="admin-login__identity text-center">
          <v-img
            alt="Xolo API logo"
            class="admin-login__logo mx-auto"
            height="96"
            src="/projects/xolo-api/logo.png"
            width="96"
          />

          <div>
            <p class="admin-login__eyebrow">Powered by Xolo</p>
            <h1 class="text-h4 font-weight-bold">Blog administration</h1>

            <p class="mt-2 text-medium-emphasis">
              Authenticate with Xolo to create and publish posts.
            </p>
          </div>
        </div>

        <div v-if="isCheckingSession" class="py-10 text-center">
          <v-progress-circular color="primary" indeterminate />
          <p class="mt-4 mb-0 text-medium-emphasis">Checking your session…</p>
        </div>

        <v-form v-else class="admin-login__form" @submit.prevent="submitLogin">
          <v-alert
            v-if="authError"
            color="error"
            density="comfortable"
            icon="mdi-alert-circle-outline"
            variant="tonal"
          >
            {{ authError }}
          </v-alert>

          <v-text-field
            v-model="accountId"
            autocomplete="off"
            label="Account ID"
            prepend-inner-icon="mdi-domain"
            required
            variant="outlined"
          />

          <v-text-field
            v-model="apiKey"
            autocomplete="off"
            label="API key"
            prepend-inner-icon="mdi-key-variant"
            required
            type="password"
            variant="outlined"
          />

          <v-text-field
            v-model="scope"
            autocomplete="off"
            label="Scope"
            prepend-inner-icon="mdi-shield-account-outline"
            required
            variant="outlined"
          />

          <v-text-field
            v-model="username"
            autocomplete="username"
            label="Username"
            prepend-inner-icon="mdi-account-outline"
            required
            variant="outlined"
          />

          <v-text-field
            v-model="password"
            autocomplete="current-password"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            required
            type="password"
            variant="outlined"
          />

          <v-btn
            block
            class="text-none"
            color="primary"
            :disabled="!canSubmit"
            :loading="isLoading"
            size="large"
            type="submit"
          >
            Sign in with Xolo
          </v-btn>

          <p class="admin-login__notice text-center">
            Sessions last 15 minutes. The API key and password are never stored.
          </p>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
  .admin-login {
    align-items: center;
    display: flex;
    min-height: 100vh;
    padding: 32px 16px;
  }

  .admin-login__container {
    width: 100%;
  }

  .admin-login__card {
    background: var(--portfolio-bg-elevated);
    border: 1px solid var(--portfolio-border);
    box-shadow: var(--portfolio-shadow);
  }

  .admin-login__identity,
  .admin-login__form {
    display: grid;
    gap: 18px;
  }

  .admin-login__identity {
    margin-bottom: 28px;
  }

  .admin-login__logo {
    border-radius: 20px;
  }

  .admin-login__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .admin-login__notice {
    color: var(--portfolio-text-muted);
    font-size: 0.78rem;
    line-height: 1.6;
    margin: 0;
  }
</style>
