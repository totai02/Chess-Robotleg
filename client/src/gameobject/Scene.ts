import Sprite = PIXI.Sprite;
import Rectangle = PIXI.Rectangle;
import {Game} from "../Main";
import Container = PIXI.Container;

export class Scene extends Container {

    static scenes = [];
    static currentScene = -1;

    public id;
    public added: boolean = false;
    public before = -1;
    public after = -1;

    private leftImg: Sprite;
    private rightImg: Sprite;

    private callbacks: any;

    constructor() {
        super();
        this.leftImg = new PIXI.Sprite();
        this.rightImg = new PIXI.Sprite();
        this.addChild(this.leftImg);
        this.addChild(this.rightImg);
    }

    add = (callback: any) => {
        this.callbacks = callback;
    };

    static back = (ease : number = 0) => {
        if (Scene.scenes[Scene.currentScene].before != -1){
            let before = Scene.scenes[Scene.currentScene].before;
            Scene.scenes[before].load(Game.gameContainer, ease);
        }
    }

    static forward = (ease : number) => {
        if (Scene.scenes[Scene.currentScene].after != -1){
            let after = Scene.scenes[Scene.currentScene].after;
            Scene.scenes[after].load(Game.gameContainer, ease);
        }
    }

    load = (stage: PIXI.Container, ease: number = 0) => {
        if (!this.added) {
            this.added = true;
            this.id = Scene.scenes.length;
            Scene.scenes.push(this);
        }
        if (Scene.scenes.length > 1) {
            this.before = Scene.scenes[Scene.currentScene].id;
            Scene.scenes[Scene.currentScene].after = this.id;
            if (ease == 0) {
                let current = Scene.currentScene;
                Scene.scenes[current].lastScreen(Game.app.renderer.generateTexture(Game.gameContainer).clone());
                setTimeout(() => {
                    Scene.scenes[current].open();
                }, 500);
            } else if (ease == 1) {
                setTimeout(() => {
                    Scene.scenes[Scene.currentScene].close();
                }, 500);
            }
        }
        if (ease == 1) {
            setTimeout(() => {
                Game.gameContainer.removeChildren();
            }, 2500);
        } else {
            Game.gameContainer.removeChildren();
        }

        if (Scene.scenes.length == 1) {
            this.callbacks(stage);
        } else {
            if (ease == 1) {
                setTimeout(() => {
                    this.callbacks(stage);
                }, 2500);
            } else {
                setTimeout(() => {
                    this.callbacks(stage);
                }, 1000);
            }

        }

        Scene.currentScene = this.id;
    }

    lastScreen = (texture: PIXI.Texture) => {
        let base = texture.baseTexture;
        let frame = new Rectangle(0, 0, texture.width / 2, texture.height);
        this.leftImg.texture = new PIXI.Texture(base, frame);
        this.leftImg.anchor.set(1, 0);
        this.leftImg.x = texture.width / 2;
        frame = new Rectangle(texture.width / 2, 0, texture.width / 2, texture.height);
        this.rightImg.texture = new PIXI.Texture(base, frame);
        this.rightImg.x = texture.width / 2;
        Game.tempContainer.addChild(this);
    };

    open = () => {
        this.leftImg.x = Game.app.screen.width / 2;
        this.rightImg.x = Game.app.screen.width / 2;
        TweenMax.to(this.leftImg, 2, {x: 0, ease: Bounce.easeOut});
        TweenMax.to(this.rightImg, 2, {x: Game.app.screen.width, ease: Bounce.easeOut});
        setTimeout(() => Game.tempContainer.removeChildren(), 2000);
    }

    close = () => {
        Game.tempContainer.addChild(this);
        this.leftImg.x = 0;
        this.rightImg.x = Game.app.screen.width;
        TweenMax.to(this.leftImg, 2, {x: Game.app.screen.width / 2, ease: Bounce.easeOut});
        TweenMax.to(this.rightImg, 2, {x: Game.app.screen.width / 2, ease: Bounce.easeOut});
        setTimeout(() => Game.tempContainer.removeChildren(), 2000);
    }

}