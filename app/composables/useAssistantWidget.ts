export function useAssistantWidget () {
  const isOpen = useState('assistant-widget-open', () => false)

  function openAssistant () {
    isOpen.value = true
  }

  function closeAssistant () {
    isOpen.value = false
  }

  function toggleAssistant () {
    isOpen.value = !isOpen.value
  }

  return {
    closeAssistant,
    isOpen,
    openAssistant,
    toggleAssistant,
  }
}
