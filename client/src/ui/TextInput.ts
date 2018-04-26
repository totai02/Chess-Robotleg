export function PixiTextInput(text?, style?) {
    PIXI.Container.call(this);

    if (!text)
        text = "";

    text = text.toString();

    if (style && style.wordWrap)
        throw "wordWrap is not supported for input fields";

    this._text = text;

    this.localWidth = 100;
    this._backgroundColor = 0xffffff;
    this._caretColor = 0x000000;
    this._background = true;

    if (style) {
        this.style = style;
        this._caretColor = parseInt((<string>style.fill).substr(1), 16);
    }
    else this.style = new PIXI.TextStyle({});
    this.textField = new PIXI.Text(this._text, style);

    this.localHeight = this.textField.height;

    this.backgroundGraphics = new PIXI.Graphics();
    this.textFieldMask = new PIXI.Graphics();
    this.caret = new PIXI.Graphics();
    this.drawElements();
    this._isPass = false;
    this.addChild(this.backgroundGraphics);
    this.addChild(this.textField);
    this.addChild(this.caret);
    this.addChild(this.textFieldMask);

    this.scrollIndex = 0;
    this._caretIndex = 0;
    this.caretFlashInterval = null;
    this.blur();
    this.updateCaretPosition();

    this.backgroundGraphics.interactive = true;
    this.backgroundGraphics.buttonMode = true;
    this.backgroundGraphics.defaultCursor = "text";

    this.backgroundGraphics.mousedown = this.onBackgroundMouseDown.bind(this);
    this.keyEventClosure = this.onKeyEvent.bind(this);
    this.windowBlurClosure = this.onWindowBlur.bind(this);
    this.documentMouseDownClosure = this.onDocumentMouseDown.bind(this);
    this.isFocusClick = false;

    this.updateText();

    this.textField.mask = this.textFieldMask;

    this.keypress = null;
    this.keydown = null;
    this.change = null;
}

PixiTextInput.prototype = Object.create(PIXI.Container.prototype);

PixiTextInput.prototype.constructor = PixiTextInput;

PixiTextInput.prototype.onBackgroundMouseDown = function (e) {
    let x = this.toLocal(e.data.global).x;
    this._caretIndex = this.getCaretIndexByCoord(x);
    this.updateCaretPosition();

    this.focus();

    this.isFocusClick = true;
    let scope = this;
    setTimeout(function () {
        scope.isFocusClick = false;
    }, 0);
}

PixiTextInput.prototype.focus = function () {
    this.blur();

    document.addEventListener("keydown", this.keyEventClosure);
    document.addEventListener("keypress", this.keyEventClosure);
    document.addEventListener("mousedown", this.documentMouseDownClosure);
    window.addEventListener("blur", this.windowBlurClosure);

    this.showCaret();
}

PixiTextInput.prototype.onKeyEvent = function (e) {

    if (e.type == "keypress") {
        if (e.charCode == 13) this.onEnterPress();

        if (e.charCode < 32)
            return;

        this._text =
            this._text.substring(0, this._caretIndex) +
            String.fromCharCode(e.charCode) +
            this._text.substring(this._caretIndex);

        this._caretIndex++;
        this.ensureCaretInView();
        this.showCaret();
        this.updateText();
        this.trigger(this.keypress, e);
        this.trigger(this.change);

    }

    if (e.type == "keydown") {
        switch (e.keyCode) {


            case 8:
                if (this._caretIndex > 0) {
                    this._text =
                        this._text.substring(0, this._caretIndex - 1) +
                        this._text.substring(this._caretIndex);
                    this._caretIndex--;
                    this.scrollIndex--;
                    this.ensureCaretInView();
                    this.showCaret();
                    this.updateText();
                }
                e.preventDefault();
                this.trigger(this.change);
                break;

            case 46:
                this._text =
                    this._text.substring(0, this._caretIndex) +
                    this._text.substring(this._caretIndex + 1);

                this.ensureCaretInView();
                this.updateCaretPosition();
                this.showCaret();
                this.updateText();
                e.preventDefault();
                this.trigger(this.change);
                break;

            case 39:
                this._caretIndex++;
                if (this._caretIndex > this._text.length)
                    this._caretIndex = this._text.length;

                this.ensureCaretInView();
                this.updateCaretPosition();
                this.showCaret();
                this.updateText();
                break;

            case 37:
                this._caretIndex--;
                if (this._caretIndex < 0)
                    this._caretIndex = 0;

                this.ensureCaretInView();
                this.updateCaretPosition();
                this.showCaret();
                this.updateText();
                break;
        }

        this.trigger(this.keydown, e);
    }
}

