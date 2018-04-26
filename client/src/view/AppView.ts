import {View} from "./View";
import {Game} from "../Main";
import Rectangle = PIXI.Rectangle;

export class AppView {

    loadView = (view: View) => {
        let image = new PIXI.Sprite(Game.app.renderer.generateTexture(Game.gameContainer).clone());
        Game.gameContainer.removeChildren();
        Game.tempContainer.addChild(image);
        TweenMax.to(image, 0.5, {alpha: 0});
        view.load();
        TweenMax.from(Game.gameContainer, 0.3, {alpha: 0});
        setTimeout(() => {
            Game.tempContainer.removeChildren();
        }, 500);
    };

}