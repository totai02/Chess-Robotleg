import {SignalMediator} from "robotlegs-signalmediator";
import {Board} from "../gameobject/Board";
import {Panel} from "../ui/Panel";
import {Game} from "../Main";
import {HallView} from "../view/HallView";
import {GameView} from "../view/GameView";
import {ChessMan} from "../gameobject/ChessMan";
import {ChangeBoard} from "../gameobject/ChangeBoard";
import {Pawn} from "../gameobject/Pawn";
import {Rook} from "../gameobject/Rook";
import {King} from "../gameobject/King";
import {BoardEvent} from "../event/BoardEvent";
import {inject} from "inversify";
import {BoardModel} from "../model/BoardModel";
import {
    GameFinishSignal, MessageSignal,
    OpponentMoveSignal, OpponentPromotionSignal, OpponentTimeOutSignal, PlayerLeftSignal, RestartGameSignal,
    StartGameSignal,
    TurnColorSignal
} from "../event/Signals";
import {UserModel} from "../model/UserModel";
import {GameService} from "../service/GameService";

export class BoardMediator extends SignalMediator<Board> {

    @inject(BoardModel)
    boardModel: BoardModel;

    @inject(UserModel)
    userModel: UserModel;
    
    @inject(GameService)
    gameService: GameService;

    @inject(OpponentMoveSignal)
    opponentMoveSignal: OpponentMoveSignal;

    @inject(TurnColorSignal)
    turnColorSignal: TurnColorSignal;

    @inject(OpponentPromotionSignal)
    opponentPromotionSignal: OpponentPromotionSignal;

    @inject(RestartGameSignal)
    restartGameSignal: RestartGameSignal;

    @inject(GameFinishSignal)
    gameFinishSignal: GameFinishSignal;

    @inject(PlayerLeftSignal)
    playerLeftSignal: PlayerLeftSignal;


    @inject(OpponentTimeOutSignal)
    opponentTimeOutSignal: OpponentTimeOutSignal;

    initialize(): void {
        this.eventDispatcher.addEventListener(BoardEvent.StartGame, (event) => this.startGame(event.params));
        this.eventDispatcher.addEventListener(BoardEvent.HighLight, (event) => this.highLight(event.params));
        this.eventDispatcher.addEventListener(BoardEvent.OffLight, this.offLight);
        this.eventDispatcher.addEventListener(BoardEvent.ValidateMove, (event) => this.validateMove(event.params));

        this.addToSignal(this.opponentMoveSignal, this.onChessMove);
        this.addToSignal(this.turnColorSignal, this.turnColorChange);
        this.addToSignal(this.opponentPromotionSignal, this.opponentPromotion);
        this.addToSignal(this.restartGameSignal, this.restartGame);
        this.addToSignal(this.gameFinishSignal, this.gameFinish.bind(!this.boardModel.colorTurn));
        this.addToSignal(this.opponentPromotionSignal, this.opponentPromotion);
    }

    onSignalDispatch = (msg) => {
        console.log("Success : " + msg);
    }

    destroy(): void {

    }

    turnColorChange = (turn: boolean)=>{
        Game.gameContainer.interactiveChildren = false;
        this.boardModel.colorTurn = turn;
        if (this.boardModel.colorTurn != this.boardModel.userColor) {
            setTimeout(() => Panel.showDialog("Opponent turn !"), 100);
            this.view.sign1.stopTimeCount();
            this.view.sign2.timeCountDown(() => {
            });
        }
    };

    restartGame = ()=>{
        Panel.closeDialog();
        this.action();
    };

    playerLeft = ()=>{
        this.action();
    }

    startGame = (signs: any) => {
        this.view.sign1 = signs.sign1;
        this.view.sign2 = signs.sign2;
        this.view.boardDir = this.boardModel.userColor;
        this.view.initBoard();
        if (this.boardModel.userColor == this.boardModel.colorTurn) {
            Game.gameContainer.interactiveChildren = false;
            setTimeout(() => {
                Panel.showDialog("Game start !");
                setTimeout(() => {
                    Panel.showDialog("Your turn !");
                    this.view.sign2.stopTimeCount();
                    this.view.sign1.timeCountDown(() => {
                        this.gameService.sendExtRequest("time out");
                        Panel.showMessageDialog("You lost!", () => {
                            Panel.showConfirmDialog("Restart game?",
                                {
                                    text: "Yes",
                                    action: () => {
                                        Panel.showConfirmDialog("Waiting for opponent...", {
                                            text: "Cancel",
                                            action: () => {
                                                this.view.sign1.stopTimeCount();
                                                Game.appView.loadView(new HallView());
                                                this.gameService.sendExtRequest("left room");
                                            }
                                        });
                                        this.gameService.sendExtRequest("restart");
                                    }
                                },
                                {
                                    text: "No",
                                    action: () => {
                                        this.gameService.sendExtRequest("left");
                                        Game.appView.loadView(new HallView());
                                    }
                                });
                        });
                    });
                }, 1000);
            }, 1000);
        }
        else {
            Game.gameContainer.interactiveChildren = false;
            setTimeout(() => {
                Panel.showDialog("Game start !");
                setTimeout(() => {
                    Panel.showDialog("Opponent turn !");
                    this.view.sign1.stopTimeCount();
                    this.view.sign2.timeCountDown(() => {
                    });
                }, 1000);
            }, 1000);
        }
        TweenMax.staggerFrom(this.view.pieces, 1, {y: -200, ease: Bounce.easeOut, delay: 1}, 0.05);
    };

