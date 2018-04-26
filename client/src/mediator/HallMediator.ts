import {SignalMediator} from "robotlegs-signalmediator";
import {BarItem, HallView} from "../view/HallView";
import {Game} from "../Main";
import {Panel} from "../ui/Panel";
import {GameView} from "../view/GameView";
import {MouseEvent} from "../event/InputEvent";
import {inject} from "inversify";
import {UserModel} from "../model/UserModel";
import {TextStatic} from "../ui/TextStatic";
import {Button} from "../ui/Button";
import {App} from "../const/App";
import {GameService} from "../service/GameService";
import {Request} from "../service/Request";
import {
    JoinRoomSignal, BroadcastMsgSignal, UpdateRoomSignal, UpdateUserDataSignal
} from "../event/Signals";

export class HallMediator extends SignalMediator<HallView> {

    @inject(UserModel)
    userModel: UserModel;

    @inject(GameService)
    gameService: GameService;

    @inject(UpdateUserDataSignal)
    updateUserSignal: UpdateUserDataSignal;

    @inject(UpdateRoomSignal)
    updateRoomSignal: UpdateRoomSignal;

    @inject(BroadcastMsgSignal)
    messageSignal: BroadcastMsgSignal;

    @inject(JoinRoomSignal)
    joinRoomSignal: JoinRoomSignal;

    items = [];

    initialize(): void {
        this.eventMap.mapListener(this.view.sendBtn, MouseEvent.Up, this.onSendMsg);
        this.eventMap.mapListener(this.view.searchBtn, MouseEvent.Up, this.onSearchRoom);
        this.eventMap.mapListener(this.view.refresh, MouseEvent.Up, this.onRefresh);

        this.addToSignal(this.updateUserSignal, this.updateUserData);
        this.addToSignal(this.updateRoomSignal, this.updateRoomsData);
        this.addToSignal(this.messageSignal, this.onReceiveMsg);
        this.addToSignal(this.joinRoomSignal, this.onJoinRoom);

        this.view.textField.onEnterPress = this.onSendMsg;
        this.initView();
    }

    destroy(): void {
    }

    onSendMsg = () => {
        if (this.view.textField.getText() != "") {
            this.gameService.sendExtRequest(Request.BroadcastMsg, this.view.textField.getText());
            this.view.textField.setText("");
        }
        this.view.textField.focus();
    };

    onSearchRoom = () => {
        this.gameService.sendExtRequest(Request.JoinRoom, this.view.txtSearch.getText());
    };

    onRefresh = () => {
        this.gameService.getRoomData();
    }

    initView = () => {
        this.gameService.getUserData(this.userModel.userName);
        this.gameService.getRoomData();
    }

    updateUserData = () => {
        this.view.addChild(this.playerInfo());
    }

    updateRoomsData = (data: any) => {
        this.view.roomsScroll.removeAllChild();
        this.items = [];
        for (let i = 0; i < data.length; i++) {
            this.items[i] = new BarItem(data[i]);
            this.items[i].onClick = this.selectRoom.bind(null, data[i].id);
            this.view.roomsScroll.addChildrent(this.items[i], "center");
        }
        this.view.roomsScroll.moveToHead();
    };

    selectRoom = (room: number) => {
        this.gameService.sendExtRequest(Request.JoinRoom, room);
    }

    onRoomFull = () => {
        Panel.showMessageDialog("This room is full");
    }

    onJoinRoom = () => {
        Game.appView.loadView(new GameView());
    }

    onReceiveMsg = (data: any) => {
        let text = new PIXI.Text(data.playername + " : " + data.message, {
            fontSize: 16,
            fill: '#fff'
        });
        this.view.chatBox.addChildrent(text);
    }

    playerInfo = (): PIXI.Container => {
        let container = new PIXI.Container();
        let style = new PIXI.TextStyle({
            fontFamily: 'JasmineUPC Bold',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        let name = new TextStatic(this.userModel.userName, 250, style);
        name.position.set(155, 60);
        name.setAnchor(0.5);
        container.addChild(name);

        let avatar = new Button(155, 150, "", App.AssetsDir + "avatar/" + this.userModel.avatar + ".png");
        avatar.setSize(new PIXI.Point(128, 128));

        container.addChild(avatar);
        let level = new TextStatic("Level : " + this.userModel.level, 280, style);
        level.position.set(40, 215);
        container.addChild(level);

        let money = new TextStatic("Win Matchs : " + this.userModel.winMatch + " / " + this.userModel.numMatch, 280, style);
        money.position.set(40, 250);
        container.addChild(money);

        return container;
    }

}