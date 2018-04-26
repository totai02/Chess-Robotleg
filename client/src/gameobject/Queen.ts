/**
 * Created by Administrator on 14/02/2017.
 */
import  "pixi.js"
import {Board} from "./Board";
import {Game} from "../Main";
import {ChessMan} from "./ChessMan";
import {Img} from "../const/Img";

export class Queen extends ChessMan {
    public board: Board;

    constructor(board: Board, position: PIXI.Point, color: boolean) {
        super();
        this.type = 5;
        this.board = board;
        if (!color) {
            this.texture = PIXI.Texture.fromImage(Img.BlackQueen);
            this.color = color;
        } else {
            this.texture = PIXI.Texture.fromImage(Img.WhiteQueen);
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
        let x: number = this.indexX;
        let y: number = this.indexY;
        while (Math.floor((a - 1) / 8) == x) {
            if (this.board.getPiece(a - 1) == null) {
                a = a - 1;
                canMove.push(a);
            } else if (this.board.getPiece(a - 1).color != this.color) {
                canMove.push(a - 1);
                break;
            } else if (this.board.getPiece(a - 1).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (Math.floor((a + 1) / 8) == x) {
            if (this.board.getPiece(a + 1) == null) {
                a = a + 1;
                canMove.push(a);
            } else if (this.board.getPiece(a + 1).color != this.color) {
                canMove.push(a + 1);
                break;
            } else if (this.board.getPiece(a + 1).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a + 8 <= 63) {
            if (this.board.getPiece(a + 8) == null) {
                a = a + 8;
                canMove.push(a);
            } else if (this.board.getPiece(a + 8).color != this.color) {
                canMove.push(a + 8);
                break;
            } else if (this.board.getPiece(a + 8).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a + 9 <= 63 && (a + 9) % 8 - 1 == (a % 8)) {
            if (this.board.getPiece(a + 9) == null) {
                a = a + 9;
                canMove.push(a);
            } else if (this.board.getPiece(a + 9).color != this.color) {
                canMove.push(a + 9);
                break;
            } else if (this.board.getPiece(a + 9).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a - 8 >= 0) {
            if (this.board.getPiece(a - 8) == null) {
                a = a - 8;
                canMove.push(a);
            } else if (this.board.getPiece(a - 8).color != this.color) {
                canMove.push(a - 8);
                break;
            } else if (this.board.getPiece(a - 8).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a - 9 >= 0 && (a - 9) % 8 + 1 == (a % 8)) {
            if (this.board.getPiece(a - 9) == null) {
                a = a - 9;
                canMove.push(a);
            } else if (this.board.getPiece(a - 9).color != this.color) {
                canMove.push(a - 9);
                break;
            } else if (this.board.getPiece(a - 9).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a + 7 <= 63 && (a + 7) % 8 + 1 == (a % 8)) {
            if (this.board.getPiece(a + 7) == null) {
                a = a + 7;
                canMove.push(a);
            } else if (this.board.getPiece(a + 7).color != this.color) {
                canMove.push(a + 7);
                break;
            } else if (this.board.getPiece(a + 7).color == this.color) {
                break;
            }
        }
        a = this.index;
        while (a - 7 >= 0 && (a - 7) % 8 - 1 == (a % 8)) {
            if (this.board.getPiece(a - 7) == null) {
                a = a - 7;
                canMove.push(a);
            } else if (this.board.getPiece(a - 7).color != this.color) {
                canMove.push(a - 7);
                break;
            } else if (this.board.getPiece(a - 7).color == this.color) {
                break;
            }
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

