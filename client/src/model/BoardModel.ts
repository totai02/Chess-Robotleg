
import {injectable} from "inversify";

@injectable()
export class BoardModel{

    userColor: boolean;
    colorTurn: boolean;
}