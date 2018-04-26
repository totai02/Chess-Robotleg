import {SignalMediator} from "robotlegs-signalmediator";
import {LoginView} from "../view/LoginView";
import {Game} from "../Main";
import {Panel} from "../ui/Panel";
import {HallView} from "../view/HallView";
import {SignupView} from "../view/SignupView";
import {Auth0Variables} from "../entity/Auth0-Variables";
import {MouseEvent} from "../event/InputEvent";
import {inject} from "inversify";
import {AuthService} from "../service/AuthService";
import {GameService} from "../service/GameService";
import {LoginSuccessSignal, LoginErrorSignal} from "../event/Signals";
import {UserModel} from "../model/UserModel";

/**
 * Created by To Tai on 5/3/2017.
 */

export class LoginMediator extends SignalMediator<LoginView> {
    @inject(AuthService)
    authService: AuthService;

    @inject(GameService)
    gameService: GameService;

    @inject(LoginErrorSignal)
    loginErrSignal: LoginErrorSignal;

    @inject(LoginSuccessSignal)
    loginSignal:  LoginSuccessSignal;

    @inject(UserModel)
    userModel: UserModel;

    initialize(): void {
        this.gameService.connect();
        this.eventMap.mapListener(this.view.btnLogin, MouseEvent.Up, this.login);
        this.eventMap.mapListener(this.view.btnLink, MouseEvent.Up, this.link);
        this.eventMap.mapListener(this.view.btnSignUp, MouseEvent.Up, this.signUp);
        this.addToSignal(this.loginErrSignal, this.onLoginErr);
        this.addToSignal(this.loginSignal, this.onLogin);
        this.view.pass.onEnterPress = this.login;
        this.view.username.onEnterPress = this.changeFocus;
    }

    changeFocus = () => {
        this.view.username.blur();
        this.view.pass.focus();
    }

    destroy(): void {

    }

    link = () => {
        this.authService.createAuth0Client();
        this.authService.client.show();
    };

    login = () => {

        if (this.view.username.getText() == "" || this.view.pass.getText() == "") {
            Panel.showMessageDialog("Please retype the Name and Password.");
            return;
        }

        this.gameService.login(this.view.username.getText(), this.view.pass.getText());

    }

    onLogin = (data: any)=>{
        this.userModel.userName = this.view.username.getText();
        TweenMax.to(this.view.loginBoard, 0.3, {y: 1000, ease: Back.easeIn});
        setTimeout(() => Game.appView.loadView(new HallView()), 500);
    }

    signUp = () => {
        Game.appView.loadView(new SignupView());
    }

    onLoginErr = (data: any) => {
        Panel.showMessageDialog(data.msg);
    }

}