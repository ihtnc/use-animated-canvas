'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function BasicEvents() {
  let pressedKey: string

  const initialiseData = () => ''

  const renderBackground: AnimatedCanvasRenderFunction<string> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Press a key', 5, 5)
    context.fillText('when component', 5, 25)
    context.fillText('has focus', 5, 45)
  }

  const render: AnimatedCanvasRenderFunction<string> = (context, data) => {
    const current = data?.data ?? ''
    if (current.trim().length === 0) { return }

    context.fillStyle = data.drawData.isDarkMode ? '#68CDFE' : '#000000'
    context.font = '20px Arial'
    context.textAlign = 'center'
    context.fillText(current, context.canvas.width / 2, context.canvas.height / 2)
  }

  const { Canvas } = use2dAnimatedCanvas<string>({
    initialiseData,
    preRenderTransform: (data) => {
      data.data = pressedKey
      return data
    },
    renderBackground,
    render
  })

  const onKeyDownHandler = (event: KeyboardEvent) => {
    pressedKey = event.key
  }

  const onKeyUpHandler = (event: KeyboardEvent) => {
    pressedKey = ''
  }

  const onBlurHandler = (event: FocusEvent) => {
    pressedKey = ''
  }

  const code = `
    export default function BasicEvents() {
      // will store the currently pressed key
      let pressedKey: string

      const initialiseData = () => ''

      const renderBackground = (context, data) => {
        // render instructions in the top left corner
      }
      const render = (context, data) => {
        // render the data (pressed key) in the center of the canvas
      }

      const { Canvas } = use2dAnimatedCanvas<string>({
        initialiseData,
        preRenderTransform: (data) => {
          // update the data with the pressedKey value
          return data
        },
        renderBackground,
        render
      })

      // the idea here is to let the render functions
      //   focus on rendering objects on the canvas based on a set of data
      // external factors (like keypress events), can then update the data
      // these changes on the data are fed back to the render functions
      //   via the transform functions
      // this makes the responsibilities of both the render functions
      //   and the event handlers more defined and straightforward
      const onKeyDownHandler = (event) => {
        // update the pressedKey value on key press while component has focus
        pressedKey = event.key
      }
      const onKeyUpHandler = (event) => {
        // clear the pressedKey value on key release while component has focus
        pressedKey = ''
      }
      const onBlurHandler = (event) => {
        // clear the pressedKey value when the component loses focus
        pressedKey = ''
      }

      return <Canvas
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onBlur={onBlurHandler}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas
        className='w-full h-full border border-black dark:border-gray-300'
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onBlur={onBlurHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
