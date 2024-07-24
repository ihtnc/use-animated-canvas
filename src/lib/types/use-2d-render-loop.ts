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
  renderEnvironmentLayer?: RenderEnvironmentLayerValue,
  renderGridLayer?: RenderGridLayerValue,
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
  frame: number,
  fps: number,
  devicePixelRatio: number
}
export type DrawHandler = (context: CanvasRenderingContext2D, data: DrawData) => void
export type PreDrawHandler = (context: CanvasRenderingContext2D, data: DrawData) => void
export type PostDrawHandler = (context: CanvasRenderingContext2D, data: DrawData) => void
export type RenderGridLayerDrawHandler = (context: CanvasRenderingContext2D) => void

export type RenderGridLayerOptions = {
  size: Size | number,
  color?: string,
  opacity?: number,
  dashLength?: number
}
export type RenderGridLayerValue = boolean | string | number | Size | RenderGridLayerOptions | RenderGridLayerDrawHandler

export type RenderEnvironmentLayerValue = boolean | string | RenderLocation | Coordinates | RenderEnvironmentLayerOptions | RenderEnvironmentLayerDrawHandler
export type RenderEnvironmentLayerDrawHandler = (context: CanvasRenderingContext2D, data: RenderEnvironmentValue) => void