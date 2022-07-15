import * as THREE from 'three'
import { GameObject, PlayerObject, EnemyObject } from './gameObjects'

export class SceneManager {
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    frustum: THREE.Frustum
    matrix: THREE.Matrix4
    raycaster: THREE.Raycaster
    player: PlayerObject
    updateObjects: GameObject[] = []

    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1.0,
            1000
        )
        this.camera.position.z = 20
        this.camera.position.y = 3
        this.frustum = new THREE.Frustum()
        this.matrix = new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        )
        this.scene = new THREE.Scene()
        this.raycaster = new THREE.Raycaster()
        this.player = new PlayerObject(this)
        const enemy = new EnemyObject(0, 5, this)
        this.scene.add(this.player.mesh)
        this.add(enemy)
        // this.startScene()
    }

    public updateFrame() {
        this.player.updateFrame()
        const frustum = new THREE.Frustum()
        const matrix = new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        )
        frustum.setFromProjectionMatrix(matrix)
        for (let i = 0; i < this.updateObjects.length; i++) {
            // check collisions
            // TODO make better algorithm. Terrible code, just to test
            for (let j = 0; j < this.updateObjects.length; j++) {
                if (
                    j !== i &&
                    !this.updateObjects[i].mesh.userData.removed &&
                    !this.updateObjects[j].mesh.userData.removed &&
                    this.updateObjects[i].boundingBox.intersectsBox(
                        this.updateObjects[j].boundingBox
                    )
                ) {
                    this.updateObjects[i].destroy()
                    this.updateObjects[j].destroy()
                }
            }
            // check if the gameobject is still in the camera view
            const inView = frustum.containsPoint(this.updateObjects[i].mesh.position)
            console.log(inView)
            if (inView && !this.updateObjects[i].hasEnteredScene) {
                console.log('ENTERED?')
                // this.updateObjects[i].hasEnteredScene = true
                this.updateObjects[i].updateFrame()
            } else if (!inView && this.updateObjects[i].hasEnteredScene) {
                console.log('hlloo')
                this.updateObjects[i].destroy()
            } else {
                this.updateObjects[i].updateFrame()
            }
        }
        this.updateObjects = this.updateObjects.filter((obj) => !obj.mesh.userData.removed)
        console.log(this.updateObjects.length)
    }

    public add(gameObject: GameObject) {
        this.scene.add(gameObject.mesh)
        this.updateObjects.push(gameObject)
    }

    public startScene() {
        // function randomIntFromInterval(min: number, max: number) {
        //     // min and max included
        //     return Math.floor(Math.random() * (max - min + 1) + min)
        // }
        // setInterval(() => {
        //     const x = randomIntFromInterval(-12, 12)
        //     const y = randomIntFromInterval(-12, 12)
        //     const enemy = new EnemyObject(x, y, this)
        //     this.add(enemy)
        // }, 1000)
    }
}
