import {View} from "./View";
import {TextStatic} from "../ui/TextStatic";
import {game, Game} from "../Main";
import {ScrollPane} from "../ui/ScrollPane";
import {Button} from "../ui/Button";
import {TextField} from "../ui/TextField";
import {Img} from "../const/Img";
import {App} from "../const/App";
import {MouseEvent} from "../event/InputEvent";

export class HallView extends View {

    roomsScroll: ScrollPane;
    chatBox: ScrollPane;
    txtSearch : TextField;
    sendBtn : Button;
    textField : TextField;
    searchBtn : Button;
    refresh : Button;
    items : BarItem[];

    constructor() {
        super(Img.HallBackground);

        this.roomsScroll = new ScrollPane(860, 550,
            {name: "ID", position: 55},
            {name: "Room Name", position: 255},
            {name: "Stake", position: 530},
            {name: "Players", position: 730});
        this.roomsScroll.lineBreak = 3;
        this.roomsScroll.position.set(365, 110);
        this.addChild(this.roomsScroll);
        this.chatBox = new ScrollPane(245, 340);
        this.chatBox.position.set(40, 340);
        this.textField = new TextField(40, 706, 0.85);
        this.textField.scale.set(0.3);
        this.sendBtn = new Button(260, 706, "", Img.SendMsgBtn);
        this.sendBtn.setSize(new PIXI.Point(45, 35));

        this.txtSearch = new TextField(780, 695);
        this.txtSearch.scale.set(0.45);
        this.searchBtn = new Button(1170, 695, "", Img.SeachBtn);
        this.searchBtn.setSize(new PIXI.Point(80, 50));

        this.addChild(this.searchBtn);

        this.refresh = new Button(425, 70, "", Img.RefreshBtn);
        this.refresh.setSize(new PIXI.Point(100, 50));
        this.addChild(this.refresh);
        this.addChild(this.txtSearch);

        this.addChild(this.textField, this.sendBtn);

        this.addChild(this.chatBox);

        this.chatBox.on(MouseEvent.Down, (e)=>{
           console.log(e)
        });
    }

    load = () => {
        Game.gameContainer.addChild(this);
    };


}

export class BarItem extends Button {

    public id: PIXI.Text;

    constructor(data: any) {
        super(0, 0, "", Img.BarItem);
        this.setSize(new PIXI.Point(830, 54));
        let style = new PIXI.TextStyle({
            fontFamily: 'Myriad Pro Bold',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#613012',
        });

        this.id = new PIXI.Text(data.id, style);
        this.id.anchor.set(0.5);
        this.id.x = -375;
        let roomname = new PIXI.Text(data.name, style);
        roomname.anchor.set(0.5);
        roomname.x = -170;
        let stake = new PIXI.Text(data.stake, style);
        stake.anchor.set(0.5);
        stake.x = 110;
        let players = new PIXI.Text(data.playerNumber + "/2", style);
        players.anchor.set(0.5);
        players.x = 310;
        this.addChild(this.id, roomname, stake, players);
    }
}