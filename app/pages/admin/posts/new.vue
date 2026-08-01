<script setup lang="ts">
  import type { PostStatus, PostSummary } from '@/graphql/posts'

  definePageMeta({
    middleware: 'xolo-admin-client',
  })

  const authStore = useXoloAuthStore()
  const postsStore = usePostsStore()
  const {
    isLoading: authLoading,
    user,
  } = storeToRefs(authStore)
  const {
    createError,
    createPending,
  } = storeToRefs(postsStore)

  const title = ref('')
  const subtitle = ref('')
  const imageUrl = ref('')
  const content = ref('')
  const tags = ref<string[]>([])
  const skills = ref<string[]>([])
  const status = ref<PostStatus>('draft')
  const editorTab = ref<'preview' | 'write'>('write')
  const createdPost = ref<PostSummary | null>(null)

  const statusOptions: Array<{ title: string, value: PostStatus }> = [
    { title: 'Draft', value: 'draft' },
    { title: 'Published', value: 'published' },
  ]

  const canSubmit = computed(() => (
    title.value.trim().length > 0
    && content.value.trim().length > 0
  ))

  function normalizeValues (values: string[]) {
    return [...new Set(values.map(value => value.trim()).filter(Boolean))]
  }

  function resetForm () {
    title.value = ''
    subtitle.value = ''
    imageUrl.value = ''
    content.value = ''
    tags.value = []
    skills.value = []
    status.value = 'draft'
    editorTab.value = 'write'
  }

  async function submitPost () {
    if (!canSubmit.value || createPending.value) {
      return
    }

    createdPost.value = null
    const result = await postsStore.createPost({
      content: content.value.trim(),
      imageUrl: imageUrl.value.trim() || null,
      skills: normalizeValues(skills.value),
      status: status.value,
      subtitle: subtitle.value.trim() || null,
      tags: normalizeValues(tags.value),
      title: title.value.trim(),
    })

    if (result) {
      createdPost.value = result
      resetForm()
    }
  }

  async function logout () {
    await authStore.logout()
    await navigateTo('/admin/login')
  }

  useSeoMeta({
    robots: 'noindex, nofollow',
    title: 'Create blog post',
  })
</script>

