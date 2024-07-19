export const requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return window.requestAnimationFrame(callback)
}

export const cancelAnimationFrame = (handle: number): void => {
  window.cancelAnimationFrame(handle)
}

export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio || 1
}
