
import {ICommand} from "robotlegs";
import {inject, injectable} from "inversify";
import {ExtEvent} from "../event/ExtEvent";
import {UserModel} from "../model/UserModel";
import {UpdateUserDataSignal} from "../event/Signals";

@injectable()
export class UpdateUserCmd implements ICommand{

    @inject(ExtEvent)
    userDataEvent: ExtEvent;

    @inject(UserModel)
    userModel: UserModel;

    @inject(UpdateUserDataSignal)
    updateUserSignal: UpdateUserDataSignal;

    execute(): void {
        this.userModel.userName = this.userDataEvent.params.username;
        this.userModel.avatar = this.userDataEvent.params.avatar;
        this.userModel.winMatch = this.userDataEvent.params.winmatch;
        this.userModel.numMatch = this.userDataEvent.params.nummatch;
        this.userModel.level = this.userDataEvent.params.level;
        this.updateUserSignal.dispatch();
    }
}