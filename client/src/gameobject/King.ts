/**
 * Created by Administrator on 17/02/2017.
 */

import "pixi.js"
import math = PIXI.core.math;
import {Board} from "./Board";
import {Rook} from "./Rook";
import {Game} from "../Main";
import {ChessMan} from "./ChessMan";
import {Img} from "../const/Img";

export class King extends ChessMan {
    public castling: boolean = true;

    constructor(board: Board, position: PIXI.Point, color: boolean) {
        super();
        this.type = 6;
        this.board = board;
        if (!color) {
            this.texture = PIXI.Texture.fromImage(Img.BlackKing);
            this.color = color;
        } else {
            this.texture = PIXI.Texture.fromImage(Img.WhiteKing);
            this.color = color;
        }
        this.position = position;
        this.anchor.set(0.5);
        this.interactive = true;
        board.addChild(this);
        this.updateIndex();
    }

    isCanMove(canMove: number[]): boolean {
        let x = Math.round(this.x / 77);
        let y = Math.round(this.y / 77);
        for (let i = 0; i < canMove.length; i++) {
            if (canMove[i] == y * 8 + x)
                return true;
        }
        return false;
    }

    canMove = (): number[] => {
        let canMove: number[] = [];
        let a: number = this.index;

        if (this.indexX > 0)
            if (this.board.getPiece(a - 8) == null)
                canMove.push(a - 8);
            else if (this.board.getPiece(a - 8).color != this.board.getPiece(a).color)
                canMove.push(a - 8);

        if (this.indexX < 7)
            if (this.board.getPiece(a + 8) == null)
                canMove.push(a + 8);
            else if (this.board.getPiece(a + 8).color != this.board.getPiece(a).color)
                canMove.push(a + 8);

        if (Math.floor(a / 8) == Math.floor((a + 1) / 8))
            if (this.board.getPiece(a + 1) == null)
                canMove.push(a + 1);
            else if (this.board.getPiece(a + 1).color != this.board.getPiece(a).color)
                canMove.push(a + 1);

        if (Math.floor(a / 8) == Math.floor((a - 1) / 8))
            if (this.board.getPiece(a - 1) == null)
                canMove.push(a - 1);
            else if (this.board.getPiece(a - 1).color != this.board.getPiece(a).color)
                canMove.push(a - 1);

        if ((a % 8) + 1 == (a + 9) % 8 && (a + 9) <= 63)
            if (this.board.getPiece(a + 9) == null)
                canMove.push(a + 9);
            else if (this.board.getPiece(a + 9).color != this.board.getPiece(a).color)
                canMove.push(a + 9);

        if ((a % 8) - 1 == (a - 9) % 8 && (a - 9) >= 0)
            if (this.board.getPiece(a - 9) == null)
                canMove.push(a - 9);
            else if (this.board.getPiece(a - 9).color != this.board.getPiece(a).color)
                canMove.push(a - 9);

        if ((a % 8) + 1 == (a - 7) % 8 && (a - 7) >= 0)
            if (this.board.getPiece(a - 7) == null)
                canMove.push(a - 7);
            else if (this.board.getPiece(a - 7).color != this.board.getPiece(a).color)
                canMove.push(a - 7);

        if ((a % 8) - 1 == (a + 7) % 8 && (a + 7) <= 63)
            if (this.board.getPiece(a + 7) == null)
                canMove.push(a + 7);
            else if (this.board.getPiece(a + 7).color != this.board.getPiece(a).color)
                canMove.push(a + 7);

        canMove.push(...this.isCastling());
        return canMove;
    }


    isCastling(): number[] {
        let pathCastling: number[] = [];
        if (this.board.getPiece(56) != null) {
            let a: boolean = true;
            for (let i = 57; i <= 59; i++) {
                if (this.board.getPiece(i) != null)
                    a = false;
            }
            if (a == true && this.board.getPiece(56).type == 2 && (this.board.getPiece(56) as Rook).castling == true && this.castling == true)
                pathCastling.push(57);
        }
        if (this.board.getPiece(63) != null) {
            let a: boolean = true;
            for (let i = 61; i <= 62; i++) {
                if (this.board.getPiece(i) != null)
                    a = false;
            }
            if (a == true && this.board.getPiece(63).type == 2 && (this.board.getPiece(63) as Rook).castling == true && this.castling == true)
                pathCastling.push(62);
        }
        return pathCastling;
    }
}

