import {Signal} from "signals.js"
import {injectable} from "inversify";
import any = PIXI.utils.isMobile.any;

@injectable()
export class ChangePlayerNameSignal extends Signal {
    constructor() {
        super(Number, String);
    }
}

@injectable()
export class ChangPlayerAvatarSignal extends Signal {
    constructor() {
        super(Number, Number);
    }
}

@injectable()
export class StopTimeCountSignal extends Signal {
    constructor() {
        super(Number);
    }
}

@injectable()
export class StartTimeCountSignal extends Signal{
    constructor(){
        super(Number);
    }
}

@injectable()
export class TimeOutSignal extends Signal{
    constructor(){
        super(Number);
    }
}

@injectable()
export class UpdateUserDataSignal extends Signal{
}

@injectable()
export class UpdateRoomSignal extends Signal{
}

@injectable()
export class CheckNameSignal extends Signal{
}

@injectable()
export class SignupSignal extends Signal{
}

@injectable()
export class LoginErrorSignal extends Signal{
}

@injectable()
export class LoginSuccessSignal extends Signal{

}

@injectable()
export class BroadcastMsgSignal extends Signal{

}

@injectable()
export class JoinRoomSignal extends Signal{

}

@injectable()
export class WaitPlayerSignal extends Signal{

}

@injectable()
export class StartGameSignal extends Signal{

}

@injectable()
export class PlayerLeftSignal extends Signal{

}

@injectable()
export class MessageSignal extends Signal{

}

@injectable()
export class OpponentMoveSignal extends Signal{

}
@injectable()
export class TurnColorSignal extends Signal{

}
@injectable()
export class OpponentPromotionSignal extends Signal{

}

@injectable()
export class RestartGameSignal extends Signal{

}

@injectable()
export class GameFinishSignal extends Signal{

}

@injectable()
export class OpponentTimeOutSignal extends Signal{

}



