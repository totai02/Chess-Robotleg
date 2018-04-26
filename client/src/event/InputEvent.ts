/**
 * Created by Administrator on 28/04/2017.
 */
export class MouseEvent {
    public static readonly Click = "click";
    // public static readonly WClick = "pointerdown";
    public static readonly Down = "pointerdown";
    public static readonly Move = "pointermove";
    public static readonly Out = "pointerout";
    public static readonly Over = "pointerover";
    public static readonly Up = "pointerup";
    public static readonly UpOutside = "pointerupoutside";
    public static readonly RightClick = "rightclick";
    public static readonly RightDown = "rightdown";
    public static readonly RightUp = "rightup";
    public static readonly RightOutside = "rightupoutside";
}
export class TouchEvent {
    public static readonly Tap = "tap";
    public static readonly End = "touchend";
    public static readonly EndOutside = "touchendoutside";
    public static readonly Move = "touchmove";
    public static readonly Start = "touchstart";
}
export class KeyEvent {
    public static readonly Keyup = "keyup";
    public static readonly KeyDown = 'keydown';
}
export class EmitterEvent {
    public static readonly Change = "change";
    public static readonly Click = "click";
}
