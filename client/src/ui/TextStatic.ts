/**
 * Created by Administrator on 11/03/2017.
 */
export class TextStatic extends PIXI.Text {

    constructor(text: string, public w: number, style?: PIXI.TextStyle) {
        super(text);
        if (style) {
            this.style = style;
        } else {
            this.style = new PIXI.TextStyle(
                {
                    fontFamily: 'JasmineUPC Bold',
                    fontSize: 52,
                    fontWeight: 'bold',
                    fill: '#613012',
                });
        }
        let graphic = new PIXI.Graphics();
        graphic.drawRect(0, 0, w, 100);
        this.addChild(graphic);
        this.mask = graphic;
    }

    setAnchor = (x?: number, y?: number) => {
        this.removeChildren();
        this.anchor.set(x, y);
        let graphic = new PIXI.Graphics();
        graphic.drawRect(-x * this.w, y ? -y * 100 : -x * 100, this.w, 100);
        this.addChild(graphic);
        this.mask = graphic;
    }
}