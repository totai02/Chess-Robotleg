import Rectangle = PIXI.Rectangle;
import {Img} from "../const/Img";
import {MouseEvent} from "../event/InputEvent";
import {App} from "../const/App";
import {Game} from "../Main";
import Graphics = PIXI.Graphics;

/**
 * Created by Administrator on 06/03/2017.
 */
export class ScrollPane extends PIXI.Container {

    smooth = 6;
    content: PIXI.Container;
    lineBreak = 10;
    mouseOver = false;
    anim: boolean = false;
    head: number;
    pointerData;
    mouseY;
    oldPos;


    constructor(public wid: number = 382, public hei: number = 134, ...heads) {
        super();
        this.panelInit(wid, hei, heads);
    }

    panelInit = (wid: number = 382, hei: number = 134, heads: any[]) => {
        let dx = wid - 22;
        let dy = hei - 24;
        let base = PIXI.BaseTexture.fromImage(Img.ScrollPane);
        let topLeft = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(0, 0, 10, 10)));
        topLeft.position.set(0, 0);

        let top = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(10, 0, 360, 10)));
        top.width = dx;
        top.position.set(10, 0);

        let topRight = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(370, 0, 12, 10)));
        topRight.position.set(dx + 10, 0);

        let left = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(0, 10, 10, 110)));
        left.height = dy;
        left.position.set(0, 10);

        let center = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(10, 10, 360, 110)));
        center.width = dx;
        center.height = dy;
        center.position.set(10, 10);

        let right = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(370, 10, 12, 110)));
        right.height = dy;
        right.position.set(dx + 10, 10);

        let bottomLeft = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(0, 120, 10, 14)));
        bottomLeft.position.set(0, dy + 10);

        let bottom = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(10, 120, 360, 14)));
        bottom.width = dx;
        bottom.position.set(10, dy + 10);

        let bottomRight = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(370, 120, 12, 14)));
        bottomRight.position.set(dx + 10, dy + 10);

        this.addChild(topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight);
        this.content = new PIXI.Container();
        let area = new PIXI.Graphics();
        if (heads.length != 0) {
            area.drawRect(-30, 50, dx + 80, dy - 40);
            this.content.hitArea = new PIXI.Rectangle(10, 40, dx, dy - 30);
            this.content.y = 20;
            this.head = 30;
        } else {
            area.drawRect(10, 10, dx, dy);
            this.content.hitArea = new PIXI.Rectangle(10, 10, dx, dy);
            this.head = 0;
        }
        this.addChild(this.content);
        this.addChild(area);
        this.content.mask = area;
        if (heads.length != 0) {
            let headContainer = new PIXI.Container();
            for (let i = 0; i < heads.length; i++) {
                let headI = new PIXI.Text(heads[i].name);
                headI.anchor.set(0.5);
                headI.style.fill = "#eeeeee";
                headI.style.fontFamily = "Myriad Pro Bold";
                headI.position.set(heads[i].position, 30);
                headContainer.addChild(headI);
            }
            this.addChild(headContainer);
        }

        this.interactive = true;

        this.on(MouseEvent.Down, this.onMouseDown);
        this.on(MouseEvent.Move, this.onMouseMove);
        this.on(MouseEvent.Up, this.onMouseUp);
        this.on(MouseEvent.UpOutside, this.onMouseUp);
    }

    onMouseDown = (e) => {
        this.pointerData = e.data;
        this.mouseY = e.data.global.y;
        this.oldPos = e.data.global.y;
    };

    onMouseMove = (e) => {
        if (this.content.height < this.height) return;
        if (this.pointerData != null) {
            let delta = App.isWeb ? e.data.global.y - this.mouseY : (e.data.global.y - this.mouseY) / Game.app.stage.scale.x;
            if (Math.abs(e.data.global.y - this.oldPos) > 10) this.interactiveChildren = false;
            this.mouseY = e.data.global.y;
            if (this.content.y + delta > this.height / 5 + this.head) {
                return;
            }
            if (this.content.y + delta < -((this.content.height - this.height + 10 + this.head) + this.height / 5)) {
                return;
            }
            this.content.y += delta;
        }
    };

    onMouseUp = () => {
        this.pointerData = null;
        this.interactiveChildren = true;
        if (this.content.y > this.head) {
            this.anim = true;
            TweenMax.to(this.content, 0.5, {y: this.head});
            return;
        }
        if (this.content.y < -(this.content.height - this.height + 10 + this.head)) {
            this.anim = true;
            TweenMax.to(this.content, 0.5, {
                y: -(this.content.height - this.height + 70)
            });
            return;
        }
        for (let child of this.content.children) {
            child.emit(MouseEvent.Out);
        }
    };


    addChildrent = (child, pos: string = "left") => {
        child.anchor.y = 0.5;
        child.x = 15;
        if (pos == "center") {
            child.x = this.wid / 2;
        }
        child.y = (child.height + this.lineBreak) * (this.content.children.length + 1);
        this.content.addChild(child);
        if (child.y > this.height - 70) {
            this.content.y = -(child.y - this.height + 70);
        }
    }

    removeAllChild = () => {
        this.content.removeChildren();
    }

    moveToHead = () => {
        this.anim = true;
        let time = -this.content.y / this.height;
        if (time < 0) time = 0;
        TweenMax.to(this.content, time, {y: this.head, onComplete: () => this.anim = false});
    }
}