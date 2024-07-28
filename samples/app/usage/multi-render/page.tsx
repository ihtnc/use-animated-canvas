'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

const getDate = (date?: Date) => {
  const month = date?.getMonth() ?? -1
  const day = date?.getDate() ?? -1
  switch (month) {
    case 0: return `${day} January`
    case 1: return `${day} February`
    case 2: return `${day} March`
    case 3: return `${day} April`
    case 4: return `${day} May`
    case 5: return `${day} June`
    case 6: return `${day} July`
    case 7: return `${day} August`
    case 8: return `${day} September`
    case 9: return `${day} October`
    case 10: return `${day} November`
    case 11: return `${day} December`
    default: return 'Date'
  }
}

const getWeekday = (date?: Date) => {
  const day = date?.getDay() ?? -1
  switch (day) {
    case 0: return 'Sunday'
    case 1: return 'Monday'
    case 2: return 'Tuesday'
    case 3: return 'Wednesday'
    case 4: return 'Thursday'
    case 5: return 'Friday'
    case 6: return 'Saturday'
    default: return 'Weekday'
  }
}

export default function MultiRender() {
  const { isDarkMode } = useDarkMode()

  const renderClockBase: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.fillStyle = '#7B3F00'
    context.fillRect(context.canvas.width / 6, context.canvas.height / 6, context.canvas.width * 2 / 3, context.canvas.height * 2 / 3)
    context.restore()
  }

  const renderHourHand: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const hour = (data?.data?.getHours() ?? 0 % 12)
    const hourDegree = (360 / 12 * hour) - 90

    context.fillStyle = '#808080'
    context.rotate(hourDegree * Math.PI / 180)
    context.fillRect(-3, -3, context.canvas.width / 4, 6)
    context.restore()
  }

  const renderMinuteHand: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const minute = data?.data?.getMinutes() ?? 0
    const minuteDegree = (360 / 60 * minute) - 90

    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.rotate(minuteDegree * Math.PI / 180)
    context.moveTo(-3, -3)
    context.lineTo(-3, 3)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderSecondHand: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const second = data?.data?.getSeconds() ?? 0
    const secondDegree = (360 / 60 * second) - 90

    context.fillStyle = '#FFBF00'
    context.rotate(secondDegree * Math.PI / 180)
    context.moveTo(-1, -1)
    context.lineTo(-1, 1)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderWeekday: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    const day = getWeekday(data?.data)

    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'top'
    context.fillText(day, context.canvas.width / 2, 5)
  }

  const renderDate: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    const day = getDate(data?.data)

    context.fillStyle = '#FFBF00'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.fillText(day, context.canvas.width / 2, context.canvas.height * 0.75)
  }

  const { Canvas } = use2dAnimatedCanvas<Date>({
    preRenderTransform: (data) => {
      data.data = new Date()
      return data
    },
    renderBackground: renderWeekday,
    render: [
      renderClockBase,
      renderHourHand,
      renderMinuteHand,
      renderSecondHand
    ],
    renderForeground: [renderDate]
  })

  const code = `
    export default function MultiRender() {
      // since an array of render functions can be used instead of a single render function,
      //   render functions can then focus on just rendering a specific object in their respective layers
      const renderClockBase = (context, data) => {
        // render the base of the clock
      }
      const renderHourHand = (context, data) => {
        // render the hour hand of the clock
      }
      const renderMinuteHand = (context, data) => {
        // render the minute hand of the clock
      }
      const renderSecondHand = (context, data) => {
        // render the second hand of the clock
      }
      const renderWeekday = (context, data) => {
        // render the day of the week
      }
      const renderDate = (context, data) => {
        // render the date
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        preRenderTransform: (data) => {
          // set the data to the current date
          return data
        },

        // renderBackground can also be an array of render functions
        renderBackground: renderWeekday,

        // notice that an array of render functions can be specified
        //   instead of a single one
        // the order in which they are specified in the array
        //   is the order in which they will be called
        // the idea here is to separate the rendering of different objects in the same layer
        //   this makes it easier to manage the rendering of different objects
        //   and also makes the rendering logic more modular and more straightforward
        // context is persisted across all render functions in the same layer
        //   as this is like calling all these render functions from one big render function
        // nevertheless, each render function can opt to save and restore the context
        //   to prevent the changes it made from persisting to succeeding functions
        render: [
          renderClockBase,
          renderHourHand,
          renderMinuteHand,
          renderSecondHand
        ],

        // this is essentially the same as
        //   "renderForeground: renderDate"
        renderForeground: [renderDate]
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
