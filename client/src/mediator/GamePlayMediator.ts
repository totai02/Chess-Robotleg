import {SignalMediator} from "robotlegs-signalmediator";
import {GameView} from "../view/GameView";
import {Panel} from "../ui/Panel";
import {Game} from "../Main";
import {MouseEvent} from "../event/InputEvent";
import {HallView} from "../view/HallView";
import {BoardEvent} from "../event/BoardEvent";
import {inject} from "inversify";
import {MessageSignal, PlayerLeftSignal, StartGameSignal, WaitPlayerSignal} from "../event/Signals";
import {UserModel} from "../model/UserModel";
import {BoardModel} from "../model/BoardModel";
import {PlayerModel} from "../model/PlayerModel";
import {GameService} from "../service/GameService";


export class GamePlayMediator extends SignalMediator<GameView> {

    @inject(UserModel)
    userModel: UserModel;

    @inject(BoardModel)
    boardModel: BoardModel;
    
    @inject(GameService)
    gameService: GameService;

    @inject(PlayerModel)
    playerModel: PlayerModel;

    @inject(WaitPlayerSignal)
    waitPlayerSignal: WaitPlayerSignal;

    @inject(StartGameSignal)
    startGameSignal: StartGameSignal;

    @inject(PlayerLeftSignal)
    playerLeftSignal: PlayerLeftSignal;

    @inject(MessageSignal)
    messageSignal: MessageSignal;

    initialize(): void {
        this.eventMap.mapListener(this.view.sendBtn, MouseEvent.Up, this.sendButton_onClick);
        this.eventMap.mapListener(this.view.exit, MouseEvent.Up, this.onExitRoom);
        this.eventMap.mapListener(this.view.harmony, MouseEvent.Up, this.onHarmony);
        this.eventMap.mapListener(this.view.surrender, MouseEvent.Up, this.onSurrender);

        this.addToSignal(this.waitPlayerSignal, this.onWaitPlayer);
        this.addToSignal(this.startGameSignal, this.onStartGame);
        this.addToSignal(this.playerLeftSignal, this.onPlayerLeft);
        this.addToSignal(this.messageSignal, this.onNewMessage);

        this.view.txtMessage.onEnterPress = this.sendButton_onClick;
    }

    sendButton_onClick = () => {
        if (this.view.txtMessage.getText() != "") {
             this.gameService.sendExtRequest("send message", this.view.txtMessage.getText());
            this.view.txtMessage.setText("");
        }
    };

    onExitRoom = () => {
        Panel.showConfirmDialog("Are You Sure?",
            {
                text: "Yes",
                action: () => {
                    Game.appView.loadView(new HallView());
                     this.gameService.sendExtRequest("left room");
                }
            },
            {
                text: "No",
                action: () => {
                }
            }
        );
    }

    onSurrender = () => {
        Panel.showConfirmDialog("Are You Sure?",
            {
                text: "Yes",
                action: () => {
                     this.gameService.sendExtRequest("surrender");
                }
            },
            {
                text: "No",
                action: () => {
                }
            }
        );
    }

    onHarmony = () => {
        Panel.showConfirmDialog("Are You Sure?",
            {
                text: "Yes",
                action: () => {
                     this.gameService.sendExtRequest("harmony");
                }
            },
            {
                text: "No",
                action: () => {
                }
            }
        );
    };

    onWaitPlayer = () => {
        setTimeout(() => Panel.showConfirmDialog("Waiting for opponent...", {
            text: "Cancel",
            action: () => {
                Game.appView.loadView(new HallView());
                this.gameService.sendExtRequest("left room");
            }
        }), 1500);
    }

    onStartGame = (msg: any)=>{
        this.boardModel.colorTurn = true;
        this.boardModel.userColor = msg.color;
        this.playerModel.userName = msg.oppname;
        this.playerModel.avatar = msg.oppavatar;
        Panel.closeDialog();
        this.view.signInit(this.userModel.userName, this.playerModel.userName, this.userModel.avatar, this.playerModel.avatar);
        this.dispatch(new BoardEvent(BoardEvent.StartGame, {
            sign1: this.view.sign1,
            sign2: this.view.sign2
        }));
    }

    onPlayerLeft = ()=>{
        Panel.showMessageDialog("You win !\nOpponent has left.", () => {
            Panel.showConfirmDialog("Waiting for opponent...", {
                text: "Cancel",
                action: () => {
                    Game.appView.loadView(new HallView());
                     this.gameService.sendExtRequest("left room");
                }
            });
        });
    }

    onNewMessage = (data: any)=>{
        let text = new PIXI.Text(data.playername + " : " + data.message, {
            fontSize: 16,
            fill: '#fff'
        });
        this.view.messageBox.addChildrent(text);
    }

    eventPlayer = () => {

    };

    destroy(): void {

    }


}


