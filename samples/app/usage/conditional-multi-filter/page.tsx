'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  Coordinates,
  filterWhen,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'

export default function ConditionalMultiFilter() {
  type PageData = {
    coordinates?: Coordinates,
    backgroundStartHeight: number,
    backgroundEndHeight: number,
    backgroundWidth: number,
    mainStartHeight: number,
    mainEndHeight: number,
    mainWidth: number,
    foregroundStartHeight: number,
    foregroundEndHeight: number,
    foregroundWidth: number
  }

  let isDarkMode: boolean = false
  let coordinates: Coordinates | undefined

  const isWithinBackground: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    const current = data?.data?.coordinates ?? null
    const startHeight = data?.data?.backgroundStartHeight ?? -1
    const endHeight = data?.data?.backgroundEndHeight ?? -1
    const width = data?.data?.backgroundWidth ?? -1
    if (current === null) { return false }

    return current.x >= 0 && current.x < width
      && current.y >= startHeight && current.y < endHeight
  }
  const isWithinMain: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    const current = data?.data?.coordinates ?? null
    const startHeight = data?.data?.mainStartHeight ?? -1
    const endHeight = data?.data?.mainEndHeight ?? -1
    const width = data?.data?.mainWidth ?? -1
    if (current === null) { return false }

    return current.x >= 0 && current.x < width
      && current.y >= startHeight && current.y < endHeight
  }
  const isWithinForeground: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    const current = data?.data?.coordinates ?? null
    const startHeight = data?.data?.foregroundStartHeight ?? -1
    const endHeight = data?.data?.foregroundEndHeight ?? -1
    const width = data?.data?.foregroundWidth ?? -1
    if (current === null) { return false }

    return current.x >= 0 && current.x < width
      && current.y >= startHeight && current.y < endHeight
  }

  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.textAlign = 'center'
    context.font = '20px Arial'
    context.strokeStyle = isDarkMode ? '#FFBF00' : '#E5E7EB'
    context.filter = 'blur(1px)'
  }

  const clearFilter = (context: CanvasRenderingContext2D) => {
    context.filter = 'none'
  }

  const fontFilter = (context: CanvasRenderingContext2D) => {
    context.font = '25px Arial'
  }

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context) => {
    context.fillStyle = '#7B3F00'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Hover', context.canvas.width / 2, 25)
  }

  const render: AnimatedCanvasRenderFunction<PageData> = (context) => {
    context.fillStyle = '#68CDFE'
    context.fillRect(0, context.canvas.height / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Over', context.canvas.width / 2, context.canvas.height / 2)
  }

  const renderForeground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.fillRect(0, context.canvas.height * 2 / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Us', context.canvas.width / 2, context.canvas.height - 20)
  }

  const { Canvas } = use2dAnimatedCanvas<PageData>({
    preRenderTransform: (data) => {
      isDarkMode = data.drawData.isDarkMode

      data.data = {
        coordinates,
        backgroundStartHeight: 0,
        backgroundEndHeight: data.drawData.height / 3,
        backgroundWidth: data.drawData.width,
        mainStartHeight: data.drawData.height / 3,
        mainEndHeight: data.drawData.height * 2 / 3,
        mainWidth: data.drawData.width,
        foregroundStartHeight: data.drawData.height * 2 / 3,
        foregroundEndHeight: data.drawData.height,
        foregroundWidth: data.drawData.width,
      }

      return data
    },
    globalFilter,
    renderBackgroundFilter: filterWhen(isWithinBackground, [clearFilter, fontFilter]),
    renderBackground,
    renderFilter: filterWhen(isWithinMain, [clearFilter, fontFilter]),
    render,
    renderForegroundFilter: filterWhen(isWithinForeground, [clearFilter, fontFilter]),
    renderForeground
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    coordinates = undefined
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    coordinates = { x, y }
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    coordinates = undefined
  }

  const code = `
    export default function ConditionalMultiFilter() {
      type PageData = { coordinates: Coordinates, ... }

      // will store the value for the current mouse position
      let coordinates: Coordinates | undefined

      const isWithinBackground = (data) => {
        // return true if coordinates are within the background area
      }
      const isWithinMain = (data) => {
        // return true if coordinates are within the main area
      }
      const isWithinForeground = (data) => {
        // return true if coordinates are within the foreground area
      }

      const globalFilter = (context) => {
        // set the blur, line style, font, and text alignment
        //   for the entire canvas
      }
      const clearFilter = (context) => {
        // remove the blur on the canvas
      }
      const fontFilter = (context) => {
        // set the font size for the canvas
      }

      const renderBackground = (context, data) => {
        // render instructions
      }
      const render = (context, data) => {
        // render instructions
      }
      const renderForeground = (context, data) => {
        // render instructions
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        // globalFilter also supports filterWhen functions with multiple filter functions
        globalFilter,

        preRenderTransform: (data) => {
          // set the data to the current value of the clicked, coordinates,
          //   and the area of each layer
          return data
        },

        // notice that an array of filter functions can be specified
        //   on the filterWhen function instead of a single one
        // filter functions functions are called in the order that they appear in the array
        // these filter functions will only be called if the condition function returns true
        // the idea of multiple filter functions in the filterWhen function
        //   is to further separate the actual filtering operation
        //   this makes the filter functions more modular and more straightforward

        renderBackgroundFilter: filterWhen(isWithinBackground, [clearFilter, fontFilter]),
        renderBackground,
        renderFilter: filterWhen(isWithinBackground, [clearFilter, fontFilter]),
        render,
        renderForegroundFilter: filterWhen(isWithinBackground, [clearFilter, fontFilter]),
        renderForeground
      })

      const onPointerEnterHandler = (event) => {
        // reset coordinates values
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set coordinates to the x and y values
      }
      const onPointerOutHandler = (event) => {
        // reset coordinates values
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerOut={onPointerOutHandler}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas
        className='w-full h-full border border-black dark:border-gray-300'
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
