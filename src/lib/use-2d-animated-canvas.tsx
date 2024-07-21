import use2DRenderLoop from "@/use-2d-render-loop"
import type {
  AnimatedCanvasTransformData,
  AnimatedCanvasRenderData,
  Use2dAnimatedCanvasProps,
  Use2dAnimatedCanvasResponse,
} from "@/types/use-2d-animated-canvas"
import type {
  DrawHandler,
  InitRenderHandler,
  PostDrawHandler,
  PreDrawHandler
} from "@/types/use-2d-render-loop"
import type {
  UseAnimatedCanvasOptions,
  AnimatedCanvasProps
} from "@/types"
import {
  type JSXElementConstructor,
  useRef
} from "react"
import { useDebounceCallback, useResizeObserver, useEventListener } from "usehooks-ts"
import { deepCopy, transformPipeline } from "@/utilities/misc-operations"
import { renderPipeline } from "./utilities/2d-drawing-operations"

const DEFAULT_OPTIONS: UseAnimatedCanvasOptions = {
  autoStart: true,
  enableDebug: false,
  resizeDelayMs: 200
}

type InferPropsType<C extends Use2dAnimatedCanvasProps<any>> = C extends Use2dAnimatedCanvasProps<infer T> ? T : unknown;

const use2dAnimatedCanvas: <T extends string | number | boolean | object | undefined>(props: Use2dAnimatedCanvasProps<T>, initialData?: T) => Use2dAnimatedCanvasResponse = (props, initialData) => {
  const {
    initialiseData,
    preRenderTransform,
    renderBackgroundFilter,
    renderBackground,
    renderFilter,
    render,
    renderForegroundFilter,
    renderForeground,
    postRenderTransform,
    onResize,
    options,
    renderEnvironmentLayerRenderer,
    renderGridLayerRenderer
  } = props

  const canvasOptions = Object.assign({}, DEFAULT_OPTIONS, options)
  const { autoStart, enableDebug, resizeDelayMs } = canvasOptions

  const dataRef = useRef<InferPropsType<typeof props> | null>(initialData ?? null)
  const divRef = useRef<HTMLDivElement>(null)

  const initHandler: InitRenderHandler = (canvas, data) => {
    if (initialiseData === undefined) { return }
    dataRef.current = initialiseData(canvas, data)
  }

  let currentFrameData: InferPropsType<typeof props> | null = null

  const preDrawHandler: PreDrawHandler = (context, data) => {
    currentFrameData = dataRef.current !== null ? deepCopy(dataRef.current) : null

    if (preRenderTransform === undefined) { return }

    const canvasData: AnimatedCanvasTransformData<InferPropsType<typeof props>> = {
      context,
      drawData: data,
      data: currentFrameData ?? undefined
    }

    const transforms = Array.isArray(preRenderTransform) ? preRenderTransform : [preRenderTransform]
    const { data: transformed } = transformPipeline(transforms).run(canvasData)
    if (transformed !== undefined) {
      currentFrameData = transformed
    }
  }

  const drawHandler: DrawHandler = (context, data) => {
    const renderData: AnimatedCanvasRenderData<InferPropsType<typeof props>> = {
      drawData: data,
      data: currentFrameData ?? undefined
    }

    const backgroundFilters = renderBackgroundFilter !== undefined ? (Array.isArray(renderBackgroundFilter) ? renderBackgroundFilter : [renderBackgroundFilter]) : []
    const background = renderBackground !== undefined ? (Array.isArray(renderBackground) ? renderBackground : [renderBackground]) : []
    renderPipeline(background).run(context, renderData, backgroundFilters)

    const mainFilters = renderFilter !== undefined ? (Array.isArray(renderFilter) ? renderFilter : [renderFilter]) : []
    const main = render !== undefined ? (Array.isArray(render) ? render : [render]) : []
    renderPipeline(main).run(context, renderData, mainFilters)

    const foregroundFilters = renderForegroundFilter !== undefined ? (Array.isArray(renderForegroundFilter) ? renderForegroundFilter : [renderForegroundFilter]) : []
    const foreground = renderForeground !== undefined ? (Array.isArray(renderForeground) ? renderForeground : [renderForeground]) : []
    renderPipeline(foreground).run(context, renderData, foregroundFilters)
  }

  const postDrawHandler: PostDrawHandler = (context, data) => {
    if (postRenderTransform === undefined) { return }

    const canvasData: AnimatedCanvasTransformData<InferPropsType<typeof props>> = {
      context,
      drawData: data,
      data: currentFrameData !== null ? deepCopy(currentFrameData) : undefined
    }

    const transforms = Array.isArray(postRenderTransform) ? postRenderTransform : [postRenderTransform]
    const { data: transformed } = transformPipeline(transforms).run(canvasData)
    if (transformed !== undefined) {
      currentFrameData = transformed
    }

    dataRef.current = currentFrameData
  }

  const { ref, utilities, debug } = use2DRenderLoop({
    autoStart,
    enableDebug,
    onInit: initHandler,
    onPreDraw: preDrawHandler,
    onDraw: drawHandler,
    onPostDraw: postDrawHandler,
    renderEnvironmentLayerRenderer,
    renderGridLayerRenderer
  })

  const resizeCallback: (size: { width?: number, height?: number }) => void = (size) => {
    const { width, height } = size
    const { resize } = utilities

    if (ref.current && width && height) {
      if (onResize) {
        onResize(ref.current, width, height)
      }

      resize(width, height)
    }
  }
  const debouncedOnResize = useDebounceCallback(resizeCallback, resizeDelayMs)
  useResizeObserver({ ref: divRef, onResize: debouncedOnResize })

  const CanvasElement: JSXElementConstructor<AnimatedCanvasProps> = ({ className, onKeyDown, onKeyUp, ...rest }) => {
    const onKeyDownHandler = onKeyDown ?? (() => {})
    const onKeyUpHandler = onKeyUp ?? (() => {})
    useEventListener("keydown", onKeyDownHandler, divRef)
    useEventListener("keyup", onKeyUpHandler, divRef)

    return (
      <div ref={divRef} tabIndex={0}
        className={className}>
        <canvas
          ref={ref}
          style={{ flexGrow: 1 }}
          {...rest}
        />
      </div>
    )
  }

  return {
    Canvas: CanvasElement,
    debug
  }
}

export default use2dAnimatedCanvas