import { SceneManager } from '../scene'
import * as THREE from 'three'
export * from './player'
export * from './enemy'

export interface GameObject {
    mesh: THREE.Mesh
    boundingBox: THREE.Box3
    sceneManager: SceneManager
    hasEnteredScene: boolean
    updateFrame(): void
    destroy(): void
}
