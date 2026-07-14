<template>
  <div class="assistant-typing">
    <AssistantAvatar alt="AI assistant typing" size="sm" />

    <div class="assistant-typing__bubble">
      <span />
      <span />
      <span />
    </div>
  </div>
</template>

<style scoped>
  .assistant-typing {
    align-items: flex-end;
    display: flex;
    gap: 10px;
  }

  .assistant-typing__bubble {
    align-items: center;
    background: var(--portfolio-message-assistant);
    border-radius: 18px;
    display: inline-flex;
    gap: 6px;
    min-height: 44px;
    padding: 0 14px;
  }

  .assistant-typing__bubble span {
    animation: assistant-typing 1.2s ease-in-out infinite;
    background: var(--portfolio-accent);
    border-radius: 999px;
    display: inline-flex;
    height: 7px;
    opacity: 0.32;
    width: 7px;
  }

  .assistant-typing__bubble span:nth-child(2) {
    animation-delay: 0.16s;
  }

  .assistant-typing__bubble span:nth-child(3) {
    animation-delay: 0.32s;
  }

  @keyframes assistant-typing {
    0%,
    80%,
    100% {
      opacity: 0.28;
      transform: translateY(0);
    }

    40% {
      opacity: 1;
      transform: translateY(-3px);
    }
  }
</style>
