<script setup lang="ts">
  import { nextTick, onBeforeUnmount, ref } from 'vue'

  interface ChatMessage {
    id: number
    role: 'assistant' | 'user'
    text: string
  }

  interface AssistantReply {
    text: string
    action?: () => Promise<void>
  }

  const { closeAssistant, isOpen, toggleAssistant } = useAssistantWidget()
  const prompt = ref('')
  const isReplying = ref(false)
  const messagesRef = ref<HTMLElement | null>(null)
  const messages = ref<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Welcome. I am the AI assistant for Ignacio Castillo’s portfolio. Ask about projects, research, teaching, skills, or the blog.',
    },
  ])

  const quickPrompts = [
    'Show me projects',
    'Tell me about research',
    'What does Ignacio teach?',
    'Where can I read the blog?',
  ]

  let replyTimer: ReturnType<typeof setTimeout> | null = null

  async function scrollMessagesToEnd () {
    await nextTick()

    messagesRef.value?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.value.scrollHeight,
    })
  }

  async function scrollToSection (sectionId: string) {
    if (!import.meta.client) {
      return
    }

    if (window.location.pathname !== '/') {
      await navigateTo(`/#${sectionId}`)
      return
    }

    await nextTick()
    document.querySelector<HTMLElement>(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function buildAssistantReply (value: string): Promise<AssistantReply> {
    const normalized = value.toLowerCase()

    if (normalized.includes('project')) {
      return {
        action: () => scrollToSection('projects'),
        text: 'The projects section highlights distributed systems, secure platforms, and edge tooling. I can bring you there now.',
      }
    }

    if (normalized.includes('research') || normalized.includes('paper')) {
      return {
        action: () => scrollToSection('research-papers'),
        text: 'Research papers are listed with venue, year, summaries, and DOI links. I can move you to that section now.',
      }
    }

    if (normalized.includes('teach') || normalized.includes('professor')) {
      return {
        action: () => scrollToSection('about'),
        text: 'Ignacio combines software engineering practice with experience as a professor, mentoring students through computer science and software engineering work.',
      }
    }

    if (normalized.includes('blog') || normalized.includes('post')) {
      return {
        action: () => navigateTo('/blog'),
        text: 'The blog lives in a markdown-backed Nuxt Content module. I can open the blog index so you can browse technical posts.',
      }
    }

    if (normalized.includes('skill') || normalized.includes('architecture')) {
      return {
        action: () => scrollToSection('skills'),
        text: 'The skills matrix now starts with systems foundations and then moves into languages, frameworks, and data platforms with level indicators for quick scanning.',
      }
    }

    return {
      text: 'I can help you navigate this portfolio. Try asking about projects, research papers, teaching, skills, or the blog.',
    }
  }

  async function submitPrompt (value = prompt.value) {
    const text = value.trim()

    if (!text || isReplying.value) {
      return
    }

    isReplying.value = true

    messages.value.push({
      id: Date.now(),
      role: 'user',
      text,
    })

    prompt.value = ''
    await scrollMessagesToEnd()

    const reply = await buildAssistantReply(text)
    await scrollMessagesToEnd()

    await new Promise<void>((resolve) => {
      replyTimer = window.setTimeout(() => {
        resolve()
      }, 720)
    })

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: reply.text,
    })

    isReplying.value = false
    await scrollMessagesToEnd()

    if (reply.action) {
      await reply.action()
    }
  }

  onBeforeUnmount(() => {
    if (replyTimer) {
      window.clearTimeout(replyTimer)
    }
  })
</script>

