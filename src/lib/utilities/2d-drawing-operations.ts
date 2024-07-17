import { type Size } from "@/types"

export const getTextSize = (context: CanvasRenderingContext2D, text: string): Size => {
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText(text)
  const height = actualBoundingBoxAscent + actualBoundingBoxDescent

  return { width, height }
}

export type RenderFunction<T> = (context: CanvasRenderingContext2D, data?: T) => void;
export type RenderPipelineRunFunction<T> = (context: CanvasRenderingContext2D, data?: T, filters?: Array<RenderFilterFunction | ConditionalFilterObject<T>>) => void;
export type ConditionalFunction<T> = (data?: T) => boolean;
export type ConditionalRenderObject<T> = {
  condition: ConditionalFunction<T> | Array<ConditionalFunction<T>>,
  render: RenderFunction<T> | Array<RenderFunction<T>>
};
export type RenderFilterFunction = (context: CanvasRenderingContext2D) => void;
export type ConditionalFilterObject<T> = {
  condition: ConditionalFunction<T> | Array<ConditionalFunction<T>>,
  filter: RenderFilterFunction | Array<RenderFilterFunction>
};

type RenderPipelinFunction = <T>(pipeline: Array<RenderFunction<T> | ConditionalRenderObject<T>>) => { run: RenderPipelineRunFunction<T> };
export const renderPipeline:RenderPipelinFunction = (pipeline) => {
  return {
    run: (context, data, filters) => {
      const filterFns = filters ?? []
      if (filterFns.length > 0) { context.save() }

      for (let i = 0; i < filterFns.length; i++) {
        const filter = filterFns[i]
        runFilter(context, filter, data)
      }

      for (let i = 0; i < pipeline.length; i++) {
        const item = pipeline[i]
        runRender(context, item, data)
      }

      if (filterFns.length > 0) { context.restore() }
    }
  }
}

type RunFilterFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFilterFunction | ConditionalFilterObject<T>, data?: T) => void;
const runFilter: RunFilterFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFilterFunction | ConditionalFilterObject<T>, data?: T) => {
  if (typeof fn === 'function') {
    const filter = fn as RenderFilterFunction
    filter(context)
    return
  }

  if (typeof fn === 'object' && 'filter' in fn && 'condition' in fn) {
    const conditionalFilter = fn as ConditionalFilterObject<T>

    if (typeof conditionalFilter.condition === 'function') {
      let conditionalFn = conditionalFilter.condition as ConditionalFunction<T>
      if (conditionalFn(data) === false) { return }
    }

    if (Array.isArray(conditionalFilter.condition)) {
      let conditionalFns = conditionalFilter.condition as Array<ConditionalFunction<T>>
      if (conditionalFns.some((fn) => fn(data) === false)) { return }
    }

    if (typeof conditionalFilter.filter === 'function') {
      const filterFn = conditionalFilter.filter as RenderFilterFunction
      filterFn(context)
    }

    if (Array.isArray(conditionalFilter.filter)) {
      let filterFns = conditionalFilter.filter as Array<RenderFilterFunction>
      for (let i = 0; i < filterFns.length; i++) {
        filterFns[i](context)
      }
    }
  }
}

type RunRenderFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFunction<T> | ConditionalRenderObject<T>, data?: T) => void;
const runRender: RunRenderFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFunction<T> | ConditionalRenderObject<T>, data?: T) => {
  if (typeof fn === 'function') {
    const render = fn as RenderFunction<T>
    render(context, data)
    return
  }

  if (typeof fn === 'object' && 'render' in fn && 'condition' in fn) {
    const conditionalRender = fn as ConditionalRenderObject<T>

    if (typeof conditionalRender.condition === 'function') {
      const conditionalFn = conditionalRender.condition as ConditionalFunction<T>
      if (conditionalFn(data) === false) { return }
    }

    if (Array.isArray(conditionalRender.condition)) {
      let conditionalFns = conditionalRender.condition as Array<ConditionalFunction<T>>
      if (conditionalFns.some((fn) => fn(data) === false)) { return }
    }

    if (typeof conditionalRender.render === 'function') {
      const renderFn = conditionalRender.render as RenderFunction<T>
      renderFn(context, data)
    }

    if (Array.isArray(conditionalRender.render)) {
      let renderFns = conditionalRender.render as Array<RenderFunction<T>>
      for (let i = 0; i < renderFns.length; i++) {
        renderFns[i](context, data)
      }
    }
  }
}

type ConditionalRenderFunction = <T>(condition: ((data?: T) => boolean) | (Array<(data?: T) => boolean>), render: (context: CanvasRenderingContext2D, data?: T) => void) => ConditionalRenderObject<T>;
export const renderWhen:ConditionalRenderFunction = <T>(condition: ((data?: T) => boolean) | (Array<(data?: T) => boolean>), render: (context: CanvasRenderingContext2D, data?: T) => void) => {
  return {
    condition: condition as ConditionalFunction<T>,
    render: render as RenderFunction<T>
  }
}

type ConditionalFilterFunction = <T>(condition: ((data?: T) => boolean) | (Array<(data?: T) => boolean>), filter: (context: CanvasRenderingContext2D) => void) => ConditionalFilterObject<T>;
export const filterWhen:ConditionalFilterFunction = <T>(condition: ((data?: T) => boolean) | (Array<(data?: T) => boolean>), filter: (context: CanvasRenderingContext2D) => void) => {
  return {
    condition: condition as ConditionalFunction<T>,
    filter: filter as RenderFilterFunction
  }
}
