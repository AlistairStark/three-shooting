import * as THREE from 'three'
import { SceneManager } from '../scene'
import { NonPlayerObject } from './nonPlayerObject'

export class Projectile extends NonPlayerObject {
    constructor(
        x: number,
        y: number,
        sceneManager: SceneManager,
        geometry: THREE.BoxGeometry,
        material: THREE.MeshBasicMaterial,
        mesh: THREE.Mesh
    ) {
        super(sceneManager, geometry, material, mesh)
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.boundingBox.setFromObject(this.mesh)
        this.hasEnteredScene = true
    }

    public updateFrame() {
        this.mesh.position.y += 0.6
        this.updateBoundingBoxPos()
    }

    static createNormalProjectile(x: number, y: number, sceneManager: SceneManager): Projectile {
        // create a standard projectile
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        return new Projectile(x, y, sceneManager, geometry, material, mesh)
    }
}