<template>
  <div class="admin-editor">
    <v-container max-width="1180">
      <v-card class="admin-editor__surface pa-4 pa-sm-6 pa-md-8" rounded="xl">
        <header class="admin-editor__header">
          <div class="admin-editor__brand">
            <v-img
              alt="Xolo API logo"
              class="admin-editor__logo"
              height="56"
              src="/projects/xolo-api/logo.png"
              width="56"
            />

            <div>
              <p class="admin-editor__eyebrow">Powered by Xolo</p>
              <h1 class="text-h4 font-weight-bold">Create a blog post</h1>

              <p v-if="user" class="mt-1 mb-0 text-medium-emphasis">
                Signed in as {{ user.username }}
              </p>
            </div>
          </div>

          <v-btn
            class="text-none"
            :loading="authLoading"
            prepend-icon="mdi-logout"
            variant="outlined"
            @click="logout"
          >
            Sign out
          </v-btn>
        </header>

        <v-divider class="my-6" />

        <v-alert
          v-if="createdPost"
          class="mb-6"
          color="success"
          icon="mdi-check-circle-outline"
          title="Post created"
          variant="tonal"
        >
          <p class="mb-4">
            <span class="font-weight-bold">“{{ createdPost.title }}”</span> was created as {{ createdPost.status }}.
          </p>

          <div class="d-flex flex-wrap ga-3">
            <v-btn class="text-none font-weight-bold" size="small" variant="outlined" @click="createdPost = null">
              Create another
            </v-btn>

            <v-btn
              v-if="createdPost.status === 'published'"
              class="text-white"
              color="success"
              size="small"
              :to="`/blog/${createdPost.slug}`"
              variant="outlined"
            >
              View post
            </v-btn>
          </div>
        </v-alert>

        <v-alert
          v-if="createError"
          class="mb-6"
          color="error"
          icon="mdi-alert-circle-outline"
          title="Post was not created"
          variant="tonal"
        >
          {{ createError }}
        </v-alert>

        <v-form class="admin-editor__form" @submit.prevent="submitPost">
          <div class="admin-editor__fields">
            <v-text-field
              v-model="title"
              label="Title"
              required
              variant="outlined"
            />

            <v-text-field
              v-model="subtitle"
              label="Subtitle"
              variant="outlined"
            />

            <v-text-field
              v-model="imageUrl"
              label="Featured image URL"
              prepend-inner-icon="mdi-image-outline"
              type="url"
              variant="outlined"
            />

            <v-select
              v-model="status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
            />

            <v-combobox
              v-model="tags"
              chips
              clearable
              closable-chips
              label="Tags"
              multiple
              variant="outlined"
            />

            <v-combobox
              v-model="skills"
              chips
              clearable
              closable-chips
              hint="Use the same slugs as the public skill pages."
              label="Related skills"
              multiple
              persistent-hint
              variant="outlined"
            />
          </div>

          <section class="admin-editor__content">
            <v-tabs v-model="editorTab" color="primary">
              <v-tab value="write">Write</v-tab>
              <v-tab value="preview">Preview</v-tab>
            </v-tabs>

            <!-- <p class="admin-editor__syntax">
              Math: <code>$inline$</code> or <code>$$</code> blocks. Diagrams: fenced
              <code>```mermaid</code> blocks. Escape literal currency as <code>\$</code>.
            </p> -->

            <v-window v-model="editorTab" class="mt-4">
              <v-window-item value="write">
                <v-textarea
                  v-model="content"
                  auto-grow
                  class="admin-editor__textarea"
                  label="Markdown content"
                  required
                  rows="18"
                  variant="outlined"
                />
              </v-window-item>

              <v-window-item value="preview">
                <div class="admin-editor__preview">
                  <MDC
                    v-if="content.trim()"
                    class="content-prose"
                    :value="content"
                  />

                  <v-empty-state
                    v-else
                    icon="mdi-language-markdown-outline"
                    text="Write some Markdown to see the rendered post."
                    title="Nothing to preview"
                  />
                </div>
              </v-window-item>
            </v-window>
          </section>

          <div class="admin-editor__actions">
            <p class="mb-0 text-medium-emphasis">
              The backend generates the public slug from the post.
            </p>

            <v-btn
              class="text-none"
              color="primary"
              :disabled="!canSubmit"
              :loading="createPending"
              prepend-icon="mdi-send-outline"
              size="large"
              type="submit"
            >
              {{ status === 'published' ? 'Publish post' : 'Create draft' }}
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
  .admin-editor {
    min-height: 100vh;
    padding: 40px 16px;
  }

  .admin-editor__surface {
    background: var(--portfolio-bg-elevated);
    border: 1px solid var(--portfolio-border);
    box-shadow: var(--portfolio-shadow);
  }

  .admin-editor__header,
  .admin-editor__brand,
  .admin-editor__actions {
    align-items: center;
    display: flex;
  }

  .admin-editor__header,
  .admin-editor__actions {
    gap: 20px;
    justify-content: space-between;
  }

  .admin-editor__brand {
    gap: 16px;
    min-width: 0;
  }

  .admin-editor__logo {
    border-radius: 14px;
    flex: 0 0 auto;
  }

  .admin-editor__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .admin-editor__form,
  .admin-editor__fields,
  .admin-editor__content {
    display: grid;
    gap: 18px;
  }

  .admin-editor__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-editor__content {
    margin-top: 8px;
  }

  .admin-editor__syntax {
    color: var(--portfolio-text-muted);
    font-size: 0.82rem;
    line-height: 1.7;
    margin: 0;
  }

  .admin-editor__syntax code {
    background: var(--portfolio-code-bg);
    border-radius: 6px;
    color: var(--portfolio-code-text);
    padding: 0.12rem 0.32rem;
  }

  .admin-editor__preview {
    border: 1px solid var(--portfolio-border);
    border-radius: 18px;
    min-height: 420px;
    min-width: 0;
    padding: 24px;
  }

  .admin-editor__textarea :deep(textarea) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    line-height: 1.65;
  }

  .admin-editor__actions {
    border-top: 1px solid var(--portfolio-border);
    margin-top: 8px;
    padding-top: 24px;
  }

  @media (max-width: 700px) {
    .admin-editor {
      padding: 20px 8px;
    }

    .admin-editor__header,
    .admin-editor__actions {
      align-items: stretch;
      flex-direction: column;
    }

    .admin-editor__fields {
      grid-template-columns: 1fr;
    }

    .admin-editor__preview {
      padding: 18px;
    }
  }
</style>
