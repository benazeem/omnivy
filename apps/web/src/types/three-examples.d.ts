declare module 'three/examples/jsm/environments/RoomEnvironment' {
  import * as THREE from 'three'
  // RoomEnvironment is used with PMREM.fromScene which expects a Scene
  export class RoomEnvironment extends THREE.Scene {}
}

declare module 'three/examples/jsm/loaders/RGBELoader' {
  import * as THREE from 'three'
  export class RGBELoader extends THREE.Loader {
    load(url: string, onLoad: (texture: THREE.DataTexture) => void): void
  }
  export default RGBELoader
}
