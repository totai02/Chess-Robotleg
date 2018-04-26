
import {inject, injectable} from "inversify";
import {IConfig, IEventCommandMap} from "robotlegs";
import {EventCommandMap} from "robotlegs/lib/robotlegs/bender/extensions/eventCommandMap/impl/EventCommandMap";
import {ExtEvent} from "../event/ExtEvent";
import {UpdateUserCmd} from "../cmd/UpdateUserCmd";
import {UpdateRoomsCmd} from "../cmd/UpdateRoomsCmd";
import {WaitPlayerCmd} from "../cmd/WaitPlayerCmd";
import {GamePlayCmd} from "../cmd/GamePlayCmd";

@injectable()
export class CommandConfig implements IConfig{
    @inject(IEventCommandMap)
    eventCommandMap: EventCommandMap;

    configure(): void {
        this.eventCommandMap.map(ExtEvent.UpdateUserData).toCommand(UpdateUserCmd);
        this.eventCommandMap.map(ExtEvent.UpdateRoomsData).toCommand(UpdateRoomsCmd);
        this.eventCommandMap.map(ExtEvent.WaitPlayer).toCommand(WaitPlayerCmd);
        this.eventCommandMap.map(ExtEvent.GamePlayEvent).toCommand(GamePlayCmd);
    }

}