import * as THREE from 'three'
import { GameObject } from '.'
import { SceneManager } from '../scene'
import { Projectile } from './projectile'

enum KeyBinding {
    Left = 'a',
    Right = 'd',
    Up = 'w',
    Down = 's',
    Fire = ' ',
}

class MovementState {
    private X_MAX_DELTA_LEFT = -0.3
    private X_MAX_DELTA_RIGHT = 0.3
    private SPEED = 0.1
    private xPosDelta: number
    private yPosDelta: number
    private isMovingLeft: boolean
    private isMovingRight: boolean

    constructor() {
        this.xPosDelta = 0
        this.yPosDelta = 0
        this.isMovingLeft = false
        this.isMovingRight = false
    }

    public moveLeft() {
        this.isMovingLeft = true
        this.isMovingRight = false
    }

    public endMoveLeft() {
        this.isMovingLeft = false
    }

    public moveRight() {
        this.isMovingLeft = false
        this.isMovingRight = true
    }

    public endMoveRight() {
        this.isMovingRight = false
    }

    public moveUp() {
        this.yPosDelta = 0.16
    }

    public moveDown() {
        this.yPosDelta = -0.16
    }

    public endVerticalMove() {
        this.yPosDelta = 0
    }

    public changePosition(pos: THREE.Vector3): void {
        if (this.isMovingLeft && this.xPosDelta > this.X_MAX_DELTA_LEFT) {
            this.xPosDelta -= this.SPEED
        } else if (this.isMovingRight && this.xPosDelta < this.X_MAX_DELTA_RIGHT) {
            this.xPosDelta += this.SPEED
        } else if (!this.isMovingRight && !this.isMovingLeft) {
            this.xPosDelta = 0
        }
        pos.x += this.xPosDelta
        pos.y += this.yPosDelta
    }
}

export class PlayerObject implements GameObject {
    private FIRE_REST_MS = 70
    mesh: THREE.Mesh
    sceneManager: SceneManager
    movementState: MovementState
    isFiring: boolean
    canFire: boolean
    boundingBox: THREE.Box3
    hasEnteredScene: boolean = true

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager
        const geometry = new THREE.CylinderGeometry(0, 1, 2, 3)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.y = -14
        this.movementState = new MovementState()
        this.isFiring = false
        this.canFire = true

        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.boundingBox.setFromObject(this.mesh)

        this.updateFrame = this.updateFrame.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)

        document.addEventListener('keydown', this.handleKeyPress)
        document.addEventListener('keyup', this.handleKeyUp)
    }

    private handleKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case KeyBinding.Left:
                this.movementState.endMoveLeft()
                break
            case KeyBinding.Right:
                this.movementState.endMoveRight()
                break
            case KeyBinding.Up:
                this.movementState.endVerticalMove()
                break
            case KeyBinding.Down:
                this.movementState.endVerticalMove()
                break
            case KeyBinding.Fire:
                this.isFiring = false
                break
        }
    }

    private handleKeyPress(e: KeyboardEvent) {
        if (e.repeat) {
            return
        }
        switch (e.key) {
            case KeyBinding.Left:
                this.movementState.moveLeft()
                break
            case KeyBinding.Right:
                this.movementState.moveRight()
                break
            case KeyBinding.Up:
                this.movementState.moveUp()
                break
            case KeyBinding.Down:
                this.movementState.moveDown()
                break
            case KeyBinding.Fire:
                this.isFiring = true
                break
        }
    }

    private fire() {
        if (this.isFiring && this.canFire) {
            this.sceneManager.add(
                new Projectile(this.mesh.position.x, this.mesh.position.y, this.sceneManager)
            )
            this.canFire = false
            setTimeout(() => (this.canFire = true), this.FIRE_REST_MS)
        }
    }

    public updateFrame() {
        this.movementState.changePosition(this.mesh.position)
        this.fire()
    }

    public destroy(): void {
        console.log('DESTROY PLAYER')
    }
}
