'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function Debugging() {
  const { isDarkMode } = useDarkMode()

  const { Canvas, debug } = use2dAnimatedCanvas({
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderForeground: (context) => {
      context.fillStyle = isDarkMode ? '#7B3F00' : '#000000'
      context.font = '15px Arial'
      context.textBaseline = 'top'
      context.fillText('s = start render', 5, 5)
      context.fillText('p = pause render', 5, 25)
      context.fillText('n = next frame', 5, 45)
    },
    options: {
      enableDebug: true
    }
  })

  const code = `
    export default function Debugging() {
      // use2dAnimatedCanvas also returns a debug object
      //   that exposes various functions for controling the rendering process
      const { Canvas, debug } = use2dAnimatedCanvas({
        render: (context, data) => {
          // render a circle that grows/shrinks a little bit every frame
        },
        renderForeground: (context, data) => {
          // render instructions in the top left corner
        },
        options: {
          // functions in the debug object will only work when this is set to true
          enableDebug: true
        }
      })

      const onKeyUpHandler = (event: KeyboardEvent) => {
        // check the pressed key and call the appropriate function from the debug object
        // call debug.renderContinue() to continue rendering
        // call debug.renderBreak() to pause rendering of the next frame
        // call debug.renderStep() to render a single frame then pause
        // because of the render loop, it can be hard to troubleshoot animations
        // these debug methods are provided to aid troubleshoot specific frames
      }

      return <Canvas onKeyUp={onKeyUpHandler} />
    }
  `

  const onKeyUpHandler = (event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 's':
        debug.renderContinue()
        break
      case 'p':
        debug.renderBreak()
        break
      case 'n':
        debug.renderStep()
        break
    }
  }

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onKeyUp={onKeyUpHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
