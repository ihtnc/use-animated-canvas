import { type Size } from "@/types"
import { type ConditionalFunction, ConditionalEvaluationType } from "./misc-operations"

export const getTextSize = (context: CanvasRenderingContext2D, text: string): Size => {
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText(text)
  const height = actualBoundingBoxAscent + actualBoundingBoxDescent

  return { width, height }
}

export type RenderFunction<T> = (context: CanvasRenderingContext2D, data: T) => void
export type RenderPipelineRunFunction<T> = (context: CanvasRenderingContext2D, data: T, filters?: Array<RenderFilterFunction | ConditionalFilterObject<T>>) => void
export type FilterPipelineRunFunction<T> = (context: CanvasRenderingContext2D, data: T) => void
export type ConditionalRenderObject<T> = {
  condition: ConditionalFunction<T> | Array<ConditionalFunction<T>>,
  evaluation: ConditionalEvaluationType,
  render: RenderFunction<T> | Array<RenderFunction<T>>
}
export type RenderFilterFunction = (context: CanvasRenderingContext2D) => void
export type ConditionalFilterObject<T> = {
  condition: ConditionalFunction<T> | Array<ConditionalFunction<T>>,
  evaluation: ConditionalEvaluationType,
  filter: RenderFilterFunction | Array<RenderFilterFunction>
}

type RenderPipelineFunction = <T>(pipeline: Array<RenderFunction<T> | ConditionalRenderObject<T>>) => { run: RenderPipelineRunFunction<T> }
export const renderPipeline:RenderPipelineFunction = (pipeline) => {
  return {
    run: (context, data, filters) => {
      const filterFns = filters ?? []
      if (filterFns.length > 0) { context.save() }

      filterPipeline(filterFns).run(context, data)

      for (let i = 0; i < pipeline.length; i++) {
        const item = pipeline[i]
        runRender(context, item, data)
      }

      if (filterFns.length > 0) { context.restore() }
    }
  }
}

type FilterPipelinFunction = <T>(pipeline: Array<RenderFilterFunction | ConditionalFilterObject<T>>) => { run: FilterPipelineRunFunction<T> }
export const filterPipeline:FilterPipelinFunction = (pipeline) => {
  return {
    run: (context, data) => {
      const filterFns = pipeline ?? []

      for (let i = 0; i < filterFns.length; i++) {
        const filter = filterFns[i]
        runFilter(context, filter, data)
      }
    }
  }
}

type RunFilterFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFilterFunction | ConditionalFilterObject<T>, data: T) => void
const runFilter: RunFilterFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFilterFunction | ConditionalFilterObject<T>, data: T) => {
  if (typeof fn === 'function') {
    const filter = fn as RenderFilterFunction
    filter(context)
    return
  }

  if (typeof fn === 'object' && 'filter' in fn && 'condition' in fn && 'evaluation' in fn) {
    const conditionalFilter = fn as ConditionalFilterObject<T>
    const { evaluation } = conditionalFilter

    if (typeof conditionalFilter.condition === 'function') {
      let conditionalFn = conditionalFilter.condition as ConditionalFunction<T>
      const conditionToContinue = evaluation === ConditionalEvaluationType.None ? false : true
      if (conditionalFn(data) !== conditionToContinue) { return }
    }

    if (Array.isArray(conditionalFilter.condition)) {
      let conditionalFns = conditionalFilter.condition as Array<ConditionalFunction<T>>
      switch (evaluation) {
        case ConditionalEvaluationType.All:
          if (conditionalFns.some((fn) => fn(data) === false)) { return }
          break

        case ConditionalEvaluationType.Any:
          if (conditionalFns.every((fn) => fn(data) === false)) { return }
          break

        case ConditionalEvaluationType.None:
          if (conditionalFns.some((fn) => fn(data) === true)) { return }
          break
      }
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

type RunRenderFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFunction<T> | ConditionalRenderObject<T>, data: T) => void
const runRender: RunRenderFunction = <T>(context: CanvasRenderingContext2D, fn: RenderFunction<T> | ConditionalRenderObject<T>, data: T) => {
  if (typeof fn === 'function') {
    const render = fn as RenderFunction<T>
    render(context, data)
    return
  }

  if (typeof fn === 'object' && 'render' in fn && 'condition' in fn && 'evaluation' in fn) {
    const conditionalRender = fn as ConditionalRenderObject<T>
    const { evaluation } = conditionalRender

    if (typeof conditionalRender.condition === 'function') {
      const conditionalFn = conditionalRender.condition as ConditionalFunction<T>
      const conditionToContinue = evaluation === ConditionalEvaluationType.None ? false : true
      if (conditionalFn(data) !== conditionToContinue) { return }
    }

    if (Array.isArray(conditionalRender.condition)) {
      let conditionalFns = conditionalRender.condition as Array<ConditionalFunction<T>>
      switch (evaluation) {
        case ConditionalEvaluationType.All:
          if (conditionalFns.some((fn) => fn(data) === false)) { return }
          break

        case ConditionalEvaluationType.Any:
          if (conditionalFns.every((fn) => fn(data) === false)) { return }
          break

        case ConditionalEvaluationType.None:
          if (conditionalFns.some((fn) => fn(data) === true)) { return }
          break
      }
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

type RenderWhenFunction = <T>(
  condition: ConditionalFunction<T> | Array<ConditionalFunction<T>>,
  render: RenderFunction<T> | Array<RenderFunction<T>>
) => ConditionalRenderObject<T>
export const renderWhen: RenderWhenFunction = (condition, render) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.All,
    render
  }
}
export const renderWhenAny: RenderWhenFunction = (condition, render) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.Any,
    render
  }
}
export const renderWhenNot: RenderWhenFunction = (condition, render) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.None,
    render
  }
}

type FilterWhenFunction = <T>(
  condition: ConditionalFunction<T> | (Array<ConditionalFunction<T>>),
  filter: RenderFilterFunction | Array<RenderFilterFunction>
) => ConditionalFilterObject<T>
export const filterWhen: FilterWhenFunction = (condition, filter) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.All,
    filter
  }
}
export const filterWhenAny: FilterWhenFunction = (condition, filter) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.Any,
    filter
  }
}
export const filterWhenNot: FilterWhenFunction = (condition, filter) => {
  return {
    condition,
    evaluation: ConditionalEvaluationType.None,
    filter
  }
}
