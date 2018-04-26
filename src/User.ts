/**
 * Created by Administrator on 26/02/2017.
 */
import Socket = SocketIO.Socket;

export class User {

    username: string;
    avatar : number;
    money: number;
    level: number;

    constructor(userInfo: any, public socket: Socket) {
        this.username = userInfo.username;
        this.avatar = userInfo.avatar;
        this.money = userInfo.money;
        this.level = userInfo.level;
    }

    on = (event: string, fn: Function, clear = true) => {
        if (clear) this.socket.removeAllListeners(event);
        this.socket.on(event, fn);
    }

    emit = (event: string, data?: any) => {
        if (data) {
            this.socket.emit(event, data);
        } else {
            this.socket.emit(event);
        }
    }

}