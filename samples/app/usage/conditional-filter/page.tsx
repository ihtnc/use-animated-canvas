'use client'

import {
  type AnimatedCanvasConditionalRenderFunction,
  filterWhen,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function ConditionalFilter() {
  const { isDarkMode } = useDarkMode()

  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.textAlign = 'center'
    context.globalAlpha = 0.5
    context.font = '20px Arial'
    context.strokeStyle = isDarkMode ? '#FFBF00' : '#E5E7EB'
  }

  const highlightFilter = (context: CanvasRenderingContext2D) => {
    context.globalAlpha = 1
  }

  const has1SecondElapsed: AnimatedCanvasConditionalRenderFunction<Date> = (data) => {
    const seconds = data?.data?.getSeconds() ?? 0
    return seconds % 3 == 0
  }

  const has2SecondsElapsed: AnimatedCanvasConditionalRenderFunction<Date> = (data) => {
    const seconds = data?.data?.getSeconds() ?? 0
    return seconds % 3 == 1
  }

  const has3SecondsElapsed: AnimatedCanvasConditionalRenderFunction<Date> = (data) => {
    const seconds = data?.data?.getSeconds() ?? 0
    return seconds % 3 == 2
  }

  const renderBackground = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#7B3F00'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Background', context.canvas.width / 2, 25)
  }

  const render = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#68CDFE'
    context.fillRect(0, context.canvas.height / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Main', context.canvas.width / 2, context.canvas.height / 2)
  }

  const renderForeground = (context: CanvasRenderingContext2D) => {
    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.fillRect(0, context.canvas.height * 2 / 3, context.canvas.width, context.canvas.height / 3)
    context.strokeText('Foreground', context.canvas.width / 2, context.canvas.height - 20)
  }

  const { Canvas } = use2dAnimatedCanvas<Date>({
    preRenderTransform: (data) => {
      data.data = new Date()
      return data
    },
    globalFilter,
    renderBackgroundFilter: filterWhen(has1SecondElapsed, highlightFilter),
    renderBackground,
    renderFilter: filterWhen(has2SecondsElapsed, highlightFilter),
    render,
    renderForegroundFilter: filterWhen(has3SecondsElapsed, highlightFilter),
    renderForeground
  })

  const code = `
    export default function ConditionalFilter() {
      const has1SecondElapsed = (data) => {
        // return true if 1 second has elapsed
      }
      const has2SecondsElapsed = (data) => {
        // return true if 2 seconds has elapsed
      }
      const has3SecondsElapsed = (data) => {
        // return true if 3 seconds has elapsed
      }

      const globalFilter = (context) => {
        // set the line style, font, opacity and text alignment
        //   for the entire canvas
      }
      const highlightFilter = (context) => {
        // set the opacity more than the global filter
      }

      const renderBackground = (context) => {
        // render the background text and color
      }
      const render = (context) => {
        // render the main text and color
      }
      const renderForeground = (context) => {
        // render the foreground text and color
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        preRenderTransform: (data) => {
          // set the data to the current date
          return data
        },

        // globalFilter also supports conditional filter functions
        globalFilter,

        // notice that filter functions or conditional filter functions can be used
        // conditional filter functions are nothing but functions
        //   that returns an object with a filter function and a condition function
        // the filter function in the object will only be called if the corresponding condition function returns true
        //   the condition function will be passed the same data used by render functions
        // the idea of the conditional filter function is to apply logic when rendering filters
        //   this makes filters more flexible
        // the library exposes the filterWhen conditional filter function
        //   which accepts the condition function and the actual filter function
        //   to help facilitate the creation of the object

        renderBackgroundFilter: filterWhen(has5SecondsElapsed, highlightFilter),
        renderBackground,

        renderFilter: filterWhen(has10SecondsElapsed, highlightFilter),
        render,

        renderForegroundFilter: filterWhen(has15SecondsElapsed, highlightFilter),
        renderForeground
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
