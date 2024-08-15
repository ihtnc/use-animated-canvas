[![build](https://img.shields.io/github/actions/workflow/status/ihtnc/use-animated-canvas/build-package.yml?label=build&logo=github+actions&logoColor=white)](https://github.com/ihtnc/use-animated-canvas/actions/workflows/build-package.yml)
[![deploy](https://img.shields.io/github/actions/workflow/status/ihtnc/use-animated-canvas/publish-package.yml?label=deploy&logo=github+actions&logoColor=white)](https://github.com/ihtnc/use-animated-canvas/actions/workflows/publish-package.yml)
[![npm](https://img.shields.io/npm/v/@ihtnc/use-animated-canvas?logo=npm)](https://www.npmjs.com/package/@ihtnc/use-animated-canvas)
[![website](https://img.shields.io/badge/website-view-blue?logo=github)](https://ihtnc.github.io/use-animated-canvas)
[![releases](https://img.shields.io/badge/releases-view-blue?logo=github)](https://github.com/ihtnc/use-animated-canvas/releases)

#### Release Notes (v1.0.10)
* **BREAKING** Renamed renderContinue to renderStart
* **FEATURE** Added isDarkMode to data parameter in initialiseData handler
* **FEATURE** Updated internal render loop to call initialisation handlers only when loop is actually started
* **FEATURE** Added separate internal controls for pausing the render loop
* **FEATURE** Delayed initial render until a resize of the internal canvas has happened
* **FIX** Handled invalid condition evaluation value on data transformation/render/filter conditional functions
* **FIX** Made internal canvas event handlers assignment explicit
* Various code refactoring / streamlining

Previous release notes are available [here](https://github.com/ihtnc/use-animated-canvas/releases).

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
  const { Canvas } = use2dAnimatedCanvas({
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
More usage examples are available [here](https://ihtnc.github.io/use-animated-canvas/usage).
