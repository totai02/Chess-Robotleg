import {User} from "./User";
import {main} from "./Main";
import {GameEvent} from "./GameEvent";

export class Room {

    name: string;
    users = [];
    turnColor = true;
    player0accept = false;
    player1accept = false;
    id: number;
    stake: number = 0;

    constructor(id, name: string) {
        this.id = id;
        this.name = name;
    }

    addUser = (user: User) => {
        if (this.users.length == 2) return false;
        this.users.push(user);
        user.socket.emit(GameEvent.ROOM_JOIN);
        this.users[0].on("disconnect", this.onUserLeft, false);
        this.users[0].on("left room", this.onUserLeft);
        if (this.users.length == 1) {
            this.users[0].socket.emit(GameEvent.EXTENSION_RESPONSE, {cmd: 'wp'});
        } else if (this.users.length == 2) {
            this.startgame();
        }

        return true;
    };

    onUserLeft = (iUser: number) => {
        if (this.users.length == 1) {
            this.users = [];
        } else if (this.users.length == 2) {
            this.users.splice(iUser, 1);
            if (this.users[0] == null) return;
            this.users[0].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                cmd: GameEvent.GamePlayEvent,
                evt: GameEvent.PlayerLeft
            });
            main.incWinMatch(this.users[0].username);
        }
    }

    startgame = () => {
        main.incNumberOfMatch(this.users[0].username);
        main.incNumberOfMatch(this.users[1].username);
        this.player0accept = false;
        this.player1accept = false;
        this.turnColor = true;
        this.users[0].socket.emit(GameEvent.STARTGAME, {
            color: true,
            oppname: this.users[1].username,
            oppavatar: this.users[1].avatar
        });
        this.users[1].socket.emit(GameEvent.STARTGAME, {
            color: false,
            oppname: this.users[0].username,
            oppavatar: this.users[0].avatar
        });
        for (let i = 0; i < 2; i++) {

            this.users[i].on("move", (data: any) => {
                this.users[1 - i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.OpponentMove,
                    data: data
                });
                this.turnColor = !this.turnColor;
                this.users[0].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.TurnColor,
                    data: this.turnColor
                });
                this.users[1].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.TurnColor,
                    data: this.turnColor
                });
            });

            this.users[i].on("promotion", (data: any) => {
                this.users[1 - i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.OpponentPromotion,
                    data: data
                });
                this.turnColor = !this.turnColor;
                this.users[0].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.TurnColor,
                    data: this.turnColor
                });
                this.users[1].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.TurnColor,
                    data: this.turnColor
                });
            });

            this.users[i].on("restart", () => {
                if (i == 0) this.player0accept = true;
                else this.player1accept = true;
                if (this.player1accept && this.player0accept) {
                    this.users[0].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                        cmd: GameEvent.GamePlayEvent,
                        evt: GameEvent.RestartGame
                    });
                    this.users[1].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                        cmd: GameEvent.GamePlayEvent,
                        evt: GameEvent.RestartGame
                    });
                }
            });
            this.users[i].on("game finish", () => {
                if (this.users[1 - i] != null)
                    this.users[1 - i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                        cmd: GameEvent.GamePlayEvent,
                        evt: GameEvent.FinishGame
                    });
            });

            this.users[i].on("left", () => {
                if (this.users[i - 1] == null) return;
                main.incWinMatch(this.users[1 - i].username);
                this.users[1 - i].socket.emit("player left");
                this.users.splice(i, 1);
            })

            this.users[i].on("send message", (msg: string) => {
                this.users[i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                    cmd: GameEvent.GamePlayEvent,
                    evt: GameEvent.NewMessage,
                    data: {playername: this.users[i].username, message: msg}
                });
                if (this.users[1 - i] != null)
                    this.users[1 - i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                        cmd: GameEvent.GamePlayEvent,
                        evt: GameEvent.NewMessage,
                        data: {playername: this.users[i].username, message: msg}
                    });
            });

            this.users[i].on("time out", () => {
                if (this.users[1 - i] != null) {
                    main.incWinMatch(this.users[1 - i].username);
                    this.users[1 - i].socket.emit(GameEvent.EXTENSION_RESPONSE, {
                        cmd: GameEvent.GamePlayEvent,
                        evt: GameEvent.OpponentTimeOut
                    });
                }

            });
        }
    }

    isFull = () => {
        if (this.users.length >= 2) {
            return true;
        }
        return false;
    }

}