PixiTextInput.prototype.ensureCaretInView = function () {
    this.updateCaretPosition();

    while (this.caret.position.x >= this.localWidth - 1) {
        this.scrollIndex++;
        this.updateCaretPosition();
    }

    while (this.caret.position.x < 0) {
        this.scrollIndex -= 2;
        if (this.scrollIndex < 0)
            this.scrollIndex = 0;
        this.updateCaretPosition();
    }
}

PixiTextInput.prototype.blur = function () {
    document.removeEventListener("keydown", this.keyEventClosure);
    document.removeEventListener("keypress", this.keyEventClosure);
    document.removeEventListener("mousedown", this.documentMouseDownClosure);
    window.removeEventListener("blur", this.windowBlurClosure);

    this.hideCaret();
}

PixiTextInput.prototype.onDocumentMouseDown = function () {
    if (!this.isFocusClick)
        this.blur();
}

PixiTextInput.prototype.onWindowBlur = function () {
    this.blur();
}

PixiTextInput.prototype.updateCaretPosition = function () {
    if (this._caretIndex < this.scrollIndex) {
        this.caret.position.x = -1;
        return;
    }

    let sub = this._text.substring(0, this._caretIndex).substring(this.scrollIndex);
    this.caret.position.x = this.textField.context.measureText(sub).width;
}

PixiTextInput.prototype.updateText = function () {
    this.textField.setText(this._text.substring(this.scrollIndex));
}

PixiTextInput.prototype.drawElements = function () {
    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(this._backgroundColor);

    if (this._background)
        this.backgroundGraphics.drawRect(0, 0, this.localWidth, this.localHeight);

    this.backgroundGraphics.endFill();
    this.backgroundGraphics.hitArea = new PIXI.Rectangle(0, 0, this.localWidth, this.localHeight);

    this.textFieldMask.clear();
    this.textFieldMask.beginFill(this._backgroundColor);
    this.textFieldMask.drawRect(0, 0, this.localWidth, this.localHeight);
    this.textFieldMask.endFill();

    this.caret.clear();
    this.caret.beginFill(this._caretColor);
    this.caret.drawRect(1, 1, 2, this.localHeight - 2);
    this.caret.endFill();
}

PixiTextInput.prototype.showCaret = function () {
    if (this.caretFlashInterval) {
        clearInterval(this.caretFlashInterval);
        this.caretFlashInterval = null;
    }

    this.caret.visible = true;
    this.caretFlashInterval = setInterval(this.onCaretFlashInterval.bind(this), 500);
}

PixiTextInput.prototype.hideCaret = function () {
    if (this.caretFlashInterval) {
        clearInterval(this.caretFlashInterval);
        this.caretFlashInterval = null;
    }

    this.caret.visible = false;
}

PixiTextInput.prototype.onCaretFlashInterval = function () {
    this.caret.visible = !this.caret.visible;
}

PixiTextInput.prototype.getCaretIndexByCoord = function (x) {
    let smallest = 10000;
    let cand = 0;
    let visible = this._text.substring(this.scrollIndex);

    for (let i = 0; i < visible.length + 1; i++) {
        let sub = visible.substring(0, i);
        let w = this.textField.context.measureText(sub).width;

        if (Math.abs(w - x) < smallest) {
            smallest = Math.abs(w - x);
            cand = i;
        }
    }

    return this.scrollIndex + cand;
}

Object.defineProperty(PixiTextInput.prototype, "width", {
    get: function () {
        return this.scale.x * this.getLocalBounds().width;
    },

    set: function (v) {
        this.localWidth = v;
        this.drawElements();
        this.ensureCaretInView();
        this.updateText();
    }
});

Object.defineProperty(PixiTextInput.prototype, "text", {
    get: function () {
        return this._text;
    },

    set: function (v) {
        this._text = v.toString();
        this.scrollIndex = 0;
        this.caretIndex = 0;
        this.blur();
        this.updateText();
    }
});

Object.defineProperty(PixiTextInput.prototype, "backgroundColor", {
    get: function () {
        return this._backgroundColor;
    },

    set: function (v) {
        this._backgroundColor = v;
        this.drawElements();
    }
});

Object.defineProperty(PixiTextInput.prototype, "caretColor", {
    get: function () {
        return this._caretColor;
    },

    set: function (v) {
        this._caretColor = v;
        this.drawElements();
    }
});

Object.defineProperty(PixiTextInput.prototype, "background", {
    get: function () {
        return this._background;
    },

    set: function (v) {
        this._background = v;
        this.drawElements();
    }
});

PixiTextInput.prototype.setText = function (v) {
    this.text = v;
}

PixiTextInput.prototype.trigger = function (fn, e) {
    if (fn)
        fn(e);
}

