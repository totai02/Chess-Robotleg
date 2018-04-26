/**
 * Created by Administrator on 22/02/2017.
 */
import "pixi.js"
import Container = PIXI.Container;
import {Square} from "./Square";
import {Pawn} from "./Pawn";
import {ChessMan} from "./ChessMan";
import {Rook} from "./Rook";
import {Queen} from "./Queen";
import {Knight} from "./Knight";
import {Bishop} from "./Bishop";
import {King} from "./King";
import {ChangeBoard} from "./ChangeBoard";
import {Game, game} from "../Main";
import {Panel} from "../ui/Panel";
import {SignBoard} from "./SignBoard";
import {Player} from "../Player";
import {inject} from "inversify";
import {HallView} from "../view/HallView";
import {GameView} from "../view/GameView";
import {Img} from "../const/Img";

export class Board extends Container {

    public squares: Square[];
    public pieces: ChessMan[];
    sign1: SignBoard;
    sign2: SignBoard;
    boardDir: boolean;


    constructor() {
        super();
        this.pivot.set(0.5);
        this.position.set(370, 114);
        this.init();
    }

    init() {
        this.removeChildren();
        let boardSprite = PIXI.Sprite.fromImage(Img.Board);
        boardSprite.width = 700;
        boardSprite.height = 700;
        boardSprite.x = -81;
        boardSprite.y = -80;
        this.addChild(boardSprite);
        this.width = 700;
        this.height = 700;
        this.squares = [];
        this.pieces = [];
        for (let i = 0; i < 64; i++) {
            this.squares[i] = new Square(Math.floor(i % 8) * 77, Math.floor(i / 8) * 77, i);
            this.addChild(this.squares[i]);
        }
    }

    initBoard() {
        for (let i = 8; i < 16; i++) {
            this.pieces.push(new Pawn(this, this.squares[i].position, !this.boardDir));
        }
        for (let i = 48; i < 56; i++) {
            this.pieces.push(new Pawn(this, this.squares[i].position, this.boardDir));
        }

        this.pieces.push(new Rook(this, this.squares[0].position, !this.boardDir));
        this.pieces.push(new Rook(this, this.squares[7].position, !this.boardDir));
        this.pieces.push(new Knight(this, this.squares[1].position, !this.boardDir));
        this.pieces.push(new Knight(this, this.squares[6].position, !this.boardDir));
        this.pieces.push(new Bishop(this, this.squares[2].position, !this.boardDir));
        this.pieces.push(new Bishop(this, this.squares[5].position, !this.boardDir));
        this.pieces.push(new Queen(this, this.squares[3].position, !this.boardDir));
        this.pieces.push(new King(this, this.squares[4].position, !this.boardDir));

        this.pieces.push(new Rook(this, this.squares[56].position, this.boardDir));
        this.pieces.push(new Rook(this, this.squares[63].position, this.boardDir));
        this.pieces.push(new Knight(this, this.squares[57].position, this.boardDir));
        this.pieces.push(new Knight(this, this.squares[62].position, this.boardDir));
        this.pieces.push(new Bishop(this, this.squares[58].position, this.boardDir));
        this.pieces.push(new Bishop(this, this.squares[61].position, this.boardDir));
        this.pieces.push(new Queen(this, this.squares[59].position, this.boardDir));
        this.pieces.push(new King(this, this.squares[60].position, this.boardDir));
    }

    getPiece(index: number): ChessMan {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].index == index) {
                return this.pieces[i];
            }
        }
        return null;
    }

    getSquare(pos: PIXI.Point): number {
        let x: number = Math.round(pos.x / 77);
        let y: number = Math.round(pos.y / 77);
        return y * 8 + x;
    }
    setPie(old: ChessMan, pie: ChessMan) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] == old) {
                this.pieces[i] = pie;
            }
        }
    }
}