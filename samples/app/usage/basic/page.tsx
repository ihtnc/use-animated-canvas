'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Basic() {
  const { Canvas } = use2dAnimatedCanvas({
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#000000'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    }
  })

  const code = `
    export default function Basic() {
      const { Canvas } = use2dAnimatedCanvas({
        render: (context, data) => {
          // this function gets called every frame
          // draw a circle that grows/shrinks a little bit every frame
        }
      })

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
