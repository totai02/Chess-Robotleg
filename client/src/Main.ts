import "pixi.js"
import 'reflect-metadata';
import 'screenfull';

import {Panel} from "./ui/Panel";
import {AppView} from "./view/AppView";
import {Context, MVCSBundle} from "robotlegs";
import {ContextView, PixiBundle} from "robotlegs-pixi";
import {SignalMediatorExtension} from "robotlegs-signalmediator";
import {SignalCommandMapExtension} from "robotlegs-signalcommandmap";
import {ViewConfig} from "./config/ViewConfig";
import {SignalConfig} from "./config/AppConfig";
import {LoginView} from "./view/LoginView";
import {App} from "./const/App";
import {Img} from "./const/Img";
import screenfull = require("screenfull");
import {CommandConfig} from "./config/CommandConfig";

export class Game {
    public static colorTurn;

    public static app: PIXI.Application;
    public static uiContainer: PIXI.Container;
    public static tempContainer: PIXI.Container;
    public static gameContainer: PIXI.Container;
    public static appView: AppView;
    static player;

    constructor() {
        this.gameInit();
    }

    gameInit = () => {
        let options = App.isWeb ? {
            transparent: true,
            antialias: true,
            roundPixels: true,
        } : {
            transparent: false,
            autoResize: true,
            antialias: false,
            resolution: window.devicePixelRatio || 1,
            roundPixels: true,
        };
        Game.app = new PIXI.Application(1280, 768, options);
        document.body.appendChild(Game.app.view);

        Game.appView = new AppView();

        Game.uiContainer = new PIXI.Container();
        Game.tempContainer = new PIXI.Container();
        Game.gameContainer = new PIXI.Container();
        let background = PIXI.Sprite.fromImage(Img.Background);
        background.width = 1280;
        background.height = 768;
        Game.app.stage.addChild(background);

        Game.app.stage.addChild(Game.gameContainer);
        Game.app.stage.addChild(Game.tempContainer);
        Game.app.stage.addChild(Game.uiContainer);

        Game.uiContainer.addChild(Panel.panel);

        new Context().install(MVCSBundle, PixiBundle, SignalMediatorExtension, SignalCommandMapExtension)
            .configure(new ContextView(Game.app.renderer.plugins.interaction))
            .configure(ViewConfig, SignalConfig, CommandConfig)
            .initialize();
        if (!App.isWeb) {
            this.resize();
            Game.app.stage.scale.set(App.W / 1280, App.H / 768);
            if (screenfull.enabled) screenfull.request();
        }

        Game.appView.loadView(new LoginView());
    }
    resize = () => {
        App.W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        App.H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
}


//
export let game = new Game();
