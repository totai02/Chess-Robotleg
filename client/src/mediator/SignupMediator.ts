import {SignupView} from "../view/SignupView";
import {SignalMediator} from "robotlegs-signalmediator";
import {Game} from "../Main";
import {Panel} from "../ui/Panel";
import {LoginView} from "../view/LoginView";
import {MouseEvent} from "../event/InputEvent";
import {inject} from "inversify";
import {GameService} from "../service/GameService";
import {CheckNameSignal, SignupSignal} from "../event/Signals";
/**
 * Created by To Tai on 5/3/2017.
 */
export class SignupMediator extends SignalMediator<SignupView>{
    @inject(GameService)
    gameService: GameService;

    @inject(SignupSignal)
    signupSignal: SignupSignal;

    @inject(CheckNameSignal)
    checkNameSignal: CheckNameSignal;


    initialize(): void {
        this.eventMap.mapListener(this.view.createBtn, MouseEvent.Up, this.onCreate);
        this.eventMap.mapListener(this.view.checkBtn, MouseEvent.Up, this.checkClick);
        this.eventMap.mapListener(this.view.cancelBtn, MouseEvent.Up, this.onCancel);
        this.addToSignal(this.signupSignal, this.onNotify);
    }

    destroy(): void {

    }

    onCreate = () => {
        if (this.view.password.getText() != this.view.cfPassword.getText()) {
            Panel.showMessageDialog("Your passwords don't match.");
            return;
        }
        if (this.view.username.getText() == "" || this.view.password.getText() == "") {
            Panel.showMessageDialog("Please retype the Name and Password.");
            return;
        }

        this.gameService.signUp(this.view.username.getText(), this.view.password.getText());
        this.eventMap.unmapListener(this.view.cancelBtn, MouseEvent.Up, this.onCreate);
    };

    onNotify = (data: any) => {
        Panel.showMessageDialog(data.msg, () => {
            if (data.evt == "SIGNUP SUCCESS") {
                Game.appView.loadView(new LoginView());
            }
        });
    }

    checkClick = () => {
        if (this.view.username.getText().length == 0) return;
        this.gameService.checkName(this.view.username.getText(), this.onCheckName);
    }

    onCheckName = (exist)=>{
        if (exist) {
            Panel.showMessageDialog("That username is already taken.");
        } else {
            Panel.showMessageDialog("That username can use.");
        }
    }

    onCancel = () => {
        Game.appView.loadView(new LoginView());
    }

}