    opponentTimeOut = () => {
        this.view.sign1.stopTimeCount();
        Panel.showMessageDialog("You win!", () => {
            Panel.showConfirmDialog("Restart game?",
                {
                    text: "Yes",
                    action: () => {
                        Panel.showConfirmDialog("Waiting for opponent...", {
                            text: "Cancel",
                            action: () => {
                                this.view.sign1.stopTimeCount();
                                Game.appView.loadView(new HallView());
                                this.gameService.sendExtRequest("left room");
                            }
                        });
                        this.gameService.sendExtRequest("restart");
                    }
                },
                {
                    text: "No",
                    action: () => {
                        this.view.sign1.stopTimeCount();
                        this.gameService.sendExtRequest("left");
                        Game.appView.loadView(new HallView());
                    }
                });
        });
    }

    opponentPromotion = (data: any) => {
        let pie = this.view.getPiece(data.start);
        let time = pie.move(data.end);
        this.view.sign2.stopTimeCount();
        setTimeout(() => {
            this.remove(data.end);
            pie.index = data.end;
            pie.texture = PIXI.Texture.fromImage("../assets/" + (!Game.player.color ? "White" : "Black") + data.piename);
            setTimeout(() => {
                Panel.showDialog((!this.boardModel.userColor ? "White" : "Black") + " Pawn promotion!");
                setTimeout(() => Panel.showDialog("Your turn!"), 1500);
                this.view.sign1.timeCountDown(() => {
                    this.gameService.sendExtRequest("time out");
                    Panel.showMessageDialog("You lost!", () => {
                        Panel.showConfirmDialog("Restart game?",
                            {
                                text: "Yes",
                                action: () => {
                                    Panel.showConfirmDialog("Waiting for opponent...", {
                                        text: "Cancel",
                                        action: () => {
                                            this.view.sign1.stopTimeCount();
                                            Game.appView.loadView(new HallView());
                                            this.gameService.sendExtRequest("left room");
                                        }
                                    });
                                    this.gameService.sendExtRequest("restart");
                                }
                            },
                            {
                                text: "No",
                                action: () => {
                                    this.view.sign1.stopTimeCount();
                                    this.gameService.sendExtRequest("left");
                                    Game.appView.loadView(new HallView());
                                }
                            });
                    });
                });
            }, 500);

        }, time * 1000);
    }

    onChessMove = (data: any) => {
        this.revertPos(data);
        let pie = this.view.getPiece(data.start);
        let time = pie.move(data.end);
        this.view.sign2.stopTimeCount();
        setTimeout(this.moveChessPie.bind(null, pie, data), time * 1000);
    };

    revertPos = (data: any) => {
        data.start = 63 - data.start;
        data.end = 63 - data.end;
    };

    moveChessPie = (pie: ChessMan, data: any) => {
        this.remove(data.end);
        pie.index = data.end;
        setTimeout(this.changeTurn, 500);
    };

    changeTurn = () => {
        Panel.showDialog("Your turn !");
        this.view.sign1.timeCountDown(() => {
            this.gameService.sendExtRequest("time out");
            Panel.showMessageDialog("You lost!", () => {
                Panel.showConfirmDialog("Restart game?",
                    {
                        text: "Yes",
                        action: this.showDialogRestartGame
                    },
                    {
                        text: "No",
                        action: this.onButtonNoClick
                    });
            });
        });
    }

    showDialogRestartGame = () => {
        Panel.showConfirmDialog("Waiting for opponent...", {
            text: "Cancel",
            action: () => {
                this.view.sign1.stopTimeCount();
                Game.appView.loadView(new HallView());
                this.gameService.sendExtRequest("left room");
            }
        });
        this.gameService.sendExtRequest("restart");
    };

    onButtonNoClick = () => {
        this.view.sign1.stopTimeCount();
        this.gameService.sendExtRequest("left");
        Game.appView.loadView(new HallView());
    }

    promotion(chess: ChessMan, data: any) {
        let change = new ChangeBoard();
        change.setPie(chess, this.view, (pieName: string) => {
            this.gameService.sendExtRequest("promotion", {start: data.start, end: data.end, piename: pieName});
        });

    }

