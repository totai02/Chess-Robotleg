
import {ICommand} from "robotlegs";
import {inject, injectable} from "inversify";
import {WaitPlayerSignal} from "../event/Signals";
@injectable()
export class WaitPlayerCmd implements ICommand{

    @inject(WaitPlayerSignal)
    waitPlayerSignal: WaitPlayerSignal;

    execute(): void {
        this.waitPlayerSignal.dispatch();
    }
}