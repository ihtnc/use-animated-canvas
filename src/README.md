![build](https://github.com/ihtnc/use-animated-canvas/actions/workflows/build-package.yml/badge.svg)
![publish](https://github.com/ihtnc/use-animated-canvas/actions/workflows/publish-package.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@ihtnc%2Fuse-animated-canvas.svg)](https://badge.fury.io/js/@ihtnc%2Fuse-animated-canvas)

### Use Animated Canvas

A React hook to create a canvas element with a built-in render loop. Useful for creating animations, games, and other interactive graphics.

#### Installation

```console
npm install @ihtnc/use-animated-canvas
```

#### Usage

```jsx
import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'

const App = () => {
  const canvasRef = use2dAnimatedCanvas({
    render: (context, data) => {
      // this function gets called every frame
      // use context to draw on the canvas
      // use data to access details like frame count, fps, etc
      // data can also include a user-defined value if supplied
    }
  })

  return <Canvas />
};
```

More usage examples are available in the [docs](https://ihtnc.github.io/use-animated-canvas/).