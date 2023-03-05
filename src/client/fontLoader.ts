import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry, TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry'
import * as THREE from 'three'
import * as _ from 'lodash'

interface LetterData {
    geometry: TextGeometry
    material: THREE.MeshPhongMaterial
    mesh: THREE.Mesh
}

let font: Font | null = null

export function getFont(): Font | null {
    if (font) {
        return font
    }
    const loader = new FontLoader()
    loader.load('./roboto.json', (loadedFont: Font) => {
        font = loadedFont
    })
    return font
}

export function getLetter(letter: string): LetterData {
    if (!font) {
        throw Error('No font loaded!')
    }
    const options: TextGeometryParameters = {
        font: font,
        size: 2,
        height: 1,
        // curveSegments: 12,
        // bevelEnabled: true,
        // bevelThickness: 5,
        // bevelSize: 2,
        // bevelOffset: 2,
        // bevelSegments: 15,
    }
    const geometry = new TextGeometry(letter, options)
    const material = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    return {
        geometry,
        material,
        mesh,
    }
}
