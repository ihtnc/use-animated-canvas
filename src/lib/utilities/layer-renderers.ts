import { deepCopy } from "@/utilities/misc-operations"
import type {
  RenderEnvironmentLayerOptions,
  Coordinates,
  Size,
  DrawData
} from "@/types"
import {
  RenderLocation
} from "@/types"
import type {
  RenderEnvironmentLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler
} from "@/types/use-2d-render-loop"
import { getTextSize } from "@/utilities/2d-drawing-operations"
import { DEFAULT_RENDER_ENVIRONMENT_LAYER_OPTIONS, DEFAULT_RENDER_GRID_LAYER_OPTIONS } from "@/defaults"

export const getRenderEnvironmentLayerHandler: (value?: RenderEnvironmentLayerValue) => RenderEnvironmentLayerDrawHandler | null = (value) => {
  let options: RenderEnvironmentLayerOptions
  options = deepCopy(DEFAULT_RENDER_ENVIRONMENT_LAYER_OPTIONS)

  if (value === undefined || value === false) {
    return null
  }

  if (typeof(value) === "number") {
    options.location = value as RenderLocation
  }

  if (typeof(value) === "string") {
    options.color = value as string
  }

  const { x, y } = value as Coordinates
  if (x !== undefined && y !== undefined) {
    options.location = { x, y }
  }

  if (typeof(value) === "object") {
    const {
      location,
      color,
      opacity,
      renderFps,
      renderSize,
      renderClientSize,
      renderPixelRatio,
      renderFrameNumber
    } = value as RenderEnvironmentLayerOptions

    if (location !== undefined) { options.location = location }
    if (color !== undefined) { options.color = color }
    if (opacity !== undefined) { options.opacity = opacity }
    if (renderFps !== undefined) { options.renderFps = renderFps }
    if (renderSize !== undefined) { options.renderSize = renderSize }
    if (renderClientSize !== undefined) { options.renderClientSize = renderClientSize }
    if (renderPixelRatio !== undefined) { options.renderPixelRatio = renderPixelRatio }
    if (renderFrameNumber !== undefined) { options.renderFrameNumber = renderFrameNumber }
  }

  let renderer: RenderEnvironmentLayerDrawHandler
  if(typeof value === "function") {
    renderer = value
    return renderer
  }

  const getCoordinates: (value: string, debugValue: DrawData, context: CanvasRenderingContext2D) => Coordinates = (value, debugValue, context) => {
    let { x, y } = options.location as Coordinates
    if (x !== undefined && y !== undefined
      && x >= 0 && x <= debugValue.width
      && y >= 0 && y <= debugValue.height) {
      return {x, y}
    }

    const { width, height } = getTextSize(context, value)
    const offSet = 10
    const leftX = 0 + offSet
    const topY = 0 + offSet + offSet
    const midX = (debugValue.width / 2) - (width / 2)
    const midY = (debugValue.height / 2) - (height / 2)
    const rightX = debugValue.width - width - offSet
    const bottomY = debugValue.height - height
    switch(options.location) {
      case RenderLocation.TopCenter:
        x = midX
        y = topY
        break
      case RenderLocation.TopRight:
        x = rightX
        y = topY
        break
      case RenderLocation.MiddleLeft:
        x = leftX
        y = midY
        break
      case RenderLocation.Center:
        x = midX
        y = midY
        break
      case RenderLocation.MiddleRight:
        x = rightX
        y = midY
        break
      case RenderLocation.BottomLeft:
        x = leftX
        y = bottomY
        break
      case RenderLocation.BottomCenter:
        x = midX
        y = bottomY
        break
      case RenderLocation.BottomRight:
        x = rightX
        y = bottomY
        break
      case RenderLocation.TopLeft:
      default:
        x = leftX
        y = topY
        break
    }
    return { x, y }
  }

  renderer = (context, data) => {
    const fpsText = options.renderFps ? `fps: ${data.fps}; ` : ''
    const sizeText = options.renderSize ? `size: ${data.width}x${data.height}; ` : ''
    const clientText = options.renderClientSize ? `client: ${data.clientWidth}x${data.clientHeight}; ` : ''
    const ratioText = options.renderPixelRatio ? `ratio: ${data.pixelRatio}; ` : ''
    const frameText = options.renderFrameNumber ? `frame: ${data.frame};` : ''
    const debugText = `${fpsText}${sizeText}${clientText}${ratioText}${frameText}`.trim()
    const { x, y } = getCoordinates(debugText, data, context)
    context.fillStyle = options.color!
    context.globalAlpha = options.opacity!
    context.fillText(debugText, x, y)
  }

  return renderer
}

export const getRenderGridLayerHandler: (value?: RenderGridLayerValue) => RenderGridLayerDrawHandler | null = (value) => {
  let options: RenderGridLayerOptions
  options = deepCopy(DEFAULT_RENDER_GRID_LAYER_OPTIONS)

  if (value === undefined || value === false) {
    return null
  }

  if (typeof(value) === "string") {
    options.color = value as string
  }

  if (typeof(value) === "number") {
    options.size = { width: value, height: value }
  }

  const { width, height } = value as Size
  if (width !== undefined && height !== undefined) {
    options.size = { width, height }
  }

  if (typeof(value) === "object") {
    const {
      size,
      color,
      opacity,
      dashLength
    } = value as RenderGridLayerOptions

    if (size !== undefined) { options.size = size }
    if (color !== undefined) { options.color = color }
    if (opacity !== undefined) { options.opacity = opacity }
    if (dashLength !== undefined) { options.dashLength = dashLength }
  }

  let renderer: RenderGridLayerDrawHandler
  if(typeof value === "function") {
    renderer = value
    return renderer
  }

  renderer = (context) => {
    context.strokeStyle = options.color!
    context.globalAlpha = options.opacity!
    if ((options.dashLength ?? 0) > 0) { context.setLineDash([options.dashLength!]) }

    const { width, height } = context.canvas

    let size: Size
    if(typeof options.size === "number") {
      size = { width: options.size, height: options.size }
    } else {
      size = options.size
    }

    let { width: gridWidth, height: gridHeight } = size
    if (gridWidth <= 0 || gridWidth > width) { gridWidth = DEFAULT_RENDER_GRID_LAYER_OPTIONS.size as number }
    if (gridHeight <= 0 || gridHeight > height) { gridHeight = DEFAULT_RENDER_GRID_LAYER_OPTIONS.size as number }

    let currentGrid = gridWidth
    while(currentGrid < width) {
      context.beginPath()
      context.moveTo(currentGrid, 0)
      context.lineTo(currentGrid, height)
      context.stroke()
      currentGrid += gridWidth
    }

    currentGrid = gridHeight
    while(currentGrid < height) {
      context.beginPath()
      context.moveTo(0, currentGrid)
      context.lineTo(width, currentGrid)
      context.stroke()
      currentGrid += gridHeight
    }
  }

  return renderer
}
