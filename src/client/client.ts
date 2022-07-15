import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SceneManager } from './scene'

const sceneManager = new SceneManager()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(sceneManager.camera, renderer.domElement)
controls.enableZoom = false
controls.enableRotate = true

// const raycaster = new THREE.Raycaster()
// const dir = new THREE.Vector3()

function animate() {
    requestAnimationFrame(animate)
    sceneManager.updateFrame()
    // raycaster.set(
    //     controls.target,
    //     dir.subVectors(sceneManager.camera.position, controls.target).normalize()
    // )
    // const intersects = raycaster.intersectObjects(sceneManager.scene.children, false)
    // if (intersects.length > 0) {
    //     console.log(intersects)
    // }
    render()
}

function render() {
    renderer.render(sceneManager.scene, sceneManager.camera)
}
animate()
