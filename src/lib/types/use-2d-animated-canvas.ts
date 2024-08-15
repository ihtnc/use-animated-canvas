import type {
  UseAnimatedCanvasOptions,
  AnimatedCanvasProps,
  DrawData
} from "@/types"
import type {
  RenderEnvironmentLayerValue,
  RenderGridLayerValue,
  InitData
} from "@/types/use-2d-render-loop"
import type {
  ConditionalFilterObject,
  ConditionalRenderObject,
  RenderFilterFunction,
  RenderFunction
} from "@/utilities/2d-drawing-operations"
import type {
  ConditionalFunction,
  ConditionalTransformObject,
  TransformFunction
} from "@/utilities/misc-operations"
import {
  type JSXElementConstructor
} from "react"

export type AnimatedCanvasData<T> = {
  drawData: Readonly<DrawData>,
  data?: T
}

export interface AnimatedCanvasConditionalFunction<T> extends ConditionalFunction<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasTransformFunction<T> extends TransformFunction<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasConditionalTransformObject<T> extends ConditionalTransformObject<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasRenderFunction<T> extends RenderFunction<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasConditionalRenderObject<T> extends ConditionalRenderObject<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasRenderFilterFunction extends RenderFilterFunction {}
export interface AnimatedCanvasConditionalFilterObject<T> extends ConditionalFilterObject<AnimatedCanvasData<T>> {}

export type Use2dAnimatedCanvasProps<T> = {
  initialiseData?: InitialiseDataHandler<T>,
  preRenderTransform?: AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T> | Array<AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T>>,
  globalFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderBackgroundFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderBackground?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  renderFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  render?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  renderForegroundFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderForeground?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  postRenderTransform?: AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T> | Array<AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T>>,
  options?: UseAnimatedCanvasOptions,
  renderEnvironmentLayer?: RenderEnvironmentLayerValue,
  renderGridLayer?: RenderGridLayerValue
}

export type Use2dAnimatedCanvasResponse<T> = {
  Canvas: JSXElementConstructor<AnimatedCanvasProps>,
  debug: AnimatedCanvasDebugObject<T>
}

export type InitialiseDataHandler<T> = (canvas: Readonly<HTMLCanvasElement>, initData: Readonly<InitData>) => T

export type AnimatedCanvasRenderDebugHandler = () => void
export type AnimatedCanvasRenderDebugConditionalHandler<T> = (condition: AnimatedCanvasConditionalFunction<T>) => void

export type AnimatedCanvasDebugObject<T> = {
  renderBreak: AnimatedCanvasRenderDebugHandler,
  renderBreakWhen: AnimatedCanvasRenderDebugConditionalHandler<T>,
  renderStart: AnimatedCanvasRenderDebugHandler,
  renderStep: AnimatedCanvasRenderDebugHandler
}

