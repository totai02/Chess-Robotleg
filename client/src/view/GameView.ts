import {View} from "./View";
import {SignBoard} from "../gameobject/SignBoard";
import {Board} from "../gameobject/Board";
import {ScrollPane} from "../ui/ScrollPane";
import {TextField} from "../ui/TextField";
import {Button} from "../ui/Button";
import {Game} from "../Main"
import {Img} from "../const/Img";

export class GameView extends View {

    public sign1: SignBoard;
    public sign2: SignBoard;
    public board: Board;

    public sendBtn : Button;
    public messageBox: ScrollPane;
    public txtMessage: TextField;

    public exit : Button;
    public harmony: Button;
    public surrender : Button;

    private container : PIXI.Container;

    constructor() {
        super(Img.Background);
        this.container = new PIXI.Container();

        this.board = new Board();

        this.messageBox = new ScrollPane(270, 300);
        this.messageBox.x = 10;
        this.messageBox.y = 280;

        this.exit = new Button(20, 700, "", Img.OutRoomBtn);
        this.exit.setSize(new PIXI.Point(100, 66));

        this.harmony = new Button(120, 700, "", Img.ShakeHandBtn);
        this.harmony.setSize(new PIXI.Point(60, 40));

        this.surrender = new Button(190, 700, "", Img.SurrenderBtn);
        this.surrender.setSize(new PIXI.Point(60, 40));

        let buttonPane = new PIXI.Container();
        buttonPane.x = 50;
        buttonPane.addChild(this.exit);
        buttonPane.addChild(this.harmony);
        buttonPane.addChild(this.surrender);

        this.txtMessage = new TextField(0, this.messageBox.height + 20);
        this.txtMessage.scale.set(0.3);

        this.sendBtn = new Button(248, this.messageBox.height + 20, "", Img.SendMsgBtn);
        this.sendBtn.setSize(new PIXI.Point(40, 30));

        this.messageBox.addChild(this.txtMessage, this.sendBtn);

        this.addChild(this.board);
        this.addChild(this.messageBox);
        this.addChild(buttonPane);

        this.container.addChild(this);
    }

    load = () => {
        TweenMax.from(this.board, 1.5, {x: -200, ease: Bounce.easeOut});
        TweenMax.from(this.messageBox, 1, {x: -400, ease: Elastic.easeOut, delay: 1.5});

        TweenMax.staggerFrom([this.exit, this.harmony, this.surrender], 0.5, {y: 1000, ease: Back.easeOut, delay: 2}, 0.1);
        Game.gameContainer.addChild(this.container);
        Game.gameContainer.interactiveChildren = false;
    };


    signInit = (playerName, oppName, avatar1, avatar2) => {
        Game.gameContainer.interactiveChildren = true;
        this.sign1 = new SignBoard(avatar1, playerName);
        this.sign2 = new SignBoard(avatar2, oppName);
        this.sign1.position.set(0, 0);
        this.sign2.position.set(990, 0);
        Game.gameContainer.addChild(this.sign1);
        Game.gameContainer.addChild(this.sign2);
        TweenMax.from(this.sign1, 1, {y: -400, ease: Back.easeInOut, delay: 1});
        TweenMax.from(this.sign2, 1, {y: -600, ease: Back.easeInOut, delay: 1.5});
    }


}