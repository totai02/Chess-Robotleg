import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import * as mongoose from "mongoose";
import Socket = SocketIO.Socket;
import {Queue} from "./Queue";
import {Schema} from "mongoose";
import {User} from "./User";
import {GameEvent} from "../client/src/event/GameEvent";
import {Request} from "../client/src/service/Request";

let userSchema = new Schema({
    username: String,
    password: String,
    avatar: Number,
    winmatch: Number,
    nummatch: Number,
    level: Number
});
let User_db = mongoose.model('user', userSchema);

class Main {

    app = express();
    server = http.createServer(this.app);
    io = SocketIO(this.server);
    port = process.env.PORT || 80;
    queue: Queue;
    uri = 'mongodb://totai:123456@ds161410.mlab.com:61410/account_db';

    constructor() {
        this.app.use(express.static(__dirname + '/../public'));
        this.io.on('connection', this.onConnect);
        this.server.listen(this.port, this.onListen);
        this.queue = new Queue();
        mongoose.connect(this.uri, (err) => {
            if (err) {
                console.log(err.message);
                console.log(err);
            }
            else {
                console.log('Connected to MongoDb');
            }
        });

    }

    onConnect = (socket: Socket) => {

        socket.on(Request.Login, (data: any) => {
            if (this.queue.isOnline(data.username)) {
                socket.emit(GameEvent.LOGIN_ERR, {
                    msg: "Someone is signing in to this account.",
                    evt: "LOGIN ERROR"
                });
            } else {
                this.checkAccount(data.username, data.password).then((user: any) => {
                    if (!user) {
                        socket.emit(GameEvent.LOGIN_ERR, {
                            msg: "Invalid Login or password.",
                            evt: "LOGIN ERROR"
                        });
                    }
                    else {
                        socket.emit(GameEvent.LOGIN, user);
                        console.log(user);
                        this.queue.addUser(new User(user, socket));
                    }
                });
            }
        });

        socket.on(Request.UserData, (username: string) => {
            this.checkAccount(username).then((user: any) => {
                socket.emit(GameEvent.USERDATA, user);
            });
        });

        socket.on(Request.Signup, (data: any) => {
            this.createAccount(data).then((success) => {
                if (success) {
                    socket.emit(GameEvent.SIGNUP, {
                        msg: "Sign up success!",
                        evt: "SIGNUP SUCCESS"
                    });

                } else {
                    socket.emit(GameEvent.SIGNUP, {
                        msg: "That username is taken. Try another",
                        evt: "SIGNUP ERROR"
                    });
                }
            });
        });

        socket.on(Request.CheckName, (userName: string) => {
            this.checkAccount(userName).then((user) => {
                if (user != null) {
                    socket.emit(GameEvent.CHECKNAME, true);
                } else {
                    socket.emit(GameEvent.CHECKNAME, false);
                }
            });
        });


    }


    checkAccount(userName: string, password: string = "") {
        return new Promise((resolve) => {
            if (password != "") {
                User_db.findOne({username: userName, password: password},
                    (err, data) => {
                        if (err) return console.error(err);
                        resolve(data);
                    });
            } else {
                User_db.findOne({username: userName},
                    (err, data) => {
                        if (err) return console.error(err);
                        resolve(data);
                    });
            }
        });
    }

    async createAccount(userInfo: any) {

        let exist = await this.checkAccount(userInfo.username);
        if (exist) {
            return false;
        } else {
            let user = new User_db({
                username: userInfo.username,
                password: userInfo.password,
                avatar: 1 + Math.floor(Math.random() * 13),
                winmatch: 0,
                nummatch: 0,
                level: 1
            });

            user.save((err) => {
                if (err) {
                    console.log("Error creating account! " + err);
                }
            });
            return true;
        }
    }


    onListen = () => {
        console.log("Server created ...");
    }

    incNumberOfMatch = (username: string) => {
        User_db.findOneAndUpdate({username: username}, {$inc: {nummatch: 1}}, function (err, data) {
            if (err) console.log("Update Error");
        });
    };

    incWinMatch = (username: string) => {
        User_db.findOneAndUpdate({username: username}, {$inc: {winmatch: 1}}, function (err, data) {
            if (err) console.log("Update Error");
        });
    };
}

export let main = new Main();
