import { Mock, afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import {
  renderPipeline,
  filterPipeline,
  getTextSize
} from "./2d-drawing-operations"

describe('2d drawing operations', () => {

  describe('getTextSize function', () => {
    let context: CanvasRenderingContext2D
    let contextMock: { measureText: Mock }

    beforeEach(() => {
      contextMock = {
        measureText: vi.fn()
      }
      context = contextMock as unknown as CanvasRenderingContext2D
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    test('should call context.measureText', () => {
      const text = 'test'
      contextMock.measureText.mockReturnValue({ width: 0 })

      getTextSize(context, text)

      expect(contextMock.measureText).toHaveBeenCalledWith(text)
    })

    test('should return the width the text', () => {
      const width = 123

      contextMock.measureText.mockReturnValue({ width })

      const result = getTextSize(context, 'test')
      expect(result.width).toBe(width)
    })

    test('should return the height of the text based on boundingBox details', () => {
      const actualBoundingBoxAscent = 123
      const actualBoundingBoxDescent = 456
      const height = actualBoundingBoxAscent + actualBoundingBoxDescent

      contextMock.measureText.mockReturnValue({ width: 0, actualBoundingBoxAscent, actualBoundingBoxDescent })

      const result = getTextSize(context, 'test')
      expect(result.height).toBe(height)
    })
  })

  describe('renderPipeline function', () => {
    let data: number
    let context: CanvasRenderingContext2D
    let contextMock: { save: Mock, restore: Mock }

    beforeEach(() => {
      data = 1
      contextMock = {
        save: vi.fn(),
        restore: vi.fn()
      }
      context = contextMock as unknown as CanvasRenderingContext2D
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    test('should not immediately call functions', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn()

      renderPipeline([
        fn1,
        fn2,
        fn3
      ])

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
      expect(fn3).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when run is called', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      renderPipeline([
        fn1,
        fn2,
        fn3
      ]).run(context, data)

      expect(fn1).toHaveBeenCalledWith(context, data)
      expect(fn2).toHaveBeenCalledWith(context, data)
      expect(fn3).toHaveBeenCalledWith(context, data)
    })

    test('should call filters sequentially when filters are supplied', () => {
      let callCount = 0
      const filter1 = vi.fn(() => expect(++callCount).toBe(1))
      const filter2 = vi.fn(() => expect(++callCount).toBe(2))
      const filter3 = vi.fn(() => expect(++callCount).toBe(3))

      renderPipeline([]).run(context, data, [filter1, filter2, filter3])

      expect(filter1).toHaveBeenCalledWith(context)
      expect(filter2).toHaveBeenCalledWith(context)
      expect(filter3).toHaveBeenCalledWith(context)
    })

    test('should call filters first before render functions', () => {
      let callCount = 0
      const filter1 = vi.fn(() => expect(++callCount).toBe(1))
      const filter2 = vi.fn(() => expect(++callCount).toBe(2))
      const filter3 = vi.fn(() => expect(++callCount).toBe(3))
      const fn1 = vi.fn(() => expect(++callCount).toBe(4))
      const fn2 = vi.fn(() => expect(++callCount).toBe(5))
      const fn3 = vi.fn(() => expect(++callCount).toBe(6))

      renderPipeline([fn1, fn2, fn3]).run(context, data, [filter1, filter2, filter3])

      expect(filter1).toHaveBeenCalledWith(context)
      expect(filter2).toHaveBeenCalledWith(context)
      expect(filter3).toHaveBeenCalledWith(context)
      expect(fn1).toHaveBeenCalledWith(context, data)
      expect(fn2).toHaveBeenCalledWith(context, data)
      expect(fn3).toHaveBeenCalledWith(context, data)
    })

    test('should not save context when no filters are supplied', () => {
      const fn = vi.fn()

      renderPipeline([fn]).run(context, data)

      expect(contextMock.save).not.toHaveBeenCalled()
    })

    test('should save context when filters are supplied', () => {
      const fn = vi.fn()
      const filter1 = vi.fn()
      const filter2 = vi.fn()

      renderPipeline([fn]).run(context, data, [filter1, filter2])

      expect(contextMock.save).toHaveBeenCalled()
    })

    test('should not restore context when no filters are supplied', () => {
      const fn = vi.fn()

      renderPipeline([fn]).run(context, data)

      expect(contextMock.restore).not.toHaveBeenCalled()
    })

    test('should restore context when filters are supplied', () => {
      const fn = vi.fn()
      const filter1 = vi.fn()
      const filter2 = vi.fn()

      renderPipeline([fn]).run(context, data, [filter1, filter2])

      expect(contextMock.restore).toHaveBeenCalled()
    })

    test('should not immediately call object functions', () => {
      const obj1 = { condition: vi.fn(), render: vi.fn() }
      const obj2 = { condition: vi.fn(), render: vi.fn() }
      const obj3 = { condition: vi.fn(), render: vi.fn() }

      renderPipeline([
        obj1,
        obj2,
        obj3
      ])

      expect(obj1.condition).not.toHaveBeenCalled()
      expect(obj1.render).not.toHaveBeenCalled()
      expect(obj2.condition).not.toHaveBeenCalled()
      expect(obj2.render).not.toHaveBeenCalled()
      expect(obj3.condition).not.toHaveBeenCalled()
      expect(obj3.render).not.toHaveBeenCalled()
    })

    test('should call object condition function when run is called', () => {
      const obj = { condition: vi.fn(), render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(obj.condition).toHaveBeenCalledWith(data)
    })

    test('should not call object render function when condition returns false', () => {
      const obj = { condition: vi.fn().mockReturnValue(false), render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(obj.render).not.toHaveBeenCalled()
    })

    test('should call object render function when condition returns true', () => {
      const obj = { condition: vi.fn().mockReturnValue(true), render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(obj.render).toHaveBeenCalledWith(context, data)
    })

    test('should call object functions sequentially when run is called', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj1 = { condition: vi.fn().mockReturnValue(true), render: fn1 }
      const obj2 = { condition: vi.fn().mockReturnValue(true), render: fn2 }
      const obj3 = { condition: vi.fn().mockReturnValue(true), render: fn3 }

      renderPipeline([
        obj1,
        obj2,
        obj3
      ]).run(context, data)

      expect(obj1.condition).toHaveBeenCalledWith(data)
      expect(obj1.render).toHaveBeenCalledWith(context, data)
      expect(obj2.condition).toHaveBeenCalledWith(data)
      expect(obj2.render).toHaveBeenCalledWith(context, data)
      expect(obj3.condition).toHaveBeenCalledWith(data)
      expect(obj3.render).toHaveBeenCalledWith(context, data)
    })

    test('should not call object render function when one condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(false)

      const obj = { condition: [condition1, condition2], render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(obj.render).not.toHaveBeenCalled()
    })

    test('should call object render function when all conditions return true', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(obj.render).toHaveBeenCalled()
    })

    test('should not call next condition when condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(false)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], render: vi.fn() }

      renderPipeline([obj]).run(context, data)

      expect(condition2).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when an array is supplied in object', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj = { condition: vi.fn().mockReturnValue(true), render: [fn1, fn2, fn3] }

      renderPipeline([obj]).run(context, data)

      expect(fn1).toHaveBeenCalledWith(context, data)
      expect(fn2).toHaveBeenCalledWith(context, data)
      expect(fn3).toHaveBeenCalledWith(context, data)
    })

    test('should call object filter condition function', () => {
      const obj = { condition: vi.fn(), filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(obj.condition).toHaveBeenCalledWith(data)
    })

    test('should not call object filter function when condition returns false', () => {
      const obj = { condition: vi.fn().mockReturnValue(false), filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(obj.filter).not.toHaveBeenCalled()
    })

    test('should call object filter function when condition returns true', () => {
      const obj = { condition: vi.fn().mockReturnValue(true), filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(obj.filter).toHaveBeenCalledWith(context)
    })

    test('should call object filter functions sequentially when run is called', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj1 = { condition: vi.fn().mockReturnValue(true), filter: fn1 }
      const obj2 = { condition: vi.fn().mockReturnValue(true), filter: fn2 }
      const obj3 = { condition: vi.fn().mockReturnValue(true), filter: fn3 }

      renderPipeline([vi.fn()]).run(context, data, [obj1, obj2, obj3])

      expect(obj1.condition).toHaveBeenCalledWith(data)
      expect(obj1.filter).toHaveBeenCalledWith(context)
      expect(obj2.condition).toHaveBeenCalledWith(data)
      expect(obj2.filter).toHaveBeenCalledWith(context)
      expect(obj3.condition).toHaveBeenCalledWith(data)
      expect(obj3.filter).toHaveBeenCalledWith(context)
    })

    test('should not call object filter function when one condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(false)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(obj.filter).not.toHaveBeenCalled()
    })

    test('should call object filter function when all conditions return true', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(obj.filter).toHaveBeenCalled()
    })

    test('should not call next condition when condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(false)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(condition2).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when an array is supplied in object', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj = { condition: vi.fn().mockReturnValue(true), filter: [fn1, fn2, fn3] }

      renderPipeline([vi.fn()]).run(context, data, [obj])

      expect(fn1).toHaveBeenCalledWith(context)
      expect(fn2).toHaveBeenCalledWith(context)
      expect(fn3).toHaveBeenCalledWith(context)
    })
  })

  describe('filterPipeline function', () => {
    let data: number
    let context: CanvasRenderingContext2D
    let contextMock: { save: Mock, restore: Mock }

    beforeEach(() => {
      data = 1
      contextMock = {
        save: vi.fn(),
        restore: vi.fn()
      }
      context = contextMock as unknown as CanvasRenderingContext2D
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    test('should not immediately call functions', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn()

      filterPipeline([
        fn1,
        fn2,
        fn3
      ])

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
      expect(fn3).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when run is called', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      filterPipeline([
        fn1,
        fn2,
        fn3
      ]).run(context, data)

      expect(fn1).toHaveBeenCalledWith(context)
      expect(fn2).toHaveBeenCalledWith(context)
      expect(fn3).toHaveBeenCalledWith(context)
    })

    test('should not immediately call object functions', () => {
      const obj1 = { condition: vi.fn(), filter: vi.fn() }
      const obj2 = { condition: vi.fn(), filter: vi.fn() }
      const obj3 = { condition: vi.fn(), filter: vi.fn() }

      filterPipeline([
        obj1,
        obj2,
        obj3
      ])

      expect(obj1.condition).not.toHaveBeenCalled()
      expect(obj1.filter).not.toHaveBeenCalled()
      expect(obj2.condition).not.toHaveBeenCalled()
      expect(obj2.filter).not.toHaveBeenCalled()
      expect(obj3.condition).not.toHaveBeenCalled()
      expect(obj3.filter).not.toHaveBeenCalled()
    })

    test('should call object condition function when run is called', () => {
      const obj = { condition: vi.fn(), filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(obj.condition).toHaveBeenCalledWith(data)
    })

    test('should not call object filter function when condition returns false', () => {
      const obj = { condition: vi.fn().mockReturnValue(false), filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(obj.filter).not.toHaveBeenCalled()
    })

    test('should call object filter function when condition returns true', () => {
      const obj = { condition: vi.fn().mockReturnValue(true), filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(obj.filter).toHaveBeenCalledWith(context)
    })

    test('should call object functions sequentially when run is called', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj1 = { condition: vi.fn().mockReturnValue(true), filter: fn1 }
      const obj2 = { condition: vi.fn().mockReturnValue(true), filter: fn2 }
      const obj3 = { condition: vi.fn().mockReturnValue(true), filter: fn3 }

      filterPipeline([
        obj1,
        obj2,
        obj3
      ]).run(context, data)

      expect(obj1.condition).toHaveBeenCalledWith(data)
      expect(obj1.filter).toHaveBeenCalledWith(context)
      expect(obj2.condition).toHaveBeenCalledWith(data)
      expect(obj2.filter).toHaveBeenCalledWith(context)
      expect(obj3.condition).toHaveBeenCalledWith(data)
      expect(obj3.filter).toHaveBeenCalledWith(context)
    })

    test('should not call object filter function when one condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(false)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(obj.filter).not.toHaveBeenCalled()
    })

    test('should call object filter function when all conditions return true', () => {
      const condition1 = vi.fn().mockReturnValue(true)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(obj.filter).toHaveBeenCalled()
    })

    test('should not call next condition when condition returns false', () => {
      const condition1 = vi.fn().mockReturnValue(false)
      const condition2 = vi.fn().mockReturnValue(true)

      const obj = { condition: [condition1, condition2], filter: vi.fn() }

      filterPipeline([obj]).run(context, data)

      expect(condition2).not.toHaveBeenCalled()
    })

    test('should call functions sequentially when an array is supplied in object', () => {
      let callCount = 0
      const fn1 = vi.fn(() => expect(++callCount).toBe(1))
      const fn2 = vi.fn(() => expect(++callCount).toBe(2))
      const fn3 = vi.fn(() => expect(++callCount).toBe(3))

      const obj = { condition: vi.fn().mockReturnValue(true), filter: [fn1, fn2, fn3] }

      filterPipeline([obj]).run(context, data)

      expect(fn1).toHaveBeenCalledWith(context)
      expect(fn2).toHaveBeenCalledWith(context)
      expect(fn3).toHaveBeenCalledWith(context)
    })
  })
})