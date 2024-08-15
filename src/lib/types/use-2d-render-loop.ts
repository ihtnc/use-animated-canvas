import type { RefObject } from "react"
import type {
  Coordinates,
  Size,
  UtilitiesObject,
  RenderLocation,
  RenderEnvironmentLayerOptions,
  DrawData
} from "@/types"
import { type ConditionalFunction } from "@/utilities/misc-operations"

export type Use2DRenderLoopOptions = {
  autoStart?: boolean,
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
  control: RenderControlObject
}

export type FrameCounter = { frameCount: number, fps: number, lastRender: number }

export enum RenderControlType {
  Render = 'render',
  RenderOneFrame = 'one-frame',
  RenderBreak = 'break'
}

export type LoopState = {
  control: RenderControlType | null,
  hasInitialised: boolean,
  isPaused: boolean
}

export type InitData = { devicePixelRatio: number, isDarkMode: boolean }
export type InitRenderHandler = (canvas: Readonly<HTMLCanvasElement>, data: Readonly<InitData>) => void

export type DrawHandler = (context: CanvasRenderingContext2D, data: Readonly<DrawData>) => void
export type PreDrawHandler = (context: CanvasRenderingContext2D, data: Readonly<DrawData>) => void
export type PostDrawHandler = (context: CanvasRenderingContext2D, data: Readonly<DrawData>) => void
export type RenderGridLayerDrawHandler = (context: CanvasRenderingContext2D) => void

export type RenderGridLayerOptions = {
  size: Size | number,
  color?: string,
  opacity?: number,
  dashLength?: number
}
export type RenderGridLayerValue = boolean | string | number | Size | RenderGridLayerOptions | RenderGridLayerDrawHandler

export type RenderEnvironmentLayerValue = boolean | string | RenderLocation | Coordinates | RenderEnvironmentLayerOptions | RenderEnvironmentLayerDrawHandler
export type RenderEnvironmentLayerDrawHandler = (context: CanvasRenderingContext2D, data: Readonly<DrawData>) => void

export type RenderControlHandler = () => void
export type RenderControlConditionalHandler<T> = (condition: ConditionalFunction<T>) => void

export type RenderControlObject = {
  renderBreak: RenderControlHandler,
  renderBreakWhen: RenderControlConditionalHandler<DrawData>,
  renderStart: RenderControlHandler,
  renderStep: RenderControlHandler,
  renderReset: RenderControlHandler
}