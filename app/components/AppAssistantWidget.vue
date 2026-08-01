<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  interface ChatMessage {
    id: number
    role: 'assistant' | 'user'
    text: string
  }

  interface AssistantReply {
    text: string
    action?: () => Promise<void>
  }

  interface AssistantShortcut {
    id: 'cv' | 'contact' | 'beer'
    label: string
    helper: string
    icon: string
    href: string
    download?: string
    external?: boolean
  }

  const { closeAssistant, isOpen, toggleAssistant } = useAssistantWidget()
  const prompt = ref('')
  const isReplying = ref(false)
  const isFinePointer = ref(false)
  const shortcutsOpen = ref(false)
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

  const assistantShortcuts: AssistantShortcut[] = [
    {
      id: 'cv',
      label: 'Download CV',
      helper: 'Download Ignacio Castillo’s CV',
      icon: 'mdi-file-download-outline',
      href: '/ICB_CV.pdf',
      download: 'Ignacio-Castillo-CV.pdf',
    },
    {
      id: 'contact',
      label: 'Contact',
      helper: 'Go to the contact form',
      icon: 'mdi-email-outline',
      href: '/#contact',
    },
    {
      id: 'beer',
      label: 'Buy me a beer',
      helper: 'Enjoyed a post? Buy me a beer.',
      icon: 'mdi-beer-outline',
      href: 'https://ko-fi.com/ignaciocastillo6x',
      external: true,
    },
  ]

  const fabLabel = computed(() => {
    if (isOpen.value) {
      return 'Close AI assistant'
    }

    if (shortcutsOpen.value) {
      return 'Open AI assistant'
    }

    return isFinePointer.value ? 'Open AI assistant' : 'Show quick actions'
  })

  let replyTimer: ReturnType<typeof setTimeout> | null = null
  let pointerQuery: MediaQueryList | null = null

  function closeShortcuts () {
    shortcutsOpen.value = false
  }

  function openShortcuts () {
    if (!isOpen.value) {
      shortcutsOpen.value = true
    }
  }

  function updatePointerMode () {
    isFinePointer.value = pointerQuery?.matches ?? false

    if (isFinePointer.value) {
      closeShortcuts()
    }
  }

  function handleFabFocus () {
    if (isFinePointer.value) {
      openShortcuts()
    }
  }

  function handleFabPointerEnter () {
    if (isFinePointer.value) {
      openShortcuts()
    }
  }

  function handleFabClick (event: MouseEvent) {
    if (isOpen.value) {
      closeShortcuts()
      toggleAssistant()
      return
    }

    const pointerType = 'pointerType' in event ? event.pointerType : ''
    const usesTouchInteraction = pointerType === 'touch'
      || pointerType === 'pen'
      || (!pointerType && !isFinePointer.value)

    if (usesTouchInteraction && !shortcutsOpen.value) {
      shortcutsOpen.value = true
      return
    }

    closeShortcuts()
    toggleAssistant()
  }

  async function handleShortcutClick (shortcut: AssistantShortcut, event: MouseEvent) {
    closeShortcuts()

    if (shortcut.id === 'contact') {
      event.preventDefault()
      await scrollToSection('contact')
    }
  }

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

  watch(isOpen, (value) => {
    if (value) {
      closeShortcuts()
    }
  })

  onMounted(() => {
    pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    updatePointerMode()
    pointerQuery.addEventListener('change', updatePointerMode)
  })

  onBeforeUnmount(() => {
    if (replyTimer) {
      window.clearTimeout(replyTimer)
    }

    pointerQuery?.removeEventListener('change', updatePointerMode)
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

          <v-btn aria-label="Close AI assistant" icon="mdi-close" variant="text" @click="closeAssistant()" />
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

        <div class="assistant-widget__prompts d-flex flex-wrap ga-2 px-4 pb-3">
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

        <v-card-actions class="assistant-widget__actions pa-4 pt-0">
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

    <div class="assistant-widget__controls">
      <v-speed-dial
        v-model="shortcutsOpen"
        :close-on-content-click="true"
        content-class="assistant-widget__speed-dial-content"
        location="top center"
        :open-on-click="false"
        :open-on-focus="false"
        :open-on-hover="false"
        transition="scale-transition"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            :aria-label="fabLabel"
            class="assistant-widget__fab"
            color="primary"
            height="64"
            min-width="64"
            rounded="pill"
            size="x-large"
            width="64"
            @click="handleFabClick"
            @focus="handleFabFocus"
            @pointerenter="handleFabPointerEnter"
          >
            <AssistantAvatar :alt="fabLabel" size="lg" />
          </v-btn>
        </template>

        <a
          v-for="shortcut in assistantShortcuts"
          :key="shortcut.id"
          :aria-label="shortcut.helper"
          class="assistant-widget__shortcut"
          :download="shortcut.download"
          :href="shortcut.href"
          :rel="shortcut.external ? 'noopener noreferrer' : undefined"
          :target="shortcut.external ? '_blank' : undefined"
          :title="shortcut.helper"
          @click="handleShortcutClick(shortcut, $event)"
        >
          <span class="assistant-widget__shortcut-label">
            {{ shortcut.label }}
          </span>

          <span aria-hidden="true" class="assistant-widget__shortcut-icon">
            <v-icon :icon="shortcut.icon" size="20" />
          </span>
        </a>
      </v-speed-dial>
    </div>
  </div>
</template>

<style scoped>
  .assistant-widget {
    bottom: 24px;
    position: fixed;
    right: 24px;
    z-index: 9999;
  }

  .assistant-widget__panel {
    backdrop-filter: blur(16px);
    background: var(--portfolio-chat-panel);
    border: 1px solid var(--portfolio-border-strong);
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    max-height: 540px;
    overflow: hidden;
    width: min(380px, calc(100vw - 32px));

  }

  .assistant-widget__panel::before {
    background: linear-gradient(180deg, var(--portfolio-accent-soft), transparent);
    pointer-events: none;
  }

  .assistant-widget__header {
    align-items: center;
    border-bottom: 1px solid var(--portfolio-chat-divider);
    /* background:red; */
    display: flex;
    flex-shrink: 0;
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
    flex: 1 1 auto;
    gap: 12px;
    max-height: 320px;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .assistant-widget__prompts,
  .assistant-widget__actions {
    flex-shrink: 0;
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

  .assistant-widget__controls {
    margin-left: auto;
    position: relative;
    width: 64px;
  }

  .assistant-widget__fab {
    box-shadow: var(--portfolio-fab-shadow);
    padding: 0;
    position: relative;
    transition:
      filter 180ms ease,
      transform 180ms ease;
    z-index: 2;
  }

  .assistant-widget__fab:hover,
  .assistant-widget__fab:focus-visible {
    filter: brightness(1.08);
    transform: translateY(-2px) scale(1.04);
  }

  .assistant-widget__shortcut {
    align-items: center;
    color: var(--portfolio-text);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    outline: none;
    text-decoration: none;
  }

  .assistant-widget__shortcut-label {
    backdrop-filter: blur(12px);
    background: var(--portfolio-chat-panel);
    border: 1px solid var(--portfolio-border-strong);
    border-radius: 999px;
    box-shadow: var(--portfolio-fab-shadow);
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1;
    padding: 9px 12px;
    transition:
      border-color 160ms ease,
      color 160ms ease,
      filter 160ms ease;
  }

  .assistant-widget__shortcut-icon {
    align-items: center;
    background: rgb(var(--v-theme-primary));
    border-radius: 50%;
    box-shadow: var(--portfolio-fab-shadow);
    color: rgb(var(--v-theme-on-primary));
    display: inline-flex;
    flex: 0 0 42px;
    height: 42px;
    justify-content: center;
    transition:
      filter 160ms ease,
      transform 160ms ease;
    width: 42px;
  }

  .assistant-widget__shortcut:hover .assistant-widget__shortcut-icon,
  .assistant-widget__shortcut:focus-visible .assistant-widget__shortcut-icon {
    filter: brightness(1.08);
    transform: translateY(-1px) scale(1.02);
  }

  .assistant-widget__shortcut:hover .assistant-widget__shortcut-label,
  .assistant-widget__shortcut:focus-visible .assistant-widget__shortcut-label {
    border-color: var(--portfolio-accent);
    color: var(--portfolio-accent);
    filter: brightness(1.08);
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
      padding: 14px 16px;
    }

    .assistant-widget__message-bubble {
      font-size: 0.94rem;
      padding: 10px 12px;
    }

    :deep(.v-card-actions) {
      align-items: stretch;
      padding: 12px !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .assistant-widget__fab,
    .assistant-widget__shortcut-icon,
    .assistant-widget__shortcut-label {
      transition: none;
    }

    .assistant-widget__fab:hover,
    .assistant-widget__fab:focus-visible,
    .assistant-widget__shortcut:hover .assistant-widget__shortcut-icon,
    .assistant-widget__shortcut:focus-visible .assistant-widget__shortcut-icon {
      transform: none;
    }
  }
</style>
