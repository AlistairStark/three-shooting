import * as THREE from 'three'
import { OrthographicCamera } from 'three'
import { GameObject, PlayerObject, EnemyObject } from './gameObjects'
import { Explode } from './gameObjects/explode'
import { NonPlayerObject } from './gameObjects/nonPlayerObject'
import { Projectile } from './gameObjects/projectile'

export class SceneManager {
    camera: THREE.OrthographicCamera
    scene: THREE.Scene
    frustum: THREE.Frustum
    matrix: THREE.Matrix4
    raycaster: THREE.Raycaster
    player: PlayerObject
    projectiles: Projectile[] = []
    enemies: EnemyObject[] = []
    updateObjects: GameObject[] = []
    explosions: any[] = []

    constructor() {
        const N = 50
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -N,
            window.innerWidth / N,
            window.innerHeight / N,
            window.innerHeight / -N,
            25,
            50
        )
        this.camera.position.z = 30
        this.camera.position.y = 3
        this.frustum = new THREE.Frustum()
        this.matrix = new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        )
        this.scene = new THREE.Scene()
        this.raycaster = new THREE.Raycaster()
        this.player = new PlayerObject(this)
        this.scene.add(this.player.mesh)
    }

    private setMatrix() {
        this.matrix = new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        )
        this.frustum.setFromProjectionMatrix(this.matrix)
    }

    private checkInView(objectArr: NonPlayerObject[]) {
        // check if the gameobject is still in the camera view
        for (let i = 0; i < objectArr.length; i++) {
            const inView = this.frustum.containsPoint(objectArr[i].mesh.position)
            if (inView && !objectArr[i].hasEnteredScene) {
                objectArr[i].hasEnteredScene = true
                objectArr[i].updateFrame()
            } else if (!inView && objectArr[i].hasEnteredScene) {
                objectArr[i].destroy()
            } else {
                objectArr[i].updateFrame()
            }
        }
    }

    private checkEnemiesHit() {
        // check if enemies have been hit by projectiles
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = 0; j < this.projectiles.length; j++) {
                if (
                    !this.enemies[i].removed &&
                    !this.projectiles[j].removed &&
                    this.enemies[i].boundingBox.intersectsBox(this.projectiles[j].boundingBox)
                ) {
                    // const explode = new Explode(this.enemies[i])
                    // this.explosions.push(explode)
                    // this.scene.add(explode.outline, explode.particlesMesh)
                    this.enemies[i].destroy()
                    this.projectiles[j].destroy()
                }
            }
        }
    }

    private updateExplode() {
        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].updatePosition()
        }
    }

    public updateFrame() {
        this.player.updateFrame()
        this.checkEnemiesHit()
        this.setMatrix()
        this.checkInView(this.enemies)
        this.checkInView(this.projectiles)
        this.updateExplode()
        this.enemies = this.enemies.filter((obj) => !obj.removed)
        this.projectiles = this.projectiles.filter((obj) => !obj.removed)
    }

    public add(gameObject: GameObject) {
        this.scene.add(gameObject.mesh)
        if (gameObject instanceof Projectile) {
            this.projectiles.push(gameObject)
        } else if (gameObject instanceof EnemyObject) {
            this.enemies.push(gameObject)
        }
    }

    public startScene() {
        const paragraph = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        `

        const letters = paragraph.split('')
        const addText = new TextGenerator(letters, this.camera, this)
        setInterval(() => {
            const next = addText.getNextLine()
            next.forEach((enemy) => {
                this.add(enemy)
            })
        }, 1000)
    }
}

class TextGenerator {
    SPACE = 0.8
    letters: string[]
    letterIndex: number = 0
    camera: OrthographicCamera
    sceneManager: SceneManager
    renderComplete: boolean = false
    spaces: number = 0

    constructor(letters: string[], camera: OrthographicCamera, sceneManager: SceneManager) {
        this.letters = letters
        this.camera = camera
        this.sceneManager = sceneManager
    }

    private getTextForLine(): string[] {
        const AVG_LETTER_WIDTH = 1.3
        const text = []
        let left = this.camera.left
        while (left < this.camera.right) {
            if (this.letterIndex >= this.letters.length) {
                return text
            }
            if (this.letters[this.letterIndex] === '\n') {
                this.letterIndex++
                return text
            }
            left += AVG_LETTER_WIDTH
            text.push(this.letters[this.letterIndex])
            this.letterIndex++
        }
        // remove last chunk of word if it's not complete
        if (this.letters[this.letterIndex] === ' ') {
            return text
        }
        const lastSpace = text.lastIndexOf(' ')
        if (lastSpace < 1) {
            // must be a stupidly long word, split it up
            return text
        }
        const removeIndex = text.length - lastSpace
        this.letterIndex -= removeIndex
        text.splice(lastSpace, text.length)
        return text
    }

    public getNextLine(): EnemyObject[] {
        if (this.letterIndex >= this.letters.length) {
            return []
        }
        const nextLine = this.getTextForLine()
        const enemies: EnemyObject[] = []
        let left = this.camera.left
        for (let i = 0; i <= nextLine.length - 1; i++) {
            let l = nextLine[i]
            if (l === ' ') {
                left += this.SPACE
                continue
            }
            const enemy = EnemyObject.createLetter(this.sceneManager, l, left)
            const v = enemy.boundingBox.getSize(new THREE.Vector3())
            left += v.x
            enemies.push(enemy)
        }
        return enemies
    }
}
