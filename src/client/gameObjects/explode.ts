import * as THREE from 'three'
import { NonPlayerObject } from './nonPlayerObject'

export class Explode {
    geometry: THREE.BufferGeometry
    posArray: Float32Array
    material: THREE.PointsMaterial
    outline: THREE.Points
    particlesMesh: THREE.Points

    constructor(gameObject: NonPlayerObject) {
        this.geometry = new THREE.BufferGeometry()
        const count = 5
        this.posArray = new Float32Array(count * 3)
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.posArray, 3))
        this.material = new THREE.PointsMaterial({ size: 0.0005 })
        this.outline = new THREE.Points(gameObject.geometry, this.material)
        this.particlesMesh = new THREE.Points(this.geometry, this.material)
    }

    public updatePosition() {
        // console.log('POS ARRAY:', this.posArray)
        // this.posArray.set([Math.random() * 20, Math.random() * 20, Math.random() * 20])
        // this.geometry.setAttribute('position', new THREE.BufferAttribute(this.posArray, 3))
        this.particlesMesh.position.x += 1
        this.particlesMesh.position.y += 1
    }
}
