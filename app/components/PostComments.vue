<script setup lang="ts">
  const props = defineProps<{
    postId: string
  }>()

  const commentsStore = useCommentsStore()
  const {
    authorName,
    comments,
    cooldownRemaining,
    hasMoreComments,
    isCoolingDown,
    loadError,
    loading,
    submitError,
    submitPending,
    totalComments,
  } = storeToRefs(commentsStore)
  const content = ref('')
  const snackbar = reactive<{
    color: 'success' | 'warning'
    open: boolean
    text: string
  }>({
    color: 'success',
    open: false,
    text: '',
  })
  const canSubmit = computed(() => (
    authorName.value.trim().length > 0
    && content.value.trim().length > 0
    && !submitPending.value
    && !isCoolingDown.value
  ))

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  function authorInitial (name: string) {
    return name.trim().charAt(0).toUpperCase() || '?'
  }

  function showSnackbar (text: string, color: 'success' | 'warning') {
    snackbar.color = color
    snackbar.text = text
    snackbar.open = true
  }

  async function submitComment () {
    if (isCoolingDown.value) {
      showSnackbar(
        `Please wait ${cooldownRemaining.value} seconds before posting another comment.`,
        'warning',
      )
      return
    }

    const created = await commentsStore.createComment(props.postId, content.value)

    if (created) {
      content.value = ''
      showSnackbar(
        `Comment posted. You can post again in ${cooldownRemaining.value} seconds.`,
        'success',
      )
    }
  }

  watch(
    () => props.postId,
    (postId) => {
      commentsStore.initializeAuthorName()
      commentsStore.initializeRateLimit()
      void commentsStore.fetchComments(postId)
    },
    { immediate: true },
  )
</script>

<template>
  <section
    aria-labelledby="post-comments-title"
    class="post-comments"
  >
    <div class="post-comments__heading">
      <div>
        <p class="post-comments__eyebrow">Discussion</p>
        <h2 id="post-comments-title">Comments</h2>
      </div>

      <span aria-live="polite" class="post-comments__count">
        {{ totalComments }}
      </span>
    </div>

    <v-card
      class="post-comments__form glass-card pa-4 pa-sm-6"
      rounded="xl"
      tag="form"
      @submit.prevent="submitComment"
    >
      <v-text-field
        v-model="authorName"
        autocomplete="name"
        label="Your name"
        required
        variant="outlined"
      />

      <v-textarea
        v-model="content"
        auto-grow
        label="Add to the discussion"
        required
        rows="4"
        variant="outlined"
      />

      <v-alert
        v-if="submitError"
        class="mb-4"
        color="error"
        density="compact"
        role="alert"
        variant="tonal"
      >
        {{ submitError }}
      </v-alert>

      <div class="post-comments__form-actions">
        <span class="text-medium-emphasis">
          Your name will be remembered in this browser.
        </span>

        <v-btn
          class="text-none"
          color="primary"
          :disabled="!canSubmit"
          :loading="submitPending"
          prepend-icon="mdi-comment-outline"
          type="submit"
        >
          {{ isCoolingDown ? `Post comment (${cooldownRemaining}s)` : 'Post comment' }}
        </v-btn>
      </div>
    </v-card>

    <div v-if="loading && comments.length === 0" class="post-comments__loading">
      <v-progress-circular color="primary" indeterminate size="30" width="3" />
      <span>Loading comments…</span>
    </div>

    <v-alert
      v-else-if="loadError && comments.length === 0"
      class="mt-6"
      color="error"
      icon="mdi-alert-circle-outline"
      title="Comments are unavailable"
      variant="tonal"
    >
      <p class="mb-4">{{ loadError }}</p>

      <v-btn
        class="text-none"
        size="small"
        variant="outlined"
        @click="commentsStore.fetchComments(postId, { force: true })"
      >
        Try again
      </v-btn>
    </v-alert>

    <v-empty-state
      v-else-if="comments.length === 0"
      class="mt-6"
      icon="mdi-comment-text-outline"
      text="Start the conversation about this post."
      title="No comments yet"
    />

    <div v-else class="post-comments__list">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="post-comments__comment"
      >
        <v-avatar color="primary" size="40" variant="tonal">
          {{ authorInitial(comment.authorName) }}
        </v-avatar>

        <div class="post-comments__comment-body">
          <div class="post-comments__comment-meta">
            <strong>{{ comment.authorName }}</strong>

            <time :datetime="comment.createdAt">
              {{ formatDate(comment.createdAt) }}
            </time>
          </div>

          <p>{{ comment.content }}</p>
        </div>
      </article>

      <v-alert
        v-if="loadError"
        color="error"
        density="compact"
        role="alert"
        variant="tonal"
      >
        {{ loadError }}
      </v-alert>

      <div v-if="hasMoreComments" class="text-center">
        <v-btn
          class="text-none"
          :loading="loading"
          prepend-icon="mdi-chevron-down"
          variant="outlined"
          @click="commentsStore.loadMoreComments()"
        >
          Load more comments
        </v-btn>
      </div>
    </div>

    <v-snackbar
      v-model="snackbar.open"
      :color="snackbar.color"
      location="bottom end"
      :timeout="6000"
    >
      {{ snackbar.text }}

      <template #actions>
        <v-btn
          aria-label="Close notification"
          icon="mdi-close"
          variant="text"
          @click="snackbar.open = false"
        />
      </template>
    </v-snackbar>
  </section>
</template>

<style scoped>
  .post-comments {
    border-top: 1px solid var(--portfolio-border);
    margin-top: 64px;
    min-width: 0;
    padding-top: 48px;
  }

  .post-comments__heading,
  .post-comments__form-actions,
  .post-comments__comment,
  .post-comments__comment-meta {
    display: flex;
  }

  .post-comments__heading {
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .post-comments__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .post-comments__heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    margin: 0;
  }

  .post-comments__count {
    align-items: center;
    background: rgb(var(--v-theme-primary), 0.12);
    border: 1px solid rgb(var(--v-theme-primary), 0.25);
    border-radius: 999px;
    color: var(--portfolio-accent);
    display: inline-flex;
    font-weight: 700;
    justify-content: center;
    min-height: 40px;
    min-width: 40px;
    padding: 6px 12px;
  }

  .post-comments__form {
    margin-bottom: 24px;
  }

  .post-comments__form-actions {
    align-items: center;
    gap: 16px;
    justify-content: space-between;
  }

  .post-comments__form-actions span {
    font-size: 0.85rem;
  }

  .post-comments__loading {
    align-items: center;
    color: var(--portfolio-text-muted);
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 48px 16px;
  }

  .post-comments__list {
    display: grid;
    gap: 16px;
  }

  .post-comments__comment {
    align-items: flex-start;
    background: rgb(var(--v-theme-surface), 0.45);
    border: 1px solid var(--portfolio-border);
    border-radius: 18px;
    gap: 14px;
    padding: 20px;
  }

  .post-comments__comment-body {
    min-width: 0;
  }

  .post-comments__comment-meta {
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .post-comments__comment-meta time {
    color: var(--portfolio-text-muted);
    font-size: 0.82rem;
  }

  .post-comments__comment-body p {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 8px 0 0;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  @media (max-width: 600px) {
    .post-comments {
      margin-top: 48px;
      padding-top: 40px;
    }

    .post-comments__form-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .post-comments__form-actions :deep(.v-btn) {
      width: 100%;
    }

    .post-comments__comment {
      padding: 16px;
    }
  }
</style>
