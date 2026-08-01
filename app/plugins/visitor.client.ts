export default defineNuxtPlugin(() => {
  const visitorStore = useVisitorStore()

  visitorStore.initializeVisitor()
})
