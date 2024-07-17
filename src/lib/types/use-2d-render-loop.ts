import type { RefObject } from "react"
import type {
  Coordinates,
  Size,
  UtilitiesObject,
  DebugObject,
  RenderLocation,
  RenderEnvironmentLayerOptions,
  RenderEnvironmentValue
} from "@/types"

export type Use2DRenderLoopOptions = {
  autoStart?: boolean,
  enableDebug?: boolean,
  onInit?: InitRenderHandler,
  onDraw?: DrawHandler,
  onPreDraw?: PreDrawHandler,
  onPostDraw?: PostDrawHandler,
  renderEnvironmentLayerRenderer?: RenderEnvironmentLayerRendererValue,
  renderGridLayerRenderer?: RenderGridLayerRendererValue,
  maxFrame?: number
}
export type Use2DRenderLoopResponse = {
  ref: RefObject<HTMLCanvasElement>,
  utilities: UtilitiesObject,
  debug: DebugObject
}

export type FrameCounter = { frameCount: number, fps: number, lastRender: number }

export type InitData = { devicePixelRatio: number }
export type InitRenderHandler = (canvas: HTMLCanvasElement, data: InitData) => void

export type DrawData = {
  context: CanvasRenderingContext2D,
  frame: number,
  fps: number,
  devicePixelRatio: number
}
export type DrawHandler = (data: DrawData) => void
export type PreDrawHandler = (canvas: HTMLCanvasElement, data: DrawData) => void
export type PostDrawHandler = (canvas: HTMLCanvasElement, data: DrawData) => void
export type RenderGridLayerDrawHandler = (context: CanvasRenderingContext2D) => void

export type RenderGridLayerOptions = {
  size: Size | number,
  color?: string,
  opacity?: number,
  dashLength?: number
}
export type RenderGridLayerRendererValue = boolean | string | number | Size | RenderGridLayerOptions | RenderGridLayerDrawHandler

export type RenderEnvironmentLayerRendererValue = boolean | string | RenderLocation | Coordinates | RenderEnvironmentLayerOptions | RenderEnvironmentLayerDrawHandler
export type RenderEnvironmentLayerDrawHandler = (value: RenderEnvironmentValue, context: CanvasRenderingContext2D) => void