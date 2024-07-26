import use2dAnimatedCanvas from '@/use-2d-animated-canvas'
import {
  renderWhen,
  filterWhen
} from './utilities/2d-drawing-operations'
import type {
  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,
  RenderEnvironmentLayerOptions
} from '@/types'
import type {
  AnimatedCanvasConditionalRenderFunction,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject,
  AnimatedCanvasRenderFilterFunction,
  AnimatedCanvasConditionalFilterObject,

  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformFunction,
  AnimatedCanvasConditionalTransformObject,
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
  AnimatedCanvasConditionalRenderFunction,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject,
  AnimatedCanvasRenderFilterFunction,
  AnimatedCanvasConditionalFilterObject,

  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformFunction,
  AnimatedCanvasConditionalTransformObject,

  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,

  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderEnvironmentLayerOptions,
  RenderEnvironmentLayerDrawHandler
}
