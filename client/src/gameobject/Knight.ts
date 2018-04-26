/**
 * Created by Administrator on 14/02/2017.
 */
import  "pixi.js"
import math = PIXI.core.math;
import {Board} from "./Board";
import {Game} from "../Main";
import {ChessMan} from "./ChessMan";
import {Img} from "../const/Img";

export class Knight extends ChessMan {
    private nhapcung: boolean;

    constructor(board: Board, position: PIXI.Point, color: boolean) {
        super();
        this.type = 3;
        this.board = board;
        if (!color) {
            this.texture = PIXI.Texture.fromImage(Img.BlackKnight);
            this.color = color;
        } else {
            this.texture = PIXI.Texture.fromImage(Img.WhiteKnight);
            this.color = color;
        }
        this.position = position;
        this.anchor.set(0.5);
        this.interactive = true;
        board.addChild(this);

        this.updateIndex();
    }

    canMove = (): number[] => {
        let canMove: number[] = [];
        let a: number = this.index;
        if (a + 17 <= 63 && Math.floor(a / 8) + 2 == Math.floor((a + 17) / 8)) {
            if (this.board.getPiece(a + 17) == null)
                canMove.push(a + 17);
            else if (this.color != this.board.getPiece(a + 17).color) {
                canMove.push(a + 17);
            }
        }
        if (a + 15 <= 63 && Math.floor(a / 8) + 2 == Math.floor((a + 15) / 8))
            if (this.board.getPiece(a + 15) == null)
                canMove.push(a + 15);
            else if (this.color != this.board.getPiece(a + 15).color) {
                canMove.push(a + 15);
            }
        if (a - 17 >= 0 && Math.floor(a / 8) - 2 == Math.floor((a - 17) / 8))
            if (this.board.getPiece(a - 17) == null)
                canMove.push(a - 17);
            else if (this.color != this.board.getPiece(a - 17).color) {
                canMove.push(a - 17);
            }
        if (a - 15 >= 0 && Math.floor(a / 8) - 2 == Math.floor((a - 15) / 8))
            if (this.board.getPiece(a - 15) == null)
                canMove.push(a - 15);
            else if (this.color != this.board.getPiece(a - 15).color) {
                canMove.push(a - 15);
            }
        if (a + 6 <= 63 && Math.floor(a / 8) + 1 == Math.floor((a + 6) / 8))
            if (this.board.getPiece(a + 6) == null)
                canMove.push(a + 6);
            else if (this.color != this.board.getPiece(a + 6).color) {
                canMove.push(a + 6);
            }
        if (a + 10 <= 63 && Math.floor(a / 8) + 1 == Math.floor((a + 10) / 8))
            if (this.board.getPiece(a + 10) == null)
                canMove.push(a + 10);
            else if (this.color != this.board.getPiece(a + 10).color) {
                canMove.push(a + 10);
            }
        if (a - 6 >= 0 && Math.floor(a / 8) - 1 == Math.floor((a - 6) / 8))
            if (this.board.getPiece(a - 6) == null)
                canMove.push(a - 6);
            else if (this.color != this.board.getPiece(a - 6).color) {
                canMove.push(a - 6);
            }
        if (a - 10 >= 0 && Math.floor(a / 8) - 1 == Math.floor((a - 10) / 8))
            if (this.board.getPiece(a - 10) == null)
                canMove.push(a - 10);
            else if (this.color != this.board.getPiece(a - 10).color) {
                canMove.push(a - 10);
            }
        return canMove;
    }

    isEat(): number[] {
        let canEat: number[];
        let canMove = this.canMove();
        for (let i = 0; i < canMove.length; i++) {
            if (this.board.getPiece(canMove[i]).color != this.board.getPiece(this.index).color) {
                canEat.push(canMove[i]);
            }
        }
        return canEat
    }
}

