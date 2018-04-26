import {TextField} from "../ui/TextField";
import {Img} from "../const/Img";
/**
 * Created by Administrator on 09/03/2017.
 */
export class LoginBoard extends PIXI.Sprite {

    private loginLayer: PIXI.Container;
    private signupLayer: PIXI.Container;

    constructor() {
        super(PIXI.Texture.fromImage(Img.LoginBoard));
        this.initChild();
    }

    initChild = () => {
        this.anchor.set(0.5);

        this.x = 640;
        this.y = 384;

        this.width = 600;
        this.height = 400;

        this.loginLayer = new PIXI.Container();
        let username = new TextField(-140, 20, 1, "User name :");
        let pass = new TextField(-140, 220, 1, "Password :");
        this.loginLayer.addChild(username);
        this.loginLayer.addChild(pass);

    }

}