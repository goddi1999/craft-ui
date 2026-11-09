const SVG_NS = 'http://www.w3.org/2000/svg'

const shuffle = <T,>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const split = <T,>(arr: T[], chunks: number): T[][] => {
  const chunkSize = Math.ceil(arr.length / chunks)
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

const svgToUrl = (svg: SVGSVGElement) => {
  const svgString = new XMLSerializer().serializeToString(svg)
  const encodedSvg = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

export type GeneratedSprite = {
  svg: SVGSVGElement
  dataURL: string
  frameCount: number
}

/** Build a stepped pixel-mask SVG sprite for CSS `mask-image` animation. */
export function generateSprite(
  prefix: string,
  cells: number,
  frames: number,
): GeneratedSprite {
  const indices = split(
    shuffle(Array.from({ length: cells ** 2 }, (_, i) => i)),
    frames,
  )

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('xmlns', SVG_NS)
  svg.setAttribute(
    'viewBox',
    `0 0 ${cells * 10 * (indices.length + 1)} ${cells * 10}`,
  )
  svg.setAttribute('class', 'sprite')

  const defs = document.createElementNS(SVG_NS, 'defs')

  for (let f = 0; f < indices.length; f++) {
    const positions = indices[f]
    let d = ''
    for (let p = 0; p < positions.length; p++) {
      const x = positions[p] % cells
      const y = Math.floor(positions[p] / cells)
      d += `M${x * 10} ${y * 10} h10 v10 h-10 z `
    }

    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', 'currentColor')
    path.setAttribute('stroke', 'currentColor')
    path.setAttribute('shape-rendering', 'crispEdges')
    path.setAttribute('stroke-width', '0.025')
    path.setAttribute('id', `${prefix}-${f}`)
    defs.appendChild(path)

    const group = document.createElementNS(SVG_NS, 'g')
    for (let u = 0; u < f + 1; u++) {
      const use = document.createElementNS(SVG_NS, 'use')
      use.setAttribute('href', `#${prefix}-${u}`)
      use.setAttribute('x', String((f + 1) * (cells * 10)))
      group.appendChild(use)
    }
    svg.appendChild(group)
  }

  svg.appendChild(defs)

  return {
    svg,
    dataURL: svgToUrl(svg),
    frameCount: indices.length,
  }
}
