import {SignalMediator} from "robotlegs-signalmediator";
import {ChessMan} from "../gameobject/ChessMan";
import {MouseEvent} from "../event/InputEvent";
import {Game, game} from "../Main";
import {BoardEvent} from "../event/BoardEvent";
import {inject} from "inversify";
import {BoardModel} from "../model/BoardModel";


export class ChessManMediator extends SignalMediator<ChessMan> {
    @inject(BoardModel)
    boardModel: BoardModel;

    initialize(): void {
        this.eventMap.mapListener(this.view, MouseEvent.Down, this.onDragStart);
        this.eventMap.mapListener(this.view, MouseEvent.Move, this.onDragMove);
        this.eventMap.mapListener(this.view, MouseEvent.Up, this.onDragEnd);
    }

    onDragStart = (event) => {
        if (this.boardModel.userColor == this.view.color && this.view.color == this.boardModel.colorTurn) {
            this.view.data = event.data;
            this.view.pos = new PIXI.Point(this.view.x, this.view.y);
            this.view.scale.set(1.3);
            this.view.dragging = true;
            this.view.board.setChildIndex(this.view, this.view.board.children.length - 1);
            this.view.canM = this.view.canMove();
            this.dispatch(new BoardEvent(BoardEvent.HighLight, this.view.canM));
        }
    };

    onDragMove = () => {
        if (this.view.dragging) {
            let newPosition = this.view.data.getLocalPosition(this.view.parent);
            this.view.x = newPosition.x;
            this.view.y = newPosition.y;
        }
    };

    onDragEnd = () => {
        if (this.boardModel.userColor == this.view.color && this.view.color == this.boardModel.colorTurn) {
            this.view.dragging = false;
            this.view. scale.set(1);
            this.view.position = this.getTrunc(this.view.position);
            if ((this.view.x >550 || this.view.x < 0 || this.view.y < 0 || this.view.y > 550) || this.view.isCanMove(this.view.canM) == false) {
                this.view.position = this.view.pos;
            } else {
                if (Math.round(this.view.y / 77) * 8 + Math.round(this.view.x / 77) == this.view.index) {
                    return;
                }
                this.dispatch(new BoardEvent(BoardEvent.ValidateMove, this.view));
            }
            this.dispatch(new BoardEvent(BoardEvent.OffLight));
        }
        this.view.data = null;
    };


    public getTrunc(pos: PIXI.Point): PIXI.Point {
        return new PIXI.Point(Math.round(pos.x / 77) * 77, Math.round(pos.y / 77) * 77);
    }


    destroy(): void {

    }
}