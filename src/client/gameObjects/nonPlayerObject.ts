import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { GameObject } from '.'
import { SceneManager } from '../scene'

export abstract class NonPlayerObject implements GameObject {
    sceneManager: SceneManager
    geometry: THREE.BoxGeometry | TextGeometry
    material: THREE.Material | THREE.MeshPhongMaterial
    mesh: THREE.Mesh
    boundingBox: THREE.Box3
    hasEnteredScene: boolean = false

    constructor(
        sceneManager: SceneManager,
        geometry: THREE.BoxBufferGeometry | TextGeometry,
        material: THREE.Material | THREE.MeshPhongMaterial,
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

    public set removed(removed: boolean) {
        this.mesh.userData.removed = removed
    }

    public get removed(): boolean {
        return !!this.mesh.userData.removed
    }

    public updateBoundingBoxPos() {
        this.boundingBox
            .copy(this.mesh.geometry.boundingBox as THREE.Box3)
            .applyMatrix4(this.mesh.matrixWorld)
    }

    public destroy(): void {
        // const particleGeometry = new THREE.BufferGeometry()
        // const count = 1
        // const posArray = new Float32Array(count * 3)
        // particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
        // const material = new THREE.PointsMaterial({ size: 0.0005 })
        // const sphere = new THREE.Points(this.geometry, material)
        // const particlesMesh = new THREE.Points(particleGeometry, material)
        // this.sceneManager.scene.add(sphere, particlesMesh)
        this.geometry.dispose()
        this.material.dispose()
        this.mesh.geometry.dispose()
        this.sceneManager.scene.remove(this.mesh)
        this.removed = true
        this.mesh.remove()
    }
}
