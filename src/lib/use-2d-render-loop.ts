import { useRef, useEffect } from "react"
import type {
  Use2DRenderLoopOptions,
  Use2DRenderLoopResponse,
  FrameCounter,
  RenderControlHandler,
  RenderControlConditionalHandler
} from "@/types/use-2d-render-loop"
import type {
  DrawData
} from "@/types"
import { getRenderEnvironmentLayerHandler, getRenderGridLayerHandler } from "@/utilities/layer-renderers"
import { cancelAnimationFrame, getDevicePixelRatio, requestAnimationFrame } from "@/utilities/client-operations"
import { DEFAULT_OPTIONS } from "@/defaults"
import { useDarkMode } from "usehooks-ts"

const use2DRenderLoop = (options: Use2DRenderLoopOptions): Use2DRenderLoopResponse => {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDarkMode } = useDarkMode()
  const { onInit, onPreDraw, onDraw, onPostDraw, renderEnvironmentLayer, renderGridLayer } = options
  const renderEnvironmentLayerHandler = getRenderEnvironmentLayerHandler(renderEnvironmentLayer)
  const renderGridLayerHandler = getRenderGridLayerHandler(renderGridLayer)

  const frameCounter = useRef<FrameCounter>({
    frameCount: 0,
    fps: 0,
    lastRender: performance.now()
  })

  const updateFrameCounter: () => number = () => {
    const current = performance.now()
    const frameLength = current - frameCounter.current.lastRender
    const fps = Math.round(1000 / frameLength)

    frameCounter.current.fps = fps
    frameCounter.current.lastRender = current

    let frame = frameCounter.current.frameCount
    frame = (frame + 1 <= options.maxFrame!) ? frame + 1: 0
    frameCounter.current.frameCount = frame

    return fps
  }

  let request: boolean | null = null
  let requestOnce: boolean | null = null

  const renderBreak: RenderControlHandler = () => {
    request = false
    requestOnce = false
  }

  const renderBreakWhen: RenderControlConditionalHandler<DrawData> = (condition) => {
    const canvas = canvasRef.current
    if (canvas === null) { return }

    const renderData: DrawData = {
      frame: frameCounter.current.frameCount,
      fps: frameCounter.current.fps,
      clientHeight: canvas.clientHeight,
      clientWidth: canvas.clientWidth,
      height: canvas.height,
      width: canvas.width,
      pixelRatio: devicePixelRatio,
      isDarkMode
    }

    if (condition(renderData) !== true) { return }
    request = false
    requestOnce = false
  }

  const renderContinue: RenderControlHandler = () => {
    request = true
    requestOnce = false
  }

  const renderStep: RenderControlHandler = () => {
    requestOnce = true
    request = false
  }

  const resize = (width: number, height: number) => {
    const canvas = canvasRef.current
    if (canvas === null) { return }

    canvas.width = width
    canvas.height = height
  }

  const clearFrame = () => {
    const canvas = canvasRef.current
    if (canvas === null) { return }

    const { width, height } = canvas
    const context = canvas.getContext('2d')
    context?.beginPath()
    context?.resetTransform()
    context?.clearRect(0, 0, width, height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) { return }

    canvas.style.touchAction = "none"

    const context = canvas.getContext('2d')
    const devicePixelRatio = getDevicePixelRatio()
    let animationFrameId: number

    if (onInit) { onInit(canvas, { devicePixelRatio, isDarkMode }) }

    const needsNewFrame: () => boolean = () => {
      if (options.autoStart === true && request === null && requestOnce === null) { return true }
      if (options.autoStart === false && request === null && requestOnce === null) { return false }
      if (request === false && requestOnce === false) { return false }

      // requestOnce is used to step through the render loop and is manually set
      //   so there's no need to preserve the value after each render
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (requestOnce) { requestOnce = false }

      return true
    }

    const render = () => {
      if (!context || needsNewFrame() === false) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      clearFrame()

      const renderData: DrawData = {
        frame: frameCounter.current.frameCount,
        fps: frameCounter.current.fps,
        clientHeight: canvas.clientHeight,
        clientWidth: canvas.clientWidth,
        height: canvas.height,
        width: canvas.width,
        pixelRatio: devicePixelRatio,
        isDarkMode
      }

      if (onPreDraw) { onPreDraw(context, renderData) }
      if (onDraw) { onDraw(context, renderData) }
      if (onPostDraw) { onPostDraw(context, renderData) }

      if (renderGridLayerHandler) {
        context.save()
        renderGridLayerHandler(context)
        context.restore()
      }

      if (renderEnvironmentLayerHandler) {
        context.save()
        renderEnvironmentLayerHandler(context, renderData)
        context.restore()
      }

      updateFrameCounter()
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [options])

  return {
    ref: canvasRef,
    utilities: {
      resize
    },
    control: {
      renderBreak, renderBreakWhen, renderContinue, renderStep
    }
  }
}

export default use2DRenderLoop