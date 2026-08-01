import type { Mermaid, MermaidConfig } from 'mermaid'

const MERMAID_RENDER_TIMEOUT_MS = 12_000

let diagramSequence = 0
let mermaidPromise: Promise<Mermaid> | undefined
let renderQueue: Promise<void> = Promise.resolve()

function loadMermaid () {
  mermaidPromise ??= import('mermaid')
    .then(({ default: mermaid }) => mermaid)
    .catch((error) => {
      mermaidPromise = undefined
      throw error
    })

  return mermaidPromise
}

function withTimeout<T> (task: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Mermaid took too long to render this diagram.'))
    }, MERMAID_RENDER_TIMEOUT_MS)

    task.then(
      (result) => {
        window.clearTimeout(timeoutId)
        resolve(result)
      },
      (error) => {
        window.clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

export function renderMermaid (definition: string, config: MermaidConfig) {
  const renderTask = renderQueue.then(() => withTimeout((async () => {
    const mermaid = await loadMermaid()
    const diagramId = `portfolio-mermaid-${diagramSequence++}`

    mermaid.initialize(config)
    return mermaid.mermaidAPI.render(diagramId, definition)
  })()))

  renderQueue = renderTask.then(
    () => undefined,
    () => undefined,
  )

  return renderTask
}
