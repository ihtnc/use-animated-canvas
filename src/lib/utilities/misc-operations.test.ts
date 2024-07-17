import { afterEach, describe, expect, test, vi } from "vitest"
import { deepCopy, transformPipeline } from "./misc-operations"

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
      const obj1 = { condition: vi.fn(), transform: vi.fn() }
      const obj2 = { condition: vi.fn(), transform: vi.fn() }
      const obj3 = { condition: vi.fn(), transform: vi.fn() }

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

      const obj = { condition: vi.fn(), transform: vi.fn() }

      transformPipeline([obj]).run(initialValue)

      expect(obj.condition).toHaveBeenCalledWith(initialValue)
    })

    test('should not call object transform function when condition returns false', () => {
      const obj = { condition: vi.fn().mockReturnValue(false), transform: vi.fn() }

      transformPipeline([obj]).run(1)

      expect(obj.transform).not.toHaveBeenCalled()
    })

    test('should call object transform function when condition returns true', () => {
      const initialValue: number = 1
      const obj = { condition: vi.fn().mockReturnValue(true), transform: vi.fn() }

      transformPipeline([obj]).run(initialValue)

      expect(obj.transform).toHaveBeenCalledWith(initialValue)
    })

    test('should call object functions sequentially when run is called', () => {
      const initialValue: number = 1
      const fn1Return: number = 2
      const fn2Return: number = 3
      const fn3Return: number = 4

      const obj1 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn1Return) }
      const obj2 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn2Return) }
      const obj3 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn3Return) }

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

      const obj1 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn() }
      const obj2 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn() }
      const obj3 = { condition: vi.fn().mockReturnValue(true), transform: vi.fn().mockReturnValue(fn3Return) }

      const finalValue = transformPipeline([
        obj1,
        obj2,
        obj3
      ]).run([])

      expect(finalValue).toBe(fn3Return)
    })

    test('should not call object transform function when one condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(false)

      const obj = { condition: [condition1, condition2], transform: vi.fn() }

      transformPipeline([obj]).run(1)

      expect(obj.transform).not.toHaveBeenCalled()
    })

    test('should not call object transform function when all conditions return true', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], transform: vi.fn() }

      transformPipeline([obj]).run(1)

      expect(obj.transform).toHaveBeenCalled()
    })

    test('should not call next condition when condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(false)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], transform: vi.fn() }

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

      const obj = { condition: vi.fn().mockReturnValue(true), transform: [fn1, fn2, fn3] }

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

      const obj = { condition: vi.fn().mockReturnValue(true), transform: [fn1, fn2, fn3] }

      const finalValue = transformPipeline([obj]).run([])

      expect(finalValue).toBe(fn3Return)
    })
  })
})