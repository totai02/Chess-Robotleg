import {Event} from "robotlegs";

export class ExtEvent extends Event {

    static readonly UpdateUserData = 'uud';
    static readonly UpdateRoomsData = 'urd';
    static readonly JoinRoomErr = 'jre';
    static readonly WaitPlayer = 'wp';
    static readonly GamePlayEvent = 'gpe';

    static readonly OpponentMove = 'om';
    static readonly TurnColor = 'tc';
    static readonly OpponentPromotion = 'op';
    static readonly RestartGame = 'rg';
    static readonly FinishGame = 'fg';
    static readonly PlayerLeft = 'pl';
    static readonly NewMessage = 'nm';
    static readonly OpponentTimeOut = 'nm';

    params: any;

    constructor(cmd: string, params: any) {
        super(cmd);
        this.params = params;
    }
}