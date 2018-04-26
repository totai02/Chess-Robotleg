/**
 * Created by Administrator on 27/02/2017.
 */

import "pixi.js"
import {Img} from "../const/Img";
import {App} from "../const/App";

export class SignBoard extends PIXI.Sprite {

    avatar: PIXI.Sprite;
    username: PIXI.Text;
    timecd: PIXI.Text;
    time: number;
    private interval;

    constructor(avatar: number, username: string) {
        super(PIXI.Texture.fromImage(Img.PlayerInfo));
        this.username = new PIXI.Text(username.substring(0, 20));
        this.avatar = PIXI.Sprite.fromImage(App.AssetsDir + '/avatar/' + avatar + '.png');
        this.avatar.width = 85;
        this.avatar.height = 85;

        this.username.style = new PIXI.TextStyle({
            fontFamily: 'Myriad Pro Bold',
            fontSize: username.length < 16 ? 28 : 24,
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
        this.avatar.scale.set(1);
        this.username.position.set(145, 205);
        this.username.anchor.set(0.5);
        this.username.scale.set(1);
        this.timecd.position.set(202, 110);
        this.timecd.anchor.set(0.5);
        this.timecd.scale.set(1);

        this.timecd.text = "-- : --";
    };

    setName = (username: string) => {
        this.username.text = username;
    };

    stopTimeCount = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.timecd.text = "-- : --";
    };

    timeCountDown = (action?: any) => {
        this.time = 5 * 60;
        this.timecd.text = "05 : 00";
        if (this.interval != null) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.time--;
            this.timecd.text = this.getTime();
            TweenMax.to(this.avatar, 0.4, {alpha: 0, delay: 0.1});
            TweenMax.to(this.avatar, 0.4, {alpha: 1, delay: 0.5});
            if (this.time == 0) {
                if (action) action();
                this.timecd.visible = false;
                clearInterval(this.interval);
            }
        }, 1000);
    };

    private getTime = (): string => {
        let min = "0" + Math.floor(this.time / 60);
        let sec = Math.floor(this.time % 60) < 10 ? "0" + Math.floor(this.time % 60) : "" + Math.floor(this.time % 60);

        return min + " : " + sec;
    }
}