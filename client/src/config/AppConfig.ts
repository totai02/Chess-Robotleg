import {IConfig, IInjector} from "robotlegs";
import {inject, injectable} from "inversify";
import {UserModel} from "../model/UserModel";
import {PlayerModel} from "../model/PlayerModel";
import {BoardModel} from "../model/BoardModel";
import {GameService} from "../service/GameService";
import {AuthService} from "../service/AuthService";
import {
    CheckNameSignal, JoinRoomSignal, LoginErrorSignal, LoginSuccessSignal, BroadcastMsgSignal, SignupSignal,
    UpdateRoomSignal,
    UpdateUserDataSignal,
    StartGameSignal, OpponentMoveSignal, TurnColorSignal, OpponentPromotionSignal, RestartGameSignal, GameFinishSignal,
    PlayerLeftSignal, MessageSignal, OpponentTimeOutSignal, WaitPlayerSignal
} from "../event/Signals";

@injectable()
export class SignalConfig implements IConfig{

    @inject(IInjector)
    injector: IInjector;

    configure(): void {
        this.injector.bind(UserModel).toSelf().inSingletonScope();
        this.injector.bind(PlayerModel).toSelf().inSingletonScope();
        this.injector.bind(BoardModel).toSelf().inSingletonScope();
        this.injector.bind(CheckNameSignal).toSelf().inSingletonScope();
        this.injector.bind(SignupSignal).toSelf().inSingletonScope();
        this.injector.bind(LoginErrorSignal).toSelf().inSingletonScope();
        this.injector.bind(LoginSuccessSignal).toSelf().inSingletonScope();
        this.injector.bind(UpdateUserDataSignal).toSelf().inSingletonScope();
        this.injector.bind(UpdateRoomSignal).toSelf().inSingletonScope();
        this.injector.bind(BroadcastMsgSignal).toSelf().inSingletonScope();
        this.injector.bind(JoinRoomSignal).toSelf().inSingletonScope();
        this.injector.bind(WaitPlayerSignal).toSelf().inSingletonScope();
        this.injector.bind(StartGameSignal).toSelf().inSingletonScope();
        this.injector.bind(OpponentMoveSignal).toSelf().inSingletonScope();
        this.injector.bind(TurnColorSignal).toSelf().inSingletonScope();
        this.injector.bind(OpponentPromotionSignal).toSelf().inSingletonScope();
        this.injector.bind(RestartGameSignal).toSelf().inSingletonScope();
        this.injector.bind(GameFinishSignal).toSelf().inSingletonScope();
        this.injector.bind(PlayerLeftSignal).toSelf().inSingletonScope();
        this.injector.bind(MessageSignal).toSelf().inSingletonScope();
        this.injector.bind(OpponentTimeOutSignal).toSelf().inSingletonScope();

        this.injector.bind(GameService).to(GameService).inSingletonScope();
        this.injector.bind(AuthService).to(AuthService).inSingletonScope();
    }
}