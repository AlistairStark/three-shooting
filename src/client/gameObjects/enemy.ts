import * as THREE from 'three'
import { SceneManager } from '../scene'
import { NonPlayerObject } from './nonPlayerObject'

export class EnemyObject extends NonPlayerObject {
    constructor(x: number, y: number, sceneManager: SceneManager) {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        super(sceneManager, geometry, material, mesh)
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.boundingBox.setFromObject(this.mesh)
    }

    public updateFrame(): void {
        this.mesh.position.y += -0.1
        this.updateBoundingBoxPos()
    }
}
