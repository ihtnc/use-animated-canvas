import type {
  UseAnimatedCanvasOptions,
  AnimatedCanvasProps,
  DebugObject,
  TransformFunction,
  ConditionalTransformObject,
  OnResizeHandler
} from "@/types"
import type {
  RenderEnvironmentLayerRendererValue,
  RenderGridLayerRendererValue,
  InitData,
  DrawData
} from "@/types/use-2d-render-loop"
import { ConditionalFilterObject, ConditionalRenderObject, RenderFilterFunction, RenderFunction } from "@/utilities/2d-drawing-operations"
import {
  type JSXElementConstructor
} from "react"

export type AnimatedCanvasData<T> = {
  canvas: HTMLCanvasElement,
  environment: DrawData,
  data?: T
}

export type AnimatedCanvasRenderData<T> = {
  frame: number,
  fps: number,
  devicePixelRatio: number,
  data?: T
}

export interface AnimatedCanvasTransformFunction<T> extends TransformFunction<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasConditionalTransformObject<T> extends ConditionalTransformObject<AnimatedCanvasData<T>> {}
export interface AnimatedCanvasConditionalFilterObject<T> extends ConditionalFilterObject<AnimatedCanvasRenderData<T>> {}
export interface AnimatedCanvasRenderFunction<T> extends RenderFunction<AnimatedCanvasRenderData<T>> {}
export interface AnimatedCanvasConditionalRenderObject<T> extends ConditionalRenderObject<AnimatedCanvasRenderData<T>> {}

export type Use2dAnimatedCanvasProps<T> = {
  initialiseData?: InitialiseDataHandler<T>,
  preRenderTransform?: AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T> | Array<AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T>>,
  preRenderFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderBackgroundFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderBackground?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  renderFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  render?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  renderForegroundFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  renderForeground?: AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T> | Array<AnimatedCanvasRenderFunction<T> | AnimatedCanvasConditionalRenderObject<T>>,
  postRenderFilter?: RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T> | Array<RenderFilterFunction | AnimatedCanvasConditionalFilterObject<T>>,
  postRenderTransform?: AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T> | Array<AnimatedCanvasTransformFunction<T> | AnimatedCanvasConditionalTransformObject<T>>,
  onResize?: OnResizeHandler,
  options?: UseAnimatedCanvasOptions,
  renderEnvironmentLayerRenderer?: RenderEnvironmentLayerRendererValue,
  renderGridLayerRenderer?: RenderGridLayerRendererValue
}

export type Use2dAnimatedCanvasResponse = {
  Canvas: JSXElementConstructor<AnimatedCanvasProps>,
  debug: DebugObject
}

export type InitialiseDataHandler<T> = (canvas: HTMLCanvasElement, environment: InitData) => T

