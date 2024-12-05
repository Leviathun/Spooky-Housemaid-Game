import { GameView } from '../views/GameView.js';  // นำเข้า GameView.js
import { Player } from '../models/Player.js';  // นำเข้า Player.js

export class GameController {
    constructor() {
        this.gameView = new GameView(); // สร้าง instance ของ GameView
        this.player = new Player(); // สร้าง instance ของ Player
        this.keys = {}; // เก็บสถานะของปุ่มที่ถูกกด
        this.isCleaning = false;

        this.addEventListeners(); // เพิ่ม Event listeners
    }

    // ฟังก์ชันที่ใช้เริ่มเกม
    startGame() {
        // เริ่มเกมที่นี่ (อาจจะตั้งค่าเริ่มต้นหรือการตั้งค่าพิเศษที่ต้องการ)
        console.log("Game Started");
        this.gameLoop(); // เรียกเกมลูป
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        this.gameView.canvas.addEventListener('mousedown', () => {
            this.isCleaning = true;
        });

        this.gameView.canvas.addEventListener('mouseup', () => {
            this.isCleaning = false;
        });
    }

    handlePlayerMovement() {
        if (this.keys['a'] || this.keys['A']) {
            this.player.moveLeft();
        }
        if (this.keys['d'] || this.keys['D']) {
            this.player.moveRight();
        }
    }

    handlePlayerActions() {
        if (this.keys['e'] || this.keys['E']) {
            this.player.toggleHiding();
        }

        if (this.isCleaning) {
            this.player.clean();
        }
    }

    gameLoop() {
        this.handlePlayerMovement(); // จัดการการเคลื่อนที่
        this.handlePlayerActions();  // จัดการการทำงาน

        this.gameView.clearCanvas(); // ลบ Canvas เดิม
        this.gameView.drawPlayer(this.player); // วาดผู้เล่น

        requestAnimationFrame(() => this.gameLoop()); // เรียกวนซ้ำ
    }
}
