import { GameView } from '../views/GameView.js';
import { Player } from '../models/Player.js';
import { Furniture } from '../models/Furniture.js';
import { InputController } from '../controllers/InputController.js';
import { formatTime } from '../utils/TimeUtils.js';

export class GameController {
    constructor() {
        this.gameView = new GameView();
        this.player = new Player();
        this.inputController = new InputController();
        this.furnitureList = [];
        this.isCleaning = false;
        this.startTime = Date.now(); // เวลาเริ่มต้นเกม
        this.elapsedTime = 0; // เวลาเริ่มต้น

        // สร้างเฟอร์นิเจอร์
        this.furnitureList.push(new Furniture(200, 300, 100, 50, this.gameView));
        this.furnitureList.push(new Furniture(400, 300, 100, 50, this.gameView));

        // ส่งข้อมูลเฟอร์นิเจอร์ไปที่ GameView
        this.gameView.furnitureList = this.furnitureList;

        this.addEventListeners()
    }

    startGame() {
        console.log("Game Started");
        this.gameLoop();
    }

    addEventListeners() {
        this.gameView.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // คลิกซ้าย
                this.isCleaning = true;
            } else if (e.button === 2) { // คลิกขวา
                this.isCleaning = false;
                this.handleRightClick(e); // ฟังก์ชันทำความสะอาดเมื่อคลิกขวา
            }
        });

        this.gameView.canvas.addEventListener('mouseup', () => {
            this.isCleaning = false;  // หยุดทำความสะอาดเมื่อปล่อย
        });
    }

    handlePlayerActions() {
        // ตรวจสอบการเคลื่อนที่
        if (this.inputController.isKeyPressed('a') || this.inputController.isKeyPressed('ฟ')) {
            this.player.moveLeft();
        }
        if (this.inputController.isKeyPressed('d') || this.inputController.isKeyPressed('ก')) {
            this.player.moveRight();
        }
    
        // ตรวจสอบการทำความสะอาด (ถ้ากดค้างเมาส์)
        if (this.isCleaning) {
            this.furnitureList.forEach(furniture => {
                // ตรวจสอบว่าผู้เล่นอยู่ใกล้เฟอร์นิเจอร์หรือไม่
                if (this.player.x < furniture.x + furniture.width &&
                    this.player.x + this.player.width > furniture.x &&
                    this.player.y < furniture.y + furniture.height &&
                    this.player.y + this.player.height > furniture.y) {
                    // เริ่มทำความสะอาดเฟอร์นิเจอร์
                    furniture.clean();
                }
            });
        }
    }
        
    gameLoop() {
        const now = Date.now();
        this.elapsedTime = now - this.startTime;
        
        // อัพเดตเวลาและคะแนนที่หน้าจอ
        const formattedTime = formatTime(this.elapsedTime);
        // คำนวณคะแนนจากเวลา
        this.timeCount = Math.floor(this.elapsedTime / 60000);
        console.log("Count : " + this.timeCount)

        this.gameView.clearCanvas();
        this.gameView.drawFurniture(this.furnitureList); // วาดเฟอร์นิเจอร์
        this.handlePlayerActions();
        this.gameView.drawPlayer(this.player); // วาดผู้เล่น
        this.furnitureList.forEach(furniture => furniture.update(this.gameView)); // วาดข้อความแจ้งเตือน
        
        this.gameView.displayScoreAndTime(formattedTime);

        requestAnimationFrame(() => this.gameLoop());
    }
    
    
}
