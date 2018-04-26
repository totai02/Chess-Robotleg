import Sprite = PIXI.Sprite;
import {Img} from "../const/Img";

export class PlayerView extends Sprite {

    avatar: PIXI.Sprite;
    username: PIXI.Text;
    timecd: PIXI.Text;

    constructor(public uid: string) {
        super(PIXI.Texture.fromImage(Img.PlayerInfo));
        this.avatar = new Sprite();
        this.username = new PIXI.Text();
        this.username.style = new PIXI.TextStyle({
            fontFamily: 'Myriad Pro Bold',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#613012'
        });
        this.timecd = new PIXI.Text("", {
            fontFamily: '.VnCooper',
            fontSize: 26,
            fill: '#dddddd'
        });

        this.addChild(this.avatar);
        this.addChild(this.username);
        this.addChild(this.timecd);
        this.initComponent();
    }

    private initComponent = () => {
        this.avatar.position.set(82, 110);
        this.avatar.anchor.set(0.5);

        this.username.position.set(145, 205);
        this.username.anchor.set(0.5);

        this.timecd.position.set(202, 110);
        this.timecd.anchor.set(0.5);
        this.timecd.scale.set(1);
        this.timecd.text = "-- : --";
    };
}