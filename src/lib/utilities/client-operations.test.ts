import { Mock, MockInstance, afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  requestAnimationFrame,
  cancelAnimationFrame,
  getDevicePixelRatio
} from './client-operations'

describe('client operations', () => {
  describe('requestAnimationFrame function', () => {
    let requestAnimationFrameMock: Mock

    beforeEach(() => {
      requestAnimationFrameMock = vi.fn()
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(requestAnimationFrameMock)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('should call window.requestAnimationFrame', () => {
      const callback = vi.fn()

      requestAnimationFrame(callback)

      expect(requestAnimationFrameMock).toHaveBeenCalledWith(callback)
    })

    test('should return the handle from window.requestAnimationFrame', () => {
      const handle = 123

      requestAnimationFrameMock.mockReturnValue(handle)

      const result = requestAnimationFrame(vi.fn())

      expect(result).toBe(handle)
    })
  })

  describe('cancelAnimationFrame', () => {
    let cancelAnimationFrameMock: Mock

    beforeEach(() => {
      cancelAnimationFrameMock = vi.fn()
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelAnimationFrameMock)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('should call window.cancelAnimationFrame', () => {
      const handle = 123

      cancelAnimationFrame(handle)

      expect(cancelAnimationFrameMock).toHaveBeenCalledWith(handle)
    })
  })

  describe('getDevicePixelRatio', () => {
    let devicePixelRatioMock: MockInstance

    beforeEach(() => {
      devicePixelRatioMock = vi.spyOn(window, 'devicePixelRatio', 'get')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('should return the device pixel ratio', () => {
      const devicePixelRatio = 2
      devicePixelRatioMock.mockReturnValue(devicePixelRatio)

      const result = getDevicePixelRatio()

      expect(result).toBe(devicePixelRatio)
    })

    test('should return 1 if device pixel ratio is 0', () => {
      devicePixelRatioMock.mockReturnValue(0)

      const result = getDevicePixelRatio()

      expect(result).toBe(1)
    })
  })
})
