import {
  RenderLocation,
  type RenderEnvironmentLayerOptions
} from "./types"
import type {
  Use2DRenderLoopOptions,
  RenderGridLayerOptions
} from "./types/use-2d-render-loop"

export const DEFAULT_RENDER_ENVIRONMENT_LAYER_OPTIONS: RenderEnvironmentLayerOptions = {
  location: RenderLocation.TopLeft,
  color: "#000000",
  opacity: 1,
  renderFps: true,
  renderSize: true,
  renderClientSize: true,
  renderPixelRatio: true,
  renderFrameNumber: true
}

export const DEFAULT_RENDER_GRID_LAYER_OPTIONS: RenderGridLayerOptions = {
  size: 50,
  color: "#000000",
  opacity: 1,
  dashLength: 0
}

export const DEFAULT_OPTIONS: Use2DRenderLoopOptions = {
  autoStart: true,
  enableDebug: false,
  renderEnvironmentLayerRenderer: false,
  maxFrame: Number.MAX_SAFE_INTEGER
}
