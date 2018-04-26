/**
 * Created by Administrator on 09/03/2017.
 */

export abstract class View extends PIXI.Container{

    public background : PIXI.Sprite;

    load: () => void;

    constructor(url: string) {
        super();
        this.background = PIXI.Sprite.fromImage(url);
        this.background.width = 1280;
        this.background.height = 768;
        this.addChild(this.background);
    }

}