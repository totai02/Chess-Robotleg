/**
 * Created by Administrator on 14/02/2017.
 */

import "pixi.js"
import Sprite = PIXI.Sprite;
export class Square extends Sprite{
    index: number;

    constructor(x: number, y: number, index: number) {
        super();
        this.index = index;
        let color = new PIXI.Graphics();
        color.beginFill(0x0000FF);
        color.drawRect(0, 0, 100, 100);
        this.texture = color.generateCanvasTexture();
        this.anchor.set(0.5);
        this.alpha = 0;
        this.position.set(x, y);
        this.height = 77;
        this.width = 77;

    }

    public hightLight() {
        this.alpha = 0.5;
    }

    public offLight() {
        this.alpha = 0;
    }


}