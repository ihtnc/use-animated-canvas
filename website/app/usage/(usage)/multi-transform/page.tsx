'use client'

import {
  type AnimatedCanvasRenderFilterFunction,
  type AnimatedCanvasRenderFunction,
  type AnimatedCanvasTransformFunction,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function MultiTransform() {
  type PageData = {
    gridWidth: number
    horizontalDashLength: number
    horizontalDashOffset: number
    gridHeight: number
    verticalDashLength: number
    verticalDashOffset: number
  }

  let isDarkMode: boolean = false

  const setHorizontalDashOffset: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const frame = data.drawData.frame
    const dashLength = data.data.horizontalDashLength * 2

    data.data.horizontalDashOffset = -(frame % dashLength)

    return data
  }

  const setVerticalDashOffset: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const frame = data.drawData.frame
    const dashLength = data.data.verticalDashLength * 2

    data.data.verticalDashOffset = -(frame % dashLength)

    return data
  }

  const setHorizontalWidth: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.gridWidth = 10 + 10 * Math.sin(data.drawData.frame * 0.05)**2

    return data
  }

  const setVerticalHeight: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.gridHeight = 5 + 10 * Math.sin(data.drawData.frame * 0.05)**2

    return data
  }

  const globalFilter: AnimatedCanvasRenderFilterFunction = (context) => {
    context.strokeStyle = isDarkMode ? '#E5E7EB' : '#000000'
  }

  const render: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const width = data.data.gridWidth
    const horizontalDashLength = data.data.horizontalDashLength
    const horizontalDashOffset = data.data.horizontalDashOffset
    const height = data.data.gridHeight
    const verticalDashLength = data.data.verticalDashLength
    const verticalDashOffset = data.data.verticalDashOffset

    for(let i = 0; i < context.canvas.width; i+=width) {
      context.beginPath()
      context.moveTo(i, 0)
      context.lineTo(i, context.canvas.height)
      context.lineDashOffset = horizontalDashOffset
      context.setLineDash([horizontalDashLength])
      context.stroke()
    }

    for(let i = 0; i < context.canvas.height; i+=height) {
      context.beginPath()
      context.moveTo(0, i)
      context.lineTo(context.canvas.width, i)
      context.lineDashOffset = verticalDashOffset
      context.setLineDash([verticalDashLength])
      context.stroke()
    }
  }

  const { Canvas } = use2dAnimatedCanvas<PageData>({
    initialiseData: () => ({
      gridWidth: 20,
      horizontalDashLength: 20,
      horizontalDashOffset: 0,
      gridHeight: 15,
      verticalDashLength: 30,
      verticalDashOffset: 5
    }),
    globalFilter,
    preRenderTransform: [
      (data) => {
        isDarkMode = data.drawData.isDarkMode
        return data
      },
      setHorizontalDashOffset,
      setVerticalDashOffset
    ],
    render,
    postRenderTransform: [setHorizontalWidth, setVerticalHeight]
  })

  const code = `
    export default function MultiTransform() {
      type PageData = {
        gridWidth: number
        horizontalDashLength: number
        horizontalDashOffset: number
        ...
      }

      // since an array of data transformation functions can be used instead of a single one,
      //   transformation functions can then focus on
      //   just transforming a specific property in the data object
      // this makes the functions more modular and more straightforward
      const setHorizontalDashOffset = (data) => {
        // set the dash offset for the horizontal grid lines
        return data
      }
      const setVerticalDashOffset = (data) => {
        // set the dash offset for the vertical grid lines
        return data
      }
      const setHorizontalWidth = (data) => {
        // set the spaces between the horizontal grid lines
        return data
      }
      const setVerticalHeight = (data) => {
        // set the spaces between the vertical grid lines
        return data
      }

      const globalFilter = (context) => {
        // set the line color for the entire canvas
      }

      const render = (context, data) => {
        // render the horizontal and vertical grid lines
        //   with the specified spaces and dash offsets
        //   as specified in the data
      }

      const { Canvas } = use2dAnimatedCanvas<PageData>({
        initialiseData: () => {
          // set the initial data
        },
        globalFilter,

        // notice that an array of data transformation functions can be specified
        //   instead of a single one
        // the order in which they are specified in the array
        //   is the order in which they will be called
        // the idea here is to separate the transformation of values
        //   on the same data structure
        // this makes it easier to manage the transformation of the data
        //   and also makes the transformation logic more modular and more straightforward
        // the state of the data is persisted across all transformation functions
        //   as this is like calling all these transformation functions one after another
        //   and passing the data returned from one function to the next function
        preRenderTransform: [setHorizontalDashOffset, setVerticalDashOffset],
        render,
        postRenderTransform: [setHorizontalWidth, setVerticalHeight]
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
