import {View} from "./View";
import {Game, game} from "../Main";
import {TextField} from "../ui/TextField";
import {Button} from "../ui/Button";
import {Img} from "../const/Img";
/**
 * Created by Administrator on 10/03/2017.
 */
export class SignupView extends View {

    username: TextField;
    password: TextField;
    cfPassword: TextField;
    createBtn : Button;
    cancelBtn : Button;
    checkBtn : Button;

    constructor() {
        super(Img.FlashScreen);
        let loginBoard = PIXI.Sprite.fromImage("../assets/signupboard.png");
        loginBoard.width = 600;
        loginBoard.height = 600;
        loginBoard.anchor.set(0.5);
        loginBoard.x = 640;
        loginBoard.y = 384;

        this.username = new TextField(-370, -193, 0.75, "User name :");
        this.username.scale.y = 0.8;
        this.password = new TextField(-370, -22, 1, "Password :");
        this.password.scale.y = 0.8;
        this.cfPassword = new TextField(-370, 150, 1, "Confirm Password :");
        this.cfPassword.scale.y = 0.8;
        loginBoard.addChild(this.username);
        loginBoard.addChild(this.password);
        loginBoard.addChild(this.cfPassword);

        this.createBtn = new Button(150, 263, "", Img.CreateBtn);

        this.cancelBtn = new Button(300, 263, "", Img.CancelBtn);

        this.checkBtn = new Button(300, -193, "", Img.CheckBtn);


        loginBoard.addChild(this.createBtn);
        loginBoard.addChild(this.checkBtn);
        loginBoard.addChild(this.cancelBtn);

        this.addChild(loginBoard);
    }

    load = () => {
        Game.gameContainer.addChild(this);
    }

}