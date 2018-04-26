import {injectable} from "inversify";

@injectable()
export class UserModel{
    userName: string;
    avatar: number;
    winMatch: number;
    numMatch: number;
    level: number;

    incWinMatch = ()=>{
        this.winMatch++;
    }

    incNumMatch = ()=>{
        this.numMatch++;
    }

    changeAvatar = (av: number)=>{
        this.avatar = av;
    }
}