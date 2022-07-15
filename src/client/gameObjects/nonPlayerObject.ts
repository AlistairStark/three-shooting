import * as THREE from 'three'
import { GameObject } from '.'
import { SceneManager } from '../scene'

export abstract class NonPlayerObject implements GameObject {
    sceneManager: SceneManager
    geometry: THREE.BoxGeometry
    material: THREE.Material
    mesh: THREE.Mesh
    boundingBox: THREE.Box3
    hasEnteredScene: boolean = false

    constructor(
        sceneManager: SceneManager,
        geometry: THREE.BoxGeometry,
        material: THREE.Material,
        mesh: THREE.Mesh
    ) {
        this.sceneManager = sceneManager
        this.geometry = geometry
        this.material = material
        this.mesh = mesh
        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.boundingBox.setFromObject(this.mesh)
    }

    abstract updateFrame(): void

    updateBoundingBoxPos() {
        this.boundingBox
            .copy(this.mesh.geometry.boundingBox as THREE.Box3)
            .applyMatrix4(this.mesh.matrixWorld)
    }

    public destroy(): void {
        this.geometry.dispose()
        this.material.dispose()
        this.mesh.geometry.dispose()
        this.sceneManager.scene.remove(this.mesh)
        this.mesh.userData.removed = true
        this.mesh.remove()
    }
}
