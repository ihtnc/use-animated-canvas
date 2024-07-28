'use client'

import {
  type AnimatedCanvasConditionalRenderFunction,
  type AnimatedCanvasRenderFunction,
  Coordinates,
  filterWhen,
  renderWhen,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'
import { type PointerEventHandler } from 'react'

export default function MultiConditionalFilter() {
  const { isDarkMode } = useDarkMode()

  type PageData = {
    isClicked: boolean,
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
  let clicked: boolean
  let coordinates: Coordinates | undefined

  const isClicked: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => data?.data?.isClicked ?? false
  const isWithinBackground: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => {
    const current = data?.data?.coordinates ?? null
    const startHeight = data?.data?.backgroundStartHeight ?? -1
    const endHeight = data?.data?.backgroundEndHeight ?? -1
    const width = data?.data?.backgroundWidth ?? -1
    if (current === null) { return false }

    return current.x >= 0 && current.x < width
      && current.y >= startHeight && current.y < endHeight
  }
  const isWithinMain: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => {
    const current = data?.data?.coordinates ?? null
    const startHeight = data?.data?.mainStartHeight ?? -1
    const endHeight = data?.data?.mainEndHeight ?? -1
    const width = data?.data?.mainWidth ?? -1
    if (current === null) { return false }

    return current.x >= 0 && current.x < width
      && current.y >= startHeight && current.y < endHeight
  }
  const isWithinForeground: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => {
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
  }

  const flipFilter = (context: CanvasRenderingContext2D) => {
    context.translate(context.canvas.width, 0)
    context.scale(-1, 1)
  }

  const renderBackground = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#7B3F00'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Click', context.canvas.width / 2, 25)
  }

  const render = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#68CDFE'
    context.fillRect(0, context.canvas.height / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('To Reverse', context.canvas.width / 2, context.canvas.height / 2)
  }

  const renderForeground = (context: CanvasRenderingContext2D) => {
    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.fillRect(0, context.canvas.height * 2 / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Text', context.canvas.width / 2, context.canvas.height - 20)
  }

  const { Canvas } = use2dAnimatedCanvas<PageData>({
    preRenderTransform: (data) => {
      data.data = {
        isClicked: clicked,
        coordinates,
        backgroundStartHeight: 0,
        backgroundEndHeight: data.context.canvas.height / 3,
        backgroundWidth: data.context.canvas.width,
        mainStartHeight: data.context.canvas.height / 3,
        mainEndHeight: data.context.canvas.height * 2 / 3,
        mainWidth: data.context.canvas.width,
        foregroundStartHeight: data.context.canvas.height * 2 / 3,
        foregroundEndHeight: data.context.canvas.height,
        foregroundWidth: data.context.canvas.width,
      }

      return data
    },
    globalFilter,
    renderBackgroundFilter: filterWhen([isClicked, isWithinBackground], flipFilter),
    renderBackground,
    renderFilter: filterWhen([isClicked, isWithinMain], flipFilter),
    render,
    renderForegroundFilter: filterWhen([isClicked, isWithinForeground], flipFilter),
    renderForeground
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    coordinates = undefined
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    coordinates = { x, y }
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    coordinates = undefined
  }

  const code = `
    export default function MultiConditionalFilter() {
      type PageData = { isClicked: boolean, coordinates: Coordinates, ... }

      // will store the value for the current mouse position and click status
      let clicked: boolean
      let coordinates: Coordinates | undefined

      const isClicked = (data) => data?.data?.isClicked ?? false
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
        // set the line style, font, and text alignment
        //   for the entire canvas
      }
      const flipFilter = (context) => {
        // flip the canvas horizontally
      }

      const renderBackground = (context, data) => {
        // render instructions
      }
      const renderMain = (context, data) => {
        // render instructions
      }
      const renderForeground = (context, data) => {
        // render instructions
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        // globalFilter also supports filterWhen functions with multiple conditions
        globalFilter,

        preRenderTransform: (data) => {
          // set the data to the current value of the clicked, coordinates, and the area of each layer
          return data
        },

        // notice that an array of condition functions can be specified
        //   on the filterWhen function instead of a single one
        // condition functions are evaluated in the order that they appear in the array
        // the associated filter function will only be called if all condition functions return true
        // the idea of multiple conditions in the filterWhen function is to further separate the filtering logic
        //   this makes it easier to manage complex rules

        renderBackgroundFilter: filterWhen([isClicked, isWithinBackground], flipFilter),
        renderBackground,
        renderFilter: filterWhen([isClicked, isWithinMain], flipFilter),
        render,
        renderForegroundFilter: filterWhen([isClicked, isWithinForeground], flipFilter),
        renderForeground
      })

      const onPointerEnterHandler = (event) => {
        // reset clicked and coordinates values
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set coordinates to the x and y values
      }
      const onPointerDownHandler = (event) => {
        // set clicked to true
      }
      const onPointerUpHandler = (event) => {
        // set clicked to false
      }
      const onPointerOutHandler = (event) => {
        // reset clicked and coordinates values
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
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
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
