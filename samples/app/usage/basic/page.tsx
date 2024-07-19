'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import menu from './menu-item'

export default function Basic() {
  hljs.registerLanguage('typescript', typescript)

  const { Canvas } = use2dAnimatedCanvas({
    render: (context, data) => {
      const frame = data?.frame ?? 0
      context.fillStyle = '#000000'
      context.beginPath()
      context.arc(50, 50, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    }
  })

  const highlighted = hljs.highlight(`
    export default function Basic() {
      const { Canvas } = use2dAnimatedCanvas({
        render: (context, data) => {
          // this function gets called every frame
          // draw a circle that grows/shrinks a little bit every frame
        }
      })

      return <Canvas />
    }
  `, { language: 'typescript' })


  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black' />
    </div>
    <h3 className='text-xl font-semibold'>Code</h3>
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
    </pre>
  </>)
}
