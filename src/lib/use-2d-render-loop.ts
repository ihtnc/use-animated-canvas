import { useRef, useEffect } from "react"
import {
  type Use2DRenderLoopOptions,
  type Use2DRenderLoopResponse,
  type FrameCounter,
  type RenderControlHandler,
  type RenderControlConditionalHandler,
  type LoopState,
  RenderControlType
} from "@/types/use-2d-render-loop"
import type {
  DrawData
} from "@/types"
import { getRenderEnvironmentLayerHandler, getRenderGridLayerHandler } from "@/utilities/layer-renderers"
import { cancelAnimationFrame, getDevicePixelRatio, requestAnimationFrame } from "@/utilities/client-operations"
import { DEFAULT_OPTIONS } from "@/defaults"
import { useDarkMode } from "usehooks-ts"

const use2DRenderLoop = ({
  autoStart = DEFAULT_OPTIONS.autoStart,
  onInit,
  onPreDraw,
  onDraw,
  onPostDraw,
  renderEnvironmentLayer = DEFAULT_OPTIONS.renderEnvironmentLayer,
  renderGridLayer = DEFAULT_OPTIONS.renderGridLayer,
  maxFrame = DEFAULT_OPTIONS.maxFrame
}: Use2DRenderLoopOptions): Use2DRenderLoopResponse => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDarkMode } = useDarkMode()

  const renderEnvironmentLayerHandler = getRenderEnvironmentLayerHandler(renderEnvironmentLayer)
  const renderGridLayerHandler = getRenderGridLayerHandler(renderGridLayer)

  const frameCounter = useRef<FrameCounter>({
    frameCount: 0,
    fps: 0,
    lastRender: performance.now()
  })

  const state = useRef<LoopState>({
    control: null,
    hasInitialised: false,
    isPaused: false
  })

  const renderReset: RenderControlHandler = () => {
    state.current.control = null
    state.current.hasInitialised = false
  }

  const renderBreak: RenderControlHandler = () => {
    state.current.control = RenderControlType.RenderBreak
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
    state.current.control = RenderControlType.RenderBreak
  }

  const renderStart: RenderControlHandler = () => {
    state.current.control = RenderControlType.Render
  }

  const renderStep: RenderControlHandler = () => {
    state.current.control = RenderControlType.RenderOneFrame
  }

  const resize = (width: number, height: number) => {
    const canvas = canvasRef.current
    if (canvas === null) { return }

    canvas.width = width
    canvas.height = height
  }

  const startLoop = () => {
    state.current.isPaused = false
  }

  const pauseLoop = () => {
    state.current.isPaused = true
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

    const isLoopPaused: () => boolean = () => {
      return state.current.isPaused
    }

    const needsNewFrame: () => boolean = () => {
      if (autoStart === true && state.current.control === null) { return true }
      if (autoStart === false && state.current.control === null) { return false }
      if (state.current.control === RenderControlType.RenderBreak) { return false }
      if (state.current.control === RenderControlType.RenderOneFrame) { state.current.control = RenderControlType.RenderBreak }

      return true
    }

    const updateFrameCounter: () => number = () => {
      const current = performance.now()
      const frameLength = current - frameCounter.current.lastRender
      const fps = Math.round(1000 / frameLength)

      frameCounter.current.fps = fps
      frameCounter.current.lastRender = current

      let frame = frameCounter.current.frameCount
      frame = (frame + 1 <= maxFrame!) ? frame + 1: 0
      frameCounter.current.frameCount = frame

      return fps
    }

    const render = () => {
      if (!context || isLoopPaused() || needsNewFrame() === false) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      if (state.current.hasInitialised === false && onInit) {
        onInit(canvas, { devicePixelRatio, isDarkMode })
      }

      state.current.hasInitialised = true

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
  })

  return {
    ref: canvasRef,
    utilities: {
      resize,
      pauseLoop,
      startLoop
    },
    control: {
      renderBreak,
      renderBreakWhen,
      renderStart,
      renderStep,
      renderReset
    }
  }
}

export default use2DRenderLoop