import {User} from "./User";
import {Room} from "./Room";
import {Request} from "../client/src/service/Request";
import {GameEvent} from "../client/src/event/GameEvent";
export class Queue {

    users: User[];
    rooms: Room[];

    constructor() {
        this.users = [];
        this.rooms = [];
        for (let i = 0; i < 50; i++) {
            this.rooms.push(new Room(i, "Room " + i));
        }
    }

    addUser = (user: User) => {
        this.users.push(user);
        this.initPlayerEvent(user);
    };

    isOnline = (userName: string) => {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username == userName) return true;
        }
        return false;
    }

    initPlayerEvent = (user: User) => {

        user.on(Request.RoomData, () => {
            user.emit(GameEvent.ROOMDATA, this.getRoomList());
        });
        user.on(Request.JoinRoom, (roomID) => {
            let findRoom = false;
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].id == roomID) {
                    findRoom = true;
                    if (!this.rooms[i].addUser(user)) {
                        user.emit(GameEvent.ROOM_JOIN_ERR, 'rl');
                    }
                    break;
                }
            }
            if (!findRoom) user.emit(GameEvent.ROOM_JOIN_ERR, 'cfr');
        });

        user.on(Request.BroadcastMsg, (msg: string) => {
            user.emit(GameEvent.NEWMESSAGE, {playername: user.username, message: msg});
            user.socket.broadcast.emit(GameEvent.NEWMESSAGE, {playername: user.username, message: msg})
        });

        user.on("disconnect", () => {
            let index = this.users.findIndex((element): boolean => {
                return element == user;
            });
            this.users.splice(index, 1);
        }, false);
    }

    getRoomList = () => {
        let k = 1;
        let roomArr = [];
        for (let i = 0; i < 20; i++) {
            let done = false;
            while (this.rooms[k].isFull()) {
                k++;
                if (k >= this.rooms.length) {
                    done = true;
                    break;
                }
            }
            if (!done) {
                roomArr.push({
                    id: this.rooms[k].id,
                    name: this.rooms[k].name,
                    stake: this.rooms[k].stake,
                    playerNumber: this.rooms[k].users.length
                });
                k++;
            }
            else break;
        }
        return roomArr;

    }
}