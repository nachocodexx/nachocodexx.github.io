<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue'

  interface NodePoint {
    x: number
    y: number
    vx: number
    vy: number
  }

  const containerRef = ref<HTMLElement | null>(null)
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const pointer = {
    active: false,
    x: -9999,
    y: -9999,
  }

  let animationFrame = 0
  let drawingContext: CanvasRenderingContext2D | null = null
  let nodes: NodePoint[] = []
  let width = 0
  let height = 0
  let reducedMotion = false
  let nodeFillColor = 'rgba(77, 163, 255, 0.95)'
  let nodeLineColor = 'rgba(115, 182, 255, 0.28)'
  let nodeLineColorRgb = '115, 182, 255'
  let nodeHighlightColor = '170, 212, 255'

  const { activeTheme } = usePortfolioThemeState()

  function createNodes () {
    const area = width * height
    const count = Math.min(44, Math.max(18, Math.round(area / 24_000)))

    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }))
  }

  function resizeCanvas () {
    const canvas = canvasRef.value
    const container = containerRef.value

    if (!canvas || !container) {
      return
    }

    width = container.clientWidth
    height = container.clientHeight

    const scale = window.devicePixelRatio || 1

    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    drawingContext = canvas.getContext('2d')
    drawingContext?.setTransform(scale, 0, 0, scale, 0, 0)

    createNodes()
  }

  function draw () {
    if (!drawingContext || !width || !height) {
      return
    }

    drawingContext.clearRect(0, 0, width, height)

    drawingContext.fillStyle = nodeFillColor
    drawingContext.strokeStyle = nodeLineColor
    drawingContext.lineWidth = 1

    for (const node of nodes) {
      if (!reducedMotion) {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) {
          node.vx *= -1
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1
        }
      }

      drawingContext?.beginPath()
      drawingContext?.rect(node.x - 1.5, node.y - 1.5, 3, 3)
      drawingContext?.fill()
    }

    for (let index = 0; index < nodes.length; index += 1) {
      const firstNode = nodes[index]

      for (let neighborIndex = index + 1; neighborIndex < nodes.length; neighborIndex += 1) {
        const secondNode = nodes[neighborIndex]
        const distanceX = secondNode.x - firstNode.x
        const distanceY = secondNode.y - firstNode.y
        const distance = Math.hypot(distanceX, distanceY)

        if (distance > 112) {
          continue
        }

        const midpointX = (firstNode.x + secondNode.x) / 2
        const midpointY = (firstNode.y + secondNode.y) / 2
        const pointerDistance = Math.hypot(pointer.x - midpointX, pointer.y - midpointY)

        if (pointer.active && pointerDistance > 180 && distance > 70) {
          continue
        }

        const alpha = Math.max(0.08, 1 - distance / 112) * (pointer.active ? 0.9 : 0.45)

        drawingContext.strokeStyle = `rgba(${nodeLineColorRgb}, ${alpha.toFixed(3)})`
        drawingContext.beginPath()
        drawingContext.moveTo(firstNode.x, firstNode.y)
        drawingContext.lineTo(secondNode.x, secondNode.y)
        drawingContext.stroke()
      }

      if (!pointer.active) {
        continue
      }

      const pointerDistance = Math.hypot(pointer.x - firstNode.x, pointer.y - firstNode.y)

      if (pointerDistance > 130) {
        continue
      }

      const alpha = Math.max(0.18, 1 - pointerDistance / 130)

      drawingContext.strokeStyle = `rgba(${nodeHighlightColor}, ${alpha.toFixed(3)})`
      drawingContext.beginPath()
      drawingContext.moveTo(firstNode.x, firstNode.y)
      drawingContext.lineTo(pointer.x, pointer.y)
      drawingContext.stroke()
    }

    animationFrame = window.requestAnimationFrame(draw)
  }

  function syncPalette () {
    const cssVars = activeTheme.value.cssVars

    nodeFillColor = `rgba(${cssVars['--portfolio-node-fill-rgb']}, 0.95)`
    nodeLineColorRgb = cssVars['--portfolio-node-line-rgb']
    nodeLineColor = `rgba(${cssVars['--portfolio-node-line-rgb']}, 0.28)`
    nodeHighlightColor = cssVars['--portfolio-node-highlight-rgb']
  }

  function handlePointerMove (event: PointerEvent) {
    const bounds = containerRef.value?.getBoundingClientRect()

    if (!bounds) {
      return
    }

    pointer.active = true
    pointer.x = event.clientX - bounds.left
    pointer.y = event.clientY - bounds.top
  }

  function handlePointerLeave () {
    pointer.active = false
    pointer.x = -9999
    pointer.y = -9999
  }

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    resizeCanvas()
    draw()

    window.addEventListener('resize', resizeCanvas)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    window.cancelAnimationFrame(animationFrame)
  })

  watch(activeTheme, syncPalette, { immediate: true })
</script>

<template>
  <div
    ref="containerRef"
    class="interactive-constellation"
    @pointerleave="handlePointerLeave"
    @pointermove="handlePointerMove"
  >
    <canvas ref="canvasRef" aria-hidden="true" />
  </div>
</template>

<style scoped>
  .interactive-constellation {
    inset: 0;
    position: absolute;
  }

  canvas {
    display: block;
    height: 100%;
    width: 100%;
  }
</style>
