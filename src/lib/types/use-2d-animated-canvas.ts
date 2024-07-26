import type {
  UseAnimatedCanvasOptions,
  AnimatedCanvasProps,
  DebugObject
} from "@/types"
import type {
  RenderEnvironmentLayerValue,
  RenderGridLayerValue,
  InitData,
  DrawData
} from "@/types/use-2d-render-loop"
import type {
  ConditionalFilterObject,
  ConditionalRenderFunction,
  ConditionalRenderObject,
  RenderFilterFunction,
  RenderFunction
} from "@/utilities/2d-drawing-operations"
import type {
  ConditionalTransformFunction,
  ConditionalTransformObject,
  TransformFunction
} from "@/utilities/misc-operations"
import {
  type JSXElementConstructor
} from "react"

export type AnimatedCanvasTransformData<T> = {
  context: CanvasRenderingContext2D,
  drawData: DrawData,
  data?: T
}

export type AnimatedCanvasRenderData<T> = {
  drawData: DrawData,
  data?: T
}

export interface AnimatedCanvasTransformFunction<T> extends TransformFunction<AnimatedCanvasTransformData<T>> {}
export interface AnimatedCanvasConditionalTransformFunction<T> extends ConditionalTransformFunction<AnimatedCanvasTransformData<T>> {}
export interface AnimatedCanvasConditionalTransformObject<T> extends ConditionalTransformObject<AnimatedCanvasTransformData<T>> {}

export interface AnimatedCanvasConditionalRenderFunction<T> extends ConditionalRenderFunction<AnimatedCanvasRenderData<T>> {}
export interface AnimatedCanvasRenderFunction<T> extends RenderFunction<AnimatedCanvasRenderData<T>> {}
export interface AnimatedCanvasConditionalRenderObject<T> extends ConditionalRenderObject<AnimatedCanvasRenderData<T>> {}
export interface AnimatedCanvasRenderFilterFunction extends RenderFilterFunction {}
export interface AnimatedCanvasConditionalFilterObject<T> extends ConditionalFilterObject<AnimatedCanvasRenderData<T>> {}

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

export type Use2dAnimatedCanvasResponse = {
  Canvas: JSXElementConstructor<AnimatedCanvasProps>,
  debug: DebugObject
}

export type InitialiseDataHandler<T> = (canvas: HTMLCanvasElement, initData: InitData) => T

