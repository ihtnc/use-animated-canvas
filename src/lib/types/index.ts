import type {
  MouseEventHandler,
  PointerEventHandler
} from "react"

export type Coordinates = { x: number, y: number }
export type Size = { width: number, height: number }

export type UtilitiesObject = {
  resize: (width: number, height: number) => void,
  pauseLoop: () => void,
  startLoop: () => void,
}

export type CanvasResizeHandler = (width: number, height: number) => void

export type UseAnimatedCanvasOptions = {
  autoStart?: boolean,
  enableDebug?: boolean,
  autoResetContext?: boolean,
  resizeDelayMs?: number,
  protectData?: boolean
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
  onCanvasResize?: CanvasResizeHandler,
  onFocus?: (event: FocusEvent) => void,
  onBlur?: (event: FocusEvent) => void
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
  offsetWidth: number,
  offsetHeight: number,
  pixelRatio: number,
  frame: number,
  isDarkMode: boolean
}