    remove(index: number): boolean {
        let isKing = false;
        for (let i = 0; i < this.view.pieces.length; i++) {
            if (this.view.pieces[i].index == index) {
                this.view.pieces[i].interactive = false;
                if (this.view.pieces[i].color) {
                    if (this.view.pieces[i].type == 1)
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 539, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 2)
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 462, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 3)
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 385, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 4)
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 308, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 5)
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 231, ease: Back.easeInOut});
                    else {
                        TweenMax.to(this.view.pieces[i], 1, {x: 680, y: 154, ease: Back.easeInOut});
                        isKing = true;
                    }
                } else {
                    if (this.view.pieces[i].type == 1)
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 539, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 2)
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 462, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 3)
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 385, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 4)
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 308, ease: Back.easeInOut});
                    else if (this.view.pieces[i].type == 5)
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 231, ease: Back.easeInOut});
                    else {
                        TweenMax.to(this.view.pieces[i], 1, {x: 757, y: 154, ease: Back.easeInOut});
                        isKing = true;
                    }
                }
                this.view.pieces.splice(i, 1);
                break;
            }
        }
        return isKing;
    }

    offLight = () => {
        for (let i = 0; i < this.view.squares.length; i++) {
            this.view.squares[i].offLight();
        }
    }

    highLight = (index: any) => {
        for (let i = 0; i < index.length; i++) {
            this.view.squares[index[i]].hightLight();
        }
    }

    gameFinish = (colorWin: boolean, win: boolean = false) => {
        this.view.sign1.stopTimeCount();
        if (win) {
            this.gameService.sendExtRequest("game finish");
        }
        if (colorWin == Game.player.color) {
            Panel.showMessageDialog("You win!", () => {
                Panel.showConfirmDialog("Restart game?",
                    {
                        text: "Yes",
                        action: () => {
                            Panel.showConfirmDialog("Waiting for opponent...", {
                                text: "Cancel",
                                action: () => {
                                    Game.appView.loadView(new HallView());
                                    this.gameService.sendExtRequest("left room");
                                }
                            });
                            this.gameService.sendExtRequest("restart");
                        }
                    },
                    {
                        text: "No",
                        action: () => {
                            this.gameService.sendExtRequest("left");
                            Game.appView.loadView(new HallView());
                        }
                    });
            });
        } else {
            Panel.showMessageDialog("You lost!", () => {
                Panel.showConfirmDialog("Restart game?",
                    {
                        text: "Yes",
                        action: () => {
                            Panel.showConfirmDialog("Waiting for opponent...", {
                                text: "Cancel",
                                action: () => {
                                    Game.appView.loadView(new HallView());
                                    this.gameService.sendExtRequest("left room");
                                }
                            });
                            this.gameService.sendExtRequest("restart");
                        }
                    },
                    {
                        text: "No",
                        action: () => {
                            this.gameService.sendExtRequest("left");
                            Game.appView.loadView(new HallView());
                        }
                    });
            });
        }
    }

    action = () => {
        Game.appView.loadView(new GameView());
    }

    validateMove = (chessMan: any) => {
        let isKing = this.remove(Math.round(chessMan.y / 77) * 8 + Math.round(chessMan.x / 77));
        let start = chessMan.index;
        chessMan.updateIndex();
        let end = chessMan.index;

        switch (chessMan.type) {
            case 1 :

                if (!isKing) {
                    if ((<Pawn>chessMan).isTransform()) {
                        this.promotion(chessMan, {start: start, end: end});
                    } else {
                        this.gameService.sendExtRequest("move", {start: start, end: end});
                    }
                } else {
                    this.gameFinish(chessMan.color, true);
                }

                chessMan.isFristMove = false;

                break;

            case 2 :
                if (!isKing) {
                    this.gameService.sendExtRequest("move", {start: start, end: end});
                } else {
                    this.gameFinish(chessMan.color, true);
                }
                (<Rook>chessMan).castling = false;

                break;

            case 3 :
                if (!isKing) {
                    this.gameService.sendExtRequest("move", {start: start, end: end});
                } else {
                    this.gameFinish(chessMan.color, true);
                }

                break;

            case 4 :
                if (!isKing) {
                    this.gameService.sendExtRequest("move", {start: start, end: end});
                } else {
                    this.gameFinish(chessMan.color, true);
                }

                break;

            case 5 :
                if (!isKing) {
                    this.gameService.sendExtRequest("move", {start: start, end: end});
                } else {
                    this.gameFinish(chessMan.color, true);
                }

                break;

            case 6 :
                if ((<King>chessMan).isCastling().length != 0) {
                    this.gameService.sendExtRequest("move", {start: start, end: end});
                    (<King>chessMan).castling = false;
                    console.log(chessMan.getSquare(chessMan.position));
                    if (62 == chessMan.getSquare(chessMan.position)) {
                        chessMan.getPiece(63).position.set((61 % 8) * 77, (Math.floor(61 / 8) * 77));
                        chessMan.getPiece(63).index = 61;
                    }
                    if (57 == chessMan.getSquare(chessMan.position)) {
                        chessMan.getPiece(56).position.set((58 % 8) * 77, (Math.floor(58 / 8) * 77));
                        chessMan.getPiece(56).index = 58;
                    }

                } else {
                    if (!isKing) {
                        this.gameService.sendExtRequest("move", {start: start, end: end});
                    } else {
                        this.gameFinish(chessMan.color, true);
                    }
                    (<King>chessMan).castling = false;
                }
                break;

            default:
                return;
        }

        TweenMax.from(chessMan, 0.2, {y: chessMan.y - 20, ease: Bounce.easeOut});

    };


}