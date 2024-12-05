import { GameView } from '../views/GameView.js';  // นำเข้า GameView.js
import { Player } from '../models/Player.js';  // นำเข้า Player.js
import { Furniture } from '../models/Furniture.js';

export class GameController {
    constructor() {
        this.gameView = new GameView(); // สร้าง instance ของ GameView
        this.player = new Player(); // สร้าง instance ของ Player
        this.furnitureList = []; // สร้างรายการเฟอร์นิเจอร์
        this.keys = {}; // เก็บสถานะของปุ่มที่ถูกกด
        this.isCleaning = false;

        // สร้างเฟอร์นิเจอร์
        this.furnitureList.push(new Furniture(200, 300, 100, 50)); // เพิ่มเฟอร์นิเจอร์ที่ตำแหน่ง (200, 300)
        this.furnitureList.push(new Furniture(400, 300, 100, 50)); // เพิ่มเฟอร์นิเจอร์ที่ตำแหน่ง (400, 300)

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
            // ตรวจสอบว่าเฟอร์นิเจอร์ตัวไหนอยู่ใกล้ผู้เล่น
            this.furnitureList.forEach(furniture => {
                if (this.player.x < furniture.x + furniture.width &&
                    this.player.x + this.player.width > furniture.x &&
                    this.player.y < furniture.y + furniture.height &&
                    this.player.y + this.player.height > furniture.y) {
                        furniture.clean(); // ทำความสะอาดเฟอร์นิเจอร์
                }
            });
        }
    }

    gameLoop() {
        this.handlePlayerMovement(); // จัดการการเคลื่อนที่
        this.handlePlayerActions();  // จัดการการทำงาน

        this.gameView.clearCanvas(); // ลบ Canvas เดิม
        this.gameView.drawPlayer(this.player); // วาดผู้เล่น

        // วาดเฟอร์นิเจอร์
        this.furnitureList.forEach(furniture => {
            furniture.draw(this.gameView.ctx);
        });

        requestAnimationFrame(() => this.gameLoop()); // เรียกวนซ้ำ
    }
}
