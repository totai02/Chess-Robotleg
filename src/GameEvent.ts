
export class GameEvent{

    static readonly EXTENSION_RESPONSE = 'ers';
    static readonly ROOM_JOIN = 'r';
    static readonly STARTGAME = 'sg';

    static readonly GamePlayEvent = 'gpe';
    static readonly OpponentMove = 'om';
    static readonly TurnColor = 'tc';
    static readonly OpponentPromotion = 'op';
    static readonly RestartGame = 'rg';
    static readonly FinishGame = 'fg';
    static readonly PlayerLeft = 'pl';
    static readonly NewMessage = 'nm';
    static readonly OpponentTimeOut = 'nm';
}