import {IConfig} from "robotlegs";
import {IMediatorMap} from "robotlegs-pixi";
import {inject, injectable} from "inversify";
import {ChessMan} from "../gameobject/ChessMan";
import {ChessManMediator} from "../mediator/ChessManMediator";
import {Board} from "../gameobject/Board";
import {BoardMediator} from "../mediator/BoardMediator";
import {GameView} from "../view/GameView";
import {GamePlayMediator} from "../mediator/GamePlayMediator";
import {LoginView} from "../view/LoginView";
import {LoginMediator} from "../mediator/LoginMediator";
import {SignupView} from "../view/SignupView";
import {SignupMediator} from "../mediator/SignupMediator";
import {HallView} from "../view/HallView";
import {HallMediator} from "../mediator/HallMediator";
/**
 * Created by Administrator on 28/04/2017.
 */
@injectable()
export class ViewConfig implements IConfig{
    @inject(IMediatorMap)
    mediatorMap: IMediatorMap;

    configure(): void {

        this.mediatorMap.map(LoginView).toMediator(LoginMediator);
        this.mediatorMap.map(SignupView).toMediator(SignupMediator);
        this.mediatorMap.map(HallView).toMediator(HallMediator);
        this.mediatorMap.map(GameView).toMediator(GamePlayMediator);
        this.mediatorMap.map(Board).toMediator(BoardMediator);
        this.mediatorMap.map(ChessMan).toMediator(ChessManMediator);
    }
}