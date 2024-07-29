import type {
  MouseEventHandler,
  PointerEventHandler
} from "react"

export type Coordinates = { x: number, y: number }
export type Size = { width: number, height: number }

export type RenderDebugHandler = () => void
export type RenderDebugConditionalHandler = (condition: () => boolean) => void

export type UtilitiesObject = {
  resize: (width: number, height: number) => void,
}
export type DebugObject = {
  renderBreak: RenderDebugHandler,
  renderBreakWhen: RenderDebugConditionalHandler,
  renderContinue: RenderDebugHandler,
  renderStep: RenderDebugHandler
}

export type CanvasResizeHandler = (width: number, height: number) => void

export type UseAnimatedCanvasOptions = {
  autoStart?: boolean,
  enableDebug?: boolean,
  autoResetContext?: boolean,
  resizeDelayMs?: number
}

export type AnimatedCanvasProps = {
  className?: string,
  onClick?: MouseEventHandler<HTMLCanvasElement>,
  onPointerDown?: PointerEventHandler<HTMLCanvasElement>,
  onPointerUp?: PointerEventHandler<HTMLCanvasElement>,
  onPointerMove?: PointerEventHandler<HTMLCanvasElement>,
  onPointerOut?: PointerEventHandler<HTMLCanvasElement>,
  onPointerEnter?: PointerEventHandler<HTMLCanvasElement>,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void,
  onCanvasResize?: CanvasResizeHandler
}

export enum RenderLocation {
  TopLeft, TopCenter, TopRight,
  MiddleLeft, Center, MiddleRight,
  BottomLeft, BottomCenter, BottomRight
}
export type RenderEnvironmentLayerOptions = {
  location: RenderLocation | Coordinates,
  color?: string,
  opacity?: number,
  renderFps?: boolean,
  renderSize?: boolean,
  renderClientSize?: boolean,
  renderPixelRatio?: boolean,
  renderFrameNumber?: boolean
}
export type DrawData = {
  fps: number,
  width: number,
  height: number,
  clientWidth: number,
  clientHeight: number,
  pixelRatio: number,
  frame: number
}