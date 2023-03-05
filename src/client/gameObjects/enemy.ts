import { getLetter } from '../fontLoader'
import { SceneManager } from '../scene'
import { NonPlayerObject } from './nonPlayerObject'

export class EnemyObject extends NonPlayerObject {
    public updateFrame(): void {
        this.mesh.position.y += -0.05
        this.updateBoundingBoxPos()
    }

    static createLetter(sceneManager: SceneManager, char: string, left: number): EnemyObject {
        const letter = getLetter(char)
        const enemy = new EnemyObject(sceneManager, letter.geometry, letter.material, letter.mesh)
        enemy.mesh.position.x = left
        enemy.mesh.position.y = 20 // calculate from other letters
        return enemy
    }
}
