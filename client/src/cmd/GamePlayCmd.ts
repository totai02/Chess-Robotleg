
import {inject, injectable} from "inversify";
import {ExtEvent} from "../event/ExtEvent";
import {
    GameFinishSignal, MessageSignal,
    OpponentMoveSignal, OpponentPromotionSignal, OpponentTimeOutSignal, PlayerLeftSignal, RestartGameSignal,
    StartGameSignal,
    TurnColorSignal
} from "../event/Signals";
import {ICommand} from "robotlegs";
@injectable()
export class GamePlayCmd implements ICommand {

    @inject(ExtEvent)
    e: ExtEvent;

    @inject(StartGameSignal)
    startGameSignal: StartGameSignal;

    @inject(OpponentMoveSignal)
    opponentMoveSignal: OpponentMoveSignal;

    @inject(TurnColorSignal)
    turnColorSignal: TurnColorSignal;

    @inject(OpponentPromotionSignal)
    opponentPromotionSignal: OpponentPromotionSignal;

    @inject(RestartGameSignal)
    restartGameSignal: RestartGameSignal;

    @inject(GameFinishSignal)
    gameFinishSignal: GameFinishSignal;

    @inject(PlayerLeftSignal)
    playerLeftSignal: PlayerLeftSignal;

    @inject(MessageSignal)
    messageSignal: MessageSignal;

    @inject(OpponentTimeOutSignal)
    opponentTimeOutSignal: OpponentTimeOutSignal;

    params;

    execute(): void {
        this.params = this.e.params;
        switch (this.params.evt) {
            case ExtEvent.OpponentMove:
                this.opponentMoveSignal.dispatch(this.params.data);
                break;
            case ExtEvent.TurnColor:
                this.turnColorSignal.dispatch(this.params.data);
                break;
            case ExtEvent.OpponentPromotion:
                this.opponentPromotionSignal.dispatch(this.params.data);
                break;
            case ExtEvent.RestartGame:
                this.restartGameSignal.dispatch(this.params.data);
                break;
            case ExtEvent.FinishGame:
                this.gameFinishSignal.dispatch(this.params.data);
                break;
            case ExtEvent.OpponentTimeOut:
                this.opponentTimeOutSignal.dispatch(this.params.data);
                break;
            case ExtEvent.PlayerLeft:
                this.playerLeftSignal.dispatch(this.params.data);
                break;
            case ExtEvent.NewMessage:
                this.messageSignal.dispatch(this.params.data);
                break;
        }
    }

}