export const deepCopy: <T>(value: T) => T = (value) => {
  if (value === null || typeof value !== "object") { return value }

  if (value instanceof Date) {
    const dateCopy = new Date()
    dateCopy.setTime(value.getTime())
    return dateCopy as typeof value
  }

  if (Array.isArray(value)) {
    const arrayCopy = []
    for (let i=0; i < value.length; i++) {
      arrayCopy.push(deepCopy(value[i]))
    }
    return arrayCopy as typeof value
  }

  if (value instanceof Object) {
    const objCopy = { ...value }
    const obj = value as Object
    for (let prop in value) {
      if (obj.hasOwnProperty(prop)) {
        const propValue = value[prop]
        objCopy[prop] = deepCopy(propValue) as typeof propValue;
      }
    }
    return objCopy
  }

  return value
}

export type TransformFunction<T> = (data: T) => T;
export type ConditionalTransformFunction<T> = (data: T) => boolean;
export type ConditionalTransformObject<T> = {
  condition: ConditionalTransformFunction<T> | Array<ConditionalTransformFunction<T>>,
  transform: TransformFunction<T> | Array<TransformFunction<T>>
};

type TransformPipelineFunction = <T>(operations: Array<TransformFunction<T> | ConditionalTransformObject<T>>) => { run: TransformFunction<T> }
export const transformPipeline: TransformPipelineFunction = (operations) => {
  return {
    run: (value) => {
      let lastValue = value
      for (let i = 0; i < operations.length; i++) {
        const item = operations[i]
        lastValue = runTransform(lastValue, item)
      }

      return lastValue
    }
  }
}

type RunTransformFunction = <T>(data: T, fn: TransformFunction<T> | ConditionalTransformObject<T>) => T;
const runTransform: RunTransformFunction = <T>(data: T, fn: TransformFunction<T> | ConditionalTransformObject<T>) => {
  if (typeof fn === 'function') {
    const run = fn as TransformFunction<T>
    return run(data)
  }

  if (typeof fn === 'object' && 'transform' in fn && 'condition' in fn) {
    const conditionalOperation = fn as ConditionalTransformObject<T>

    if (typeof conditionalOperation.condition === 'function') {
      const conditionalFn = conditionalOperation.condition as ConditionalTransformFunction<T>
      if (conditionalFn(data) === false) { return data }
    }

    if (Array.isArray(conditionalOperation.condition)) {
      let conditionalFns = conditionalOperation.condition as Array<ConditionalTransformFunction<T>>
      if (conditionalFns.some((fn) => fn(data) === false)) { return data }
    }

    if (typeof conditionalOperation.transform === 'function') {
      const runFn = conditionalOperation.transform as TransformFunction<T>
      return runFn(data)
    }

    if (Array.isArray(conditionalOperation.transform)) {
      let runFns = conditionalOperation.transform as Array<TransformFunction<T>>
      let result = data
      for (let i = 0; i < runFns.length; i++) {
        result = runFns[i](result)
      }

      return result
    }
  }

  return data
}

type WhenTransformFunction = <T>(condition: ((data: T) => boolean) | Array<(data: T) => boolean>, transform: ((data: T) => T) | (Array<(data: T) => T>)) => ConditionalTransformObject<T>;
export const when: WhenTransformFunction = <T>(condition: ((data: T) => boolean) | Array<(data: T) => boolean>, transform: ((data: T) => T) | (Array<(data: T) => T>)) => {
  return {
    condition: condition as ConditionalTransformFunction<T> | Array<ConditionalTransformFunction<T>>,
    transform: transform as TransformFunction<T> | Array<TransformFunction<T>>
  }
}