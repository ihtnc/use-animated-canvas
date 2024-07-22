'use client'

import { AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Data() {
  const render: AnimatedCanvasRenderFunction<string> = (context, data) => {
    if (data?.data === undefined) { return }

    context.fillStyle = '#000000'
    context.font = '20px Arial'
    context.textAlign = 'center'
    context.fillText(data.data, context.canvas.width / 2, context.canvas.height / 2)
  }

  const { Canvas } = use2dAnimatedCanvas({ render }, 'text')

  const code = `
    export default function Data() {
      const render: AnimatedCanvasRenderFunction<string> = (context, data) => {
        // render the data in the center of the canvas
      }

      // pass 'text' as the initial data for use2dAnimatedCanvas
      const { Canvas } = use2dAnimatedCanvas({ render }, 'text')

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
