import {View} from "./View";
import {TextField} from "../ui/TextField";
import {Button} from "../ui/Button";
import {Game} from "../Main";
import {injectable} from "inversify";
import {Img} from "../const/Img";
/**
 * Created by Administrator on 10/03/2017.
 */
@injectable()
export class LoginView extends View {

    loginBoard: PIXI.Sprite;
    username: TextField;
    pass: TextField;
    btnLogin : Button;
    btnLink : Button;
    btnSignUp : Button;

    constructor() {
        super(Img.FlashScreen);
        this.loginBoard = PIXI.Sprite.fromImage(Img.LoginBoard);

        this.loginBoard.width = 600;
        this.loginBoard.height = 400;
        this.loginBoard.anchor.set(0.5);
        this.loginBoard.x = 640;
        this.loginBoard.y = 384;

        this.username = new TextField(-370, -110, 1, "User name :");
        this.pass = new TextField(-370, 90, 1, "Password :");
        this.loginBoard.addChild(this.username);
        this.loginBoard.addChild(this.pass);

        this.btnLogin = new Button(300, 210, "", Img.LoginBtn);

        this.btnLink = new Button(145, 210, "", Img.LinkBtn);

        this.btnSignUp = new Button(-300, 210, "", Img.SignupBtn);
        this.loginBoard.addChild(this.btnLogin);
        this.loginBoard.addChild(this.btnSignUp);
        this.loginBoard.addChild(this.btnLink);
        this.addChild(this.loginBoard);
    }

    load = () =>{
        Game.gameContainer.addChild(this);
    };


}