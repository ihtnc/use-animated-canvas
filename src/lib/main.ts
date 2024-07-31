import use2dAnimatedCanvas from '@/use-2d-animated-canvas'
import {
  renderWhen,
  renderWhenAny,
  renderWhenNot,
  filterWhen,
  filterWhenAny,
  filterWhenNot
} from './utilities/2d-drawing-operations'
import type {
  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,
  RenderEnvironmentLayerOptions
} from '@/types'
import type {
  AnimatedCanvasConditionalFunction,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject,
  AnimatedCanvasRenderFilterFunction,
  AnimatedCanvasConditionalFilterObject,
  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformObject,
} from '@/types/use-2d-animated-canvas'
import type {
  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderEnvironmentLayerDrawHandler
} from '@/types/use-2d-render-loop'
import {
  type ConditionalEvaluationType,
  when, whenAny, whenNot, not
} from './utilities/misc-operations'

export {
  use2dAnimatedCanvas,
  renderWhen,
  renderWhenAny,
  renderWhenNot,
  filterWhen,
  filterWhenAny,
  filterWhenNot,
  when,
  whenAny,
  whenNot,
  not
}

export type {
  AnimatedCanvasConditionalFunction,
  AnimatedCanvasRenderFunction,
  AnimatedCanvasConditionalRenderObject,
  AnimatedCanvasRenderFilterFunction,
  AnimatedCanvasConditionalFilterObject,
  AnimatedCanvasTransformFunction,
  AnimatedCanvasConditionalTransformObject,

  CanvasResizeHandler,
  Size,
  Coordinates,
  RenderLocation,

  ConditionalEvaluationType,

  RenderGridLayerValue,
  RenderGridLayerOptions,
  RenderGridLayerDrawHandler,
  RenderEnvironmentLayerValue,
  RenderEnvironmentLayerOptions,
  RenderEnvironmentLayerDrawHandler
}