<template>
  <div class="assistant-widget">
    <v-expand-transition>
      <v-card
        v-if="isOpen"
        class="assistant-widget__panel motif-border"
        rounded="xl"
      >
        <div class="assistant-widget__header">
          <div class="assistant-widget__identity">
            <AssistantAvatar alt="AI assistant avatar" size="md" />

            <div>
              <p class="assistant-widget__eyebrow">
                Local guide
              </p>

              <strong>AI assistant</strong>
            </div>
          </div>

          <v-btn icon="mdi-close" variant="text" @click="closeAssistant()" />
        </div>

        <div ref="messagesRef" class="assistant-widget__messages">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['assistant-widget__message', `assistant-widget__message--${message.role}`]"
          >
            <AssistantAvatar
              v-if="message.role === 'assistant'"
              alt="AI assistant avatar"
              size="sm"
            />

            <div class="assistant-widget__message-bubble">
              {{ message.text }}
            </div>
          </div>

          <AssistantTypingIndicator v-if="isReplying" />
        </div>

        <div class="d-flex flex-wrap ga-2 px-4 pb-3">
          <v-chip
            v-for="item in quickPrompts"
            :key="item"
            class="text-none"
            color="primary"
            :disabled="isReplying"
            size="small"
            variant="outlined"
            @click="submitPrompt(item)"
          >
            {{ item }}
          </v-chip>
        </div>

        <v-card-actions class="pa-4 pt-0">
          <v-text-field
            v-model="prompt"
            class="assistant-widget__input"
            density="comfortable"
            :disabled="isReplying"
            hide-details
            placeholder="Ask about projects, research, or the blog"
            variant="solo-filled"
            @keydown.enter.prevent="submitPrompt()"
          />

          <v-btn color="primary" :disabled="isReplying" icon="mdi-send" @click="submitPrompt()" />
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-btn
      class="assistant-widget__fab"
      color="primary"
      height="64"
      min-width="64"
      rounded="pill"
      size="x-large"
      width="64"
      @click="toggleAssistant()"
    >
      <AssistantAvatar alt="Open AI assistant" size="lg " />
    </v-btn>
  </div>
</template>

<style scoped>
  .assistant-widget {
    bottom: 24px;
    position: fixed;
    right: 24px;
    z-index: 30;
  }

  .assistant-widget__panel {
    backdrop-filter: blur(16px);
    background: var(--portfolio-chat-panel);
    border: 1px solid var(--portfolio-border-strong);
    margin-bottom: 16px;
    width: min(380px, calc(100vw - 32px));
    max-height: 540px;
  }

  .assistant-widget__header {
    align-items: center;
    border-bottom: 1px solid var(--portfolio-chat-divider);
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 12px;
  }

  .assistant-widget__identity {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .assistant-widget__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .assistant-widget__messages {
    display: grid;
    gap: 12px;
    max-height: 320px;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .assistant-widget__message {
    align-items: flex-end;
    display: flex;
    gap: 10px;
    max-width: 100%;
  }

  .assistant-widget__message-bubble {
    border-radius: 18px;
    line-height: 1.6;
    padding: 12px 14px;
  }

  .assistant-widget__message--assistant .assistant-widget__message-bubble {
    background: var(--portfolio-message-assistant);
    color: var(--portfolio-text);
  }

  .assistant-widget__message--user {
    justify-self: end;
    justify-content: flex-end;
  }

  .assistant-widget__message--user .assistant-widget__message-bubble {
    background: var(--portfolio-message-user);
    color: var(--portfolio-text-muted);
  }

  .assistant-widget__input :deep(.v-field) {
    border-radius: 999px;
  }

  .assistant-widget__fab {
    padding: 0;
    box-shadow: var(--portfolio-fab-shadow);
  }

  @media (max-width: 600px) {
    .assistant-widget {
      bottom: max(12px, env(safe-area-inset-bottom));
      left: 12px;
      right: 12px;
    }

    .assistant-widget__panel {
      margin-bottom: 12px;
      max-height: calc(100dvh - 104px - env(safe-area-inset-bottom));
      width: 100%;
    }

    .assistant-widget__header {
      padding: 16px 16px 10px;
    }

    .assistant-widget__messages {
      max-height: calc(100dvh - 330px);
      min-height: 160px;
      padding: 14px 16px;
    }

    .assistant-widget__message-bubble {
      font-size: 0.94rem;
      padding: 10px 12px;
    }

    .assistant-widget__fab {
      display: flex;
      margin-left: auto;
    }

    :deep(.v-card-actions) {
      align-items: stretch;
      padding: 12px !important;
    }
  }
</style>
