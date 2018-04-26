/**
 * Created by Administrator on 24/02/2017.
 */

import "pixi.js"
import {Pawn} from "./Pawn";
import {Rook} from "./Rook";
import {ChessMan} from "./ChessMan";
import {Knight} from "./Knight";
import {Bishop} from "./Bishop";
import {Queen} from "./Queen";
import {Board} from "./Board";
import {Button} from "../ui/Button";
import {Game} from "../Main";
import {Img} from "../const/Img";
declare function require(s: string): any
var TweenMax = require("gsap");
export class ChangeBoard extends PIXI.Sprite {

    private pie: ChessMan;

    constructor() {
        super();
        let graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x1500ff, 1);
        graphics.beginFill(0x3e31c2, 0.8);
        graphics.drawRoundedRect(2, 2, 350, 85, 15);
        graphics.endFill();
        this.texture = graphics.generateCanvasTexture();
        this.y = -300;
        this.x = 100;
        Game.gameContainer.addChild(this);
    }

    setPie(pie: ChessMan, board: Board, action?: any): ChessMan {
        this.pie = pie;
        this.removeChildren();
        let rook, knight, bishop, queen: Button;
        if (pie.color) {
            rook = new Button(60, 40, "", Img.WhiteCastle);
            knight = new Button(137, 40, "", Img.WhiteKnight);
            bishop = new Button(214, 40, "", Img.WhiteBishop);
            queen = new Button(291, 40, "", Img.WhiteQueen);
        } else {
            rook = new Button(60, 40, "", Img.BlackCastle);
            knight = new Button(137, 40, "", Img.BlackKnight);
            bishop = new Button(214, 40, "", Img.BlackBishop);
            queen = new Button(291, 40, "", Img.BlackQueen);
        }

        rook.setSize(new PIXI.Point(85, 85));
        knight.setSize(new PIXI.Point(85, 85));
        bishop.setSize(new PIXI.Point(85, 85));
        queen.setSize(new PIXI.Point(85, 85));

        rook.onClick = () => {
            pie.parent.removeChild(pie);
            let roo = new Rook(pie.board, pie.position, pie.color);
            board.setPie(pie, roo);
            action("Castle.png");
            TweenMax.to(this, 2, {y: -300, ease: Back.easeInOut});
            setTimeout(() => this.parent.removeChild(this), 2000);
        };
        knight.onClick = () => {
            pie.parent.removeChild(pie);
            let kni = new Knight(pie.board, pie.position, pie.color);
            board.setPie(pie, kni);
            action("Knight.png");
            TweenMax.to(this, 2, {y: -300, ease: Back.easeInOut});
            setTimeout(() => this.parent.removeChild(this), 2000);
        }
        bishop.onClick = () => {
            pie.parent.removeChild(pie);
            let bis = new Bishop(pie.board, pie.position, pie.color);
            board.setPie(pie, bis);
            action("Bishop.png");
            TweenMax.to(this, 2, {y: -300, ease: Back.easeInOut});
            setTimeout(() => this.parent.removeChild(this), 2000);
        }
        queen.onClick = () => {
            pie.parent.removeChild(pie);
            let que = new Queen(pie.board, pie.position, pie.color);
            board.setPie(pie, que);
            action("Queen.png");
            TweenMax.to(this, 2, {y: -300, ease: Back.easeInOut});
            setTimeout(() => this.parent.removeChild(this), 2000);
        }
        this.addChild(rook);
        this.addChild(knight);
        this.addChild(bishop);
        this.addChild(queen);

        TweenMax.to(this, 1, {x: pie.getGlobalPosition().x, y: pie.getGlobalPosition().y, ease: Elastic.easeOut});
        return pie;
    }

}