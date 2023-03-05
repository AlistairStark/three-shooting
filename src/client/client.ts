import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getFont } from './fontLoader'
import { SceneManager } from './scene'

const sceneManager = new SceneManager()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(sceneManager.camera, renderer.domElement)
controls.enableZoom = false
controls.enableRotate = true

function animate() {
    requestAnimationFrame(animate)
    sceneManager.updateFrame()
    render()
}

function render() {
    renderer.render(sceneManager.scene, sceneManager.camera)
}

function preload() {
    const font = getFont()
    setTimeout(() => {
        if (!font) {
            preload()
        } else {
            sceneManager.startScene()
            animate()
        }
    }, 2000)
}

preload()
