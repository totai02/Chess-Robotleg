import {Event} from "robotlegs";

export class BoardEvent extends Event {
    public static readonly HighLight = "board_hightlight";
    public static readonly OffLight = "board_offlight";
    public static readonly ValidateMove = "board_validate";
    public static readonly StartGame = "board_startgame";

    params;

    constructor(cmd: string, params?: any) {
        super(cmd);
        this.params = params;
    }
}
