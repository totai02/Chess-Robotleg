/**
 * Created by Administrator on 14/02/2017.
 */
import "pixi.js"
import {ChessMan} from "./ChessMan";
import {Board} from "./Board"
import {Game} from "../Main";
import {Img} from "../const/Img";

export class Pawn extends ChessMan {


    constructor(board: Board, position: PIXI.Point, color: boolean) {

        super();
        this.type = 1;
        this.board = board;
        if (!color) {
            this.texture = PIXI.Texture.fromImage(Img.BlackPawn);
            this.color = color;
        } else {
            this.texture = PIXI.Texture.fromImage(Img.WhitePawn);
            this.color = color;
        }
        this.position = position;
        this.anchor.set(0.5);
        this.interactive = true;
        this.board.addChild(this);
        this.updateIndex();
    }

    public canMove = (): number[] => {
        let canMove: number[] = [];
        if (this.isFristMove == true && this.board.getPiece(this.index - 8) == null) {
            for (let i = 1; i <= 2; i++)
                if (this.board.getPiece(this.index - i * 8) == null)
                    canMove.push(this.index - i * 8)
        }
        if (this.isFristMove == false) {
            if (this.board.getPiece(this.index - 8) == null)
                canMove.push(this.index - 8)
        }


        for (let i = 0; i < this.isEat().length; i++) {
            canMove.push(this.isEat()[i]);
        }
        return canMove;
    };

    isEat(): number[] {

        let canEat: number[] = [];

        if (this.indexY != 0 && this.indexY != 7) {
            if (this.board.getPiece(this.index - 9) != null) {
                if (this.board.getPiece(this.index - 9).color != this.color) {
                    canEat.push(this.index - 9);
                }
            }
            if (this.board.getPiece(this.index - 7) != null) {
                if (this.board.getPiece(this.index - 7).color != this.color) {
                    canEat.push(this.index - 7);
                }
            }
        }
        if (this.indexY == 7) {
            if (this.board.getPiece(this.index - 9) != null) {
                if (this.board.getPiece(this.index - 9).color != this.color) {
                    canEat.push(this.index - 9);
                }
            }
        }
        if (this.indexY == 0) {
            if (this.board.getPiece(this.index - 7) != null) {
                if (this.board.getPiece(this.index - 7).color != this.color) {
                    canEat.push(this.index - 7);
                }
            }
        }

        return canEat
    }

    isTransform(): boolean {
        if (this.color && this.indexX == 0) {
            return true;
        } else if (!this.color && this.indexX == 7)
            return true;
        return false;
    }
}

