import * as io from "socket.io-client"
import {App} from "./const/App";
export class Player{

    private _socket: SocketIOClient.Socket;
    private _username: string;
    private _oppname: string;
    private _color: boolean;

    public level: number;
    public winmatch: number;
    public nummatch: number;
    public avatar = (Math.round(Math.random() * 13));

    //----//

    constructor() {
        this._socket = io(App.Host);

    }

    on = (event: string, callback: any) => {
        this.socket.removeEventListener(event);
        this.socket.on(event, callback);
    };

    emit = (event: string, data?: any) => {
        if (data) this._socket.emit(event, data);
        else this._socket.emit(event);

    };

    once = (event: string, callback: any) => {
        this.socket.removeEventListener(event);
        this.socket.once(event, callback);
    };

    get socket() {
        return this._socket;
    }

    set socket(value) {
        this._socket = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get oppname(): string {
        return this._oppname;
    }

    set oppname(value: string) {
        this._oppname = value;
    }

    get color(): boolean {
        return this._color;
    }

    set color(value: boolean) {
        this._color = value;
    }
}