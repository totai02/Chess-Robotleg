
import {ICommand} from "robotlegs";
import {ExtEvent} from "../event/ExtEvent";
import {UpdateRoomSignal} from "../event/Signals";
import {inject, injectable} from "inversify";

@injectable()
export class UpdateRoomsCmd implements ICommand{

    @inject(ExtEvent)
    updateRoomEvent: ExtEvent;

    @inject(UpdateRoomSignal)
    updateRoom: UpdateRoomSignal;

    execute(): void {
        this.updateRoom.dispatch(this.updateRoomEvent.params);
    }
}