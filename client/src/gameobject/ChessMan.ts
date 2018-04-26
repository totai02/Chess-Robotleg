/**
 * Created by Administrator on 14/02/2017.
 */

import "pixi.js"
import Sprite = PIXI.Sprite;
import {Board} from "./Board";


export abstract class ChessMan extends Sprite {

    index: number;
    type: number;
    color: boolean;
    pos: PIXI.Point;
    board: Board;
    data: any;
    dragging: any;
    canM: number[];
    isFristMove: boolean = true;

    get indexX(): number {
        return (Math.floor(this.index / 8));
    }

    get indexY(): number {
        return (this.index % 8);
    }

    setColor(color: boolean) {
        this.color = color;
    }

    public move = (index: number): number => {
        let x = (index % 8) * 77;
        let y = Math.floor(index / 8) * 77;
        let dx = Math.abs(Math.floor(this.index % 8) - Math.floor(index % 8));
        let dy = Math.abs(Math.floor(this.index / 8) - Math.floor(index / 8));
        let duration = Math.floor(Math.sqrt(dx * dx + dy * dy)) / 2;
        this.parent.setChildIndex(this, this.parent.children.length - 1);
        TweenMax.to(this, duration, {x: x, y: y});
        return duration;
    }

    public abstract canMove : Function;

    updateIndex = () => {
        let x = Math.round(this.x / 77);
        let y = Math.round(this.y / 77);
        this.index = y * 8 + x;
    }

    isCanMove(canMove: number[]): boolean {
        if (!canMove) return false;
        let x = Math.round(this.x / 77);
        let y = Math.round(this.y / 77);
        for (let i = 0; i < canMove.length; i++) {
            if (canMove[i] == y * 8 + x)
                return true;
        }
        return false;
    }
}