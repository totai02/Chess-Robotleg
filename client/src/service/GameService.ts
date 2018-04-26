import {App} from "../const/App";
import {inject, injectable} from "inversify";
import {
    LoginSuccessSignal, LoginErrorSignal, SignupSignal, CheckNameSignal, BroadcastMsgSignal, JoinRoomSignal, StartGameSignal
} from "../event/Signals";
import {EventDispatcher, IEventDispatcher} from "robotlegs";
import {ExtEvent} from "../event/ExtEvent";
import {GameEvent} from "../event/GameEvent";
import {Request} from "./Request";

@injectable()
export class GameService {
    private socket: SocketIOClient.Socket;

    @inject(IEventDispatcher)
    evenDispatcher: EventDispatcher;

    @inject(LoginErrorSignal)
    loginErrorSignal: LoginErrorSignal;

    @inject(LoginSuccessSignal)
    loginSuccessSignal: LoginSuccessSignal;

    @inject(CheckNameSignal)
    checkNameSignal: CheckNameSignal;

    @inject(SignupSignal)
    signupSignal: SignupSignal;

    @inject(BroadcastMsgSignal)
    messageSignal: BroadcastMsgSignal;

    @inject(JoinRoomSignal)
    joinRoomSignal: JoinRoomSignal;

    @inject(StartGameSignal)
    startGameSignal: StartGameSignal;

    connect = () => {
        this.socket = io(App.Host);
        this.mapEvent();
    };

    login = (userName: string, password: string) => {
        this.socket.emit(Request.Login, {username: userName, password: password});

    };

    signUp = (userName: string, password: string) => {
        this.socket.emit(Request.Signup, {username: userName, password: password});
    };

    sendExtRequest = (event: string, data?) => {
        if (data) this.socket.emit(event, data);
        else this.socket.emit(event);
    };

    checkName = (username: string, fn: Function) => {
        this.socket.emit(Request.CheckName, username);
        this.socket.once(GameEvent.CHECKNAME, fn);
    };

    getUserData = (userName: string) => {
        this.socket.emit(Request.UserData, userName);
    }

    getRoomData = () => {
        this.socket.emit(Request.RoomData);
    }


    mapEvent = () => {
        this.socket.on(GameEvent.LOGIN, this.onLogin);
        this.socket.on(GameEvent.LOGIN_ERR, this.onLoginErr);

        this.socket.on(GameEvent.SIGNUP, this.onSignup);

        this.socket.on(GameEvent.EXTENSION_RESPONSE, this.onExtensionRes);

        this.socket.on(GameEvent.USERDATA, this.onUpdateUserData);

        this.socket.on(GameEvent.ROOM_JOIN, this.onRoomJoin);
        this.socket.on(GameEvent.ROOM_JOIN_ERR, this.onRoomJoinErr);
        this.socket.on(GameEvent.ROOMDATA, this.onReceiveRoomData);

        this.socket.on(GameEvent.NEWMESSAGE, this.onReceiveMessage);

        this.socket.on(GameEvent.STARTGAME, this.onStartGame);
    };

    onUpdateUserData = (data: any) => {
        this.evenDispatcher.dispatchEvent(new ExtEvent(ExtEvent.UpdateUserData, data))
    }

    onExtensionRes = (e: any) => {
        this.evenDispatcher.dispatchEvent(new ExtEvent(e.cmd, e));
    }

    onSignup = (e: any) => {
        this.signupSignal.dispatch(e);
    }

    onLogin = (data: any) => {
        this.loginSuccessSignal.dispatch(data);
    }

    onLoginErr = (e: any) => {
        this.loginErrorSignal.dispatch(e);
    }

    onRoomJoin = (e: any) => {
        this.joinRoomSignal.dispatch();
    }

    onReceiveRoomData = (e) => {
        this.evenDispatcher.dispatchEvent(new ExtEvent(ExtEvent.UpdateRoomsData, e));
    }

    onRoomJoinErr = (e: any) => {
        this.evenDispatcher.dispatchEvent(new ExtEvent(ExtEvent.JoinRoomErr, e));
    }

    onReceiveMessage = (e: any) => {
        this.messageSignal.dispatch(e);
    }

    onStartGame = (e) => {
        this.startGameSignal.dispatch(e);
    }

}