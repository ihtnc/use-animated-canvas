import { afterEach, describe, expect, test, vi } from "vitest"
import { ConditionalEvaluationType, deepCopy, transformPipeline, when, whenAny, whenNot, not } from "./misc-operations"

describe('misc operations', () => {

  describe('deepCopy function', () => {
    test('should handle numbers', () => {
      const value = 123
      const result = deepCopy(value)
      expect(result).toBe(value)
    })

    test('should handle strings', () => {
      const value = '123'
      const result = deepCopy(value)
      expect(result).toBe(value)
    })

    test('should handle date', () => {
      const value = new Date(2024, 1, 1)
      const result = deepCopy(value)
      expect(result).toStrictEqual(value)
    })

    test('should handle array', () => {
      const value = [1, 2, 3]
      const result = deepCopy(value)
      expect(result).toStrictEqual(value)
    })

    test('should handle array of objects', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 3 }
      const value = [obj1, obj2, obj3]

      const result = deepCopy(value)

      expect(result).toStrictEqual(value)
      expect(result[0]).not.toBe(obj1)
      expect(result[1]).not.toBe(obj2)
      expect(result[2]).not.toBe(obj3)
    })

    test('should handle objects', () => {
      const value = { numericProp: 123, stringProp: 'abc' }
      const copy = value

      const result = deepCopy(value)

      expect(copy).toBe(value)
      expect(result).not.toBe(value)
      expect(result).toStrictEqual(value)
    })

    test('should handle nested objects', () => {
      const prop = { numericProp: 123, stringProp: 'abc' }
      const value = { objProp: prop }
      const copy = value

      const result = deepCopy(value)

      expect(copy).toBe(value)
      expect(result).not.toBe(value)
      expect(result.objProp).not.toBe(value.objProp)
      expect(result).toStrictEqual(value)
    })
  })

  describe('transformPipeline function', () => {
    afterEach(() => {
      vi.resetAllMocks()
    })

    test('should not immediately call functions', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn()

      transformPipeline([
        fn1,
        fn2,
        fn3
      ])

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
      expect(fn3).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when run is called', () => {
      const initialValue: number = 1
      const fn1Return: number = 2
      const fn2Return: number = 3
      const fn3Return: number = 4

      const fn1 = vi.fn().mockReturnValue(fn1Return)
      const fn2 = vi.fn().mockReturnValue(fn2Return)
      const fn3 = vi.fn().mockReturnValue(fn3Return)

      transformPipeline<number>([
        fn1,
        fn2,
        fn3
      ]).run(initialValue)

      expect(fn1).toHaveBeenCalledWith(initialValue)
      expect(fn2).toHaveBeenCalledWith(fn1Return)
      expect(fn3).toHaveBeenCalledWith(fn2Return)
    })

    test('should return response from last function', () => {
      const fn3Return: number = 1

      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn().mockReturnValue(fn3Return)

      const finalValue = transformPipeline([
        fn1,
        fn2,
        fn3
      ]).run([])

      expect(finalValue).toBe(fn3Return)
    })

    test('should not immediately call object functions', () => {
      const obj1 = { condition: vi.fn(), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }
      const obj2 = { condition: vi.fn(), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }
      const obj3 = { condition: vi.fn(), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }

      transformPipeline([
        obj1,
        obj2,
        obj3
      ])

      expect(obj1.condition).not.toHaveBeenCalled()
      expect(obj1.transform).not.toHaveBeenCalled()
      expect(obj2.condition).not.toHaveBeenCalled()
      expect(obj2.transform).not.toHaveBeenCalled()
      expect(obj3.condition).not.toHaveBeenCalled()
      expect(obj3.transform).not.toHaveBeenCalled()
    })

    test('should call object condition function when run is called', () => {
      const initialValue: number = 1

      const obj = { condition: vi.fn(), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }

      transformPipeline([obj]).run(initialValue)

      expect(obj.condition).toHaveBeenCalledWith(initialValue)
    })

    test.each([
      { returnValue: false, evaluation: ConditionalEvaluationType.All },
      { returnValue: false,evaluation: ConditionalEvaluationType.Any },
      { returnValue: true, evaluation: ConditionalEvaluationType.None }
    ])('should not call object transform function when condition returns $returnValue and condition evaluation is $evaluation', ({ returnValue, evaluation }: { returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const obj = { condition: vi.fn().mockReturnValue(returnValue), transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(1)

      expect(obj.transform).not.toHaveBeenCalled()
    })

    test.each([
      { returnValue: true, evaluation: ConditionalEvaluationType.All },
      { returnValue: true, evaluation: ConditionalEvaluationType.Any },
      { returnValue: false, evaluation: ConditionalEvaluationType.None }
    ])('should call object transform function when condition returns $returnValue and condition evaluation is $evaluation', ({ returnValue, evaluation }: { returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const initialValue: number = 1
      const obj = { condition: vi.fn().mockReturnValue(returnValue), transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(initialValue)

      expect(obj.transform).toHaveBeenCalledWith(initialValue)
    })

    test('should call object functions sequentially when run is called', () => {
      const initialValue: number = 1
      const fn1Return: number = 2
      const fn2Return: number = 3
      const fn3Return: number = 4

      const obj1 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn1Return), evaluation: ConditionalEvaluationType.All }
      const obj2 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn2Return), evaluation: ConditionalEvaluationType.All }
      const obj3 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn3Return), evaluation: ConditionalEvaluationType.All }

      transformPipeline([
        obj1,
        obj2,
        obj3
      ]).run(initialValue)

      expect(obj1.condition).toHaveBeenCalledWith(initialValue)
      expect(obj1.transform).toHaveBeenCalledWith(initialValue)
      expect(obj2.condition).toHaveBeenCalledWith(fn1Return)
      expect(obj2.transform).toHaveBeenCalledWith(fn1Return)
      expect(obj3.condition).toHaveBeenCalledWith(fn2Return)
      expect(obj3.transform).toHaveBeenCalledWith(fn2Return)
    })

    test('should return response from last object transform', () => {
      const fn3Return: number = 4

      const obj1 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }
      const obj2 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn(), evaluation: ConditionalEvaluationType.All }
      const obj3 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn3Return), evaluation: ConditionalEvaluationType.All }

      const finalValue = transformPipeline([
        obj1,
        obj2,
        obj3
      ]).run([])

      expect(finalValue).toBe(fn3Return)
    })

    test.each([
      { firstReturnValue: true, returnValue: false, evaluation: ConditionalEvaluationType.All },
      { firstReturnValue: false, returnValue: true, evaluation: ConditionalEvaluationType.None }
    ])('should not call object transform function when one condition returns $returnValue and condition evaluation is $evaluation', ({ firstReturnValue, returnValue, evaluation }: { firstReturnValue: boolean, returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const condition1 = vi.fn().mockReturnValue(firstReturnValue)
      const condition2 = vi.fn().mockReturnValue(returnValue)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(1)

      expect(obj.transform).not.toHaveBeenCalled()
    })

    test('should call object transform function when one condition returns true and condition evaluation is \'any\'', () => {
      const condition1 = vi.fn().mockReturnValue(false)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation: ConditionalEvaluationType.Any }

      transformPipeline([obj]).run(1)

      expect(obj.transform).toHaveBeenCalled()
    })

    test.each([
      { returnValue: true, evaluation: ConditionalEvaluationType.All },
      { returnValue: true, evaluation: ConditionalEvaluationType.Any },
      { returnValue: false, evaluation: ConditionalEvaluationType.None }
    ])('should call object transform function when all conditions return $returnValue and condition evaluation is $evaluation', ({ returnValue, evaluation }: { returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const condition1 = vi.fn().mockReturnValue(returnValue)
      const condition2 = vi.fn().mockReturnValue(returnValue)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(1)

      expect(obj.transform).toHaveBeenCalled()
    })

    test.each([
      { returnValue: false, evaluation: ConditionalEvaluationType.All },
      { returnValue: false, evaluation: ConditionalEvaluationType.Any },
      { returnValue: true, evaluation: ConditionalEvaluationType.None }
    ])('should not call object transform function when all conditions return $returnValue and condition evaluation is $evaluation', ({ returnValue, evaluation }: { returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const condition1 = vi.fn().mockReturnValue(returnValue)
      const condition2 = vi.fn().mockReturnValue(returnValue)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(1)

      expect(obj.transform).not.toHaveBeenCalled()
    })

    test.each([
      { returnValue: false, evaluation: ConditionalEvaluationType.All },
      { returnValue: true, evaluation: ConditionalEvaluationType.None }
    ])('should not call next condition when condition returns $returnValue and condition evaluation is $evaluation', ({ returnValue, evaluation }: { returnValue: boolean, evaluation: ConditionalEvaluationType}) => {
      const condition1 = vi.fn().mockReturnValue(returnValue)
      const condition2 = vi.fn().mockReturnValue(!returnValue)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation }

      transformPipeline([obj]).run(1)

      expect(condition2).not.toHaveBeenCalled()
    })

    test('should not call next condition anymore when condition returns true and condition evaluation is \'any\'', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(false)

      const obj = { condition: [condition1, condition2], transform: vi.fn(), evaluation: ConditionalEvaluationType.Any }

      transformPipeline([obj]).run(1)

      expect(condition2).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when an array is supplied in object', () => {
      const initialValue: number = 1
      const fn1Return: number = 2
      const fn2Return: number = 3
      const fn3Return: number = 4

      const fn1 = vi.fn().mockReturnValue(fn1Return)
      const fn2 = vi.fn().mockReturnValue(fn2Return)
      const fn3 = vi.fn().mockReturnValue(fn3Return)

      const obj = { condition: vi.fn().mockReturnValue(true), transform: [fn1, fn2, fn3], evaluation: ConditionalEvaluationType.All }

      transformPipeline([obj]).run(initialValue)

      expect(fn1).toHaveBeenCalledWith(initialValue)
      expect(fn2).toHaveBeenCalledWith(fn1Return)
      expect(fn3).toHaveBeenCalledWith(fn2Return)
    })

    test('should return response from last function in the array', () => {
      const fn3Return: number = 1

      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn().mockReturnValue(fn3Return)

      const obj = { condition: vi.fn().mockReturnValue(true), transform: [fn1, fn2, fn3], evaluation: ConditionalEvaluationType.All }

      const finalValue = transformPipeline([obj]).run([])

      expect(finalValue).toBe(fn3Return)
    })

    test('should not call condition function when condition evaluation is invalid', () => {
      const condition = vi.fn()
      const obj = {
        condition,
        transform: vi.fn(),
        evaluation: 'invalid'
      }

      // @ts-ignore
      transformPipeline([obj]).run([])

      expect(obj.condition).not.toHaveBeenCalled()
    })

    test('should not call transform function when condition evaluation is invalid', () => {
      const condition = vi.fn()
      const obj = {
        condition,
        transform: vi.fn(),
        evaluation: 'invalid'
      }

      // @ts-ignore
      transformPipeline([obj]).run([])

      expect(obj.transform).not.toHaveBeenCalled()
    })
  })

  describe('when function', () => {
    test('should create an object from parameters', () => {
      const condition = vi.fn()
      const transform = vi.fn()

      const result = when(condition, transform)

      expect(result.condition).toBe(condition)
      expect(result.transform).toBe(transform)
    })

    test('should create an object with internal value', () => {
      const result = when(vi.fn(), vi.fn())

      expect(result.evaluation).toBe(ConditionalEvaluationType.All)
    })
  })

  describe('whenAny function', () => {
    test('should create an object from parameters', () => {
      const condition = vi.fn()
      const transform = vi.fn()

      const result = whenAny(condition, transform)

      expect(result.condition).toBe(condition)
      expect(result.transform).toBe(transform)
    })

    test('should create an object with internal value', () => {
      const result = whenAny(vi.fn(), vi.fn())

      expect(result.evaluation).toBe(ConditionalEvaluationType.Any)
    })
  })

  describe('whenNot function', () => {
    test('should create an object from parameters', () => {
      const condition = vi.fn()
      const transform = vi.fn()

      const result = whenNot(condition, transform)

      expect(result.condition).toBe(condition)
      expect(result.transform).toBe(transform)
    })

    test('should create an object with internal value', () => {
      const result = whenNot(vi.fn(), vi.fn())

      expect(result.evaluation).toBe(ConditionalEvaluationType.None)
    })
  })

  describe('not function', () => {
    test('should return a function', () => {
      const condition = vi.fn()

      const result = not(condition)

      expect(result).toBeTypeOf('function')
    })

    test('should not call the supplied function immediately', () => {
      const condition = vi.fn()

      not(condition)

      expect(condition).not.toHaveBeenCalled()
    })

    test('should call the supplied function when the resulting function is called', () => {
      const condition = vi.fn()

      const data = 1
      const negatedFn = not(condition)
      negatedFn(data)

      expect(condition).toHaveBeenCalledWith(data)
    })

    test.each([
      { returnValue: true, expected: false },
      { returnValue: false, expected: true }
    ])('should negate the result of the function when result is $returnValue', ({ returnValue, expected }: { returnValue: boolean, expected: boolean }) => {
      const condition = vi.fn().mockReturnValue(returnValue)

      const negatedFn = not(condition)
      const actual = negatedFn(1)

      expect(actual).toBe(expected)
    })

  })
})