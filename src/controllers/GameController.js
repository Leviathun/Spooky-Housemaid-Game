import { GameView } from '../views/GameView.js';
import { Player } from '../models/Player.js';

export class GameController {
    constructor() {
        this.gameView = new GameView(); // View สำหรับจัดการ Canvas
        this.player = new Player(); // ผู้เล่นในเกม
    }

    startGame() {
        this.gameLoop();
    }

    gameLoop() {
        this.gameView.clearCanvas();
        this.gameView.drawPlayer(this.player); // วาดผู้เล่น
        requestAnimationFrame(() => this.gameLoop()); // เรียกวนซ้ำ
    }
}
