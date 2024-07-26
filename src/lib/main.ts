import use2dAnimatedCanvas from '@/use-2d-animated-canvas'
import { renderWhen, filterWhen } from './utilities/2d-drawing-operations'
import type {
  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,
  RenderEnvironmentLayerOptions
} from '@/types'
import type {
  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformObject,
  AnimatedCanvasConditionalFilterObject,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject
} from '@/types/use-2d-animated-canvas'
import type {
  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderEnvironmentLayerDrawHandler
} from '@/types/use-2d-render-loop'

export {
  use2dAnimatedCanvas,
  renderWhen,
  filterWhen
}

export type {
  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformObject,
  AnimatedCanvasConditionalFilterObject,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject,

  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,
  RenderEnvironmentLayerOptions,

  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderEnvironmentLayerDrawHandler
}
