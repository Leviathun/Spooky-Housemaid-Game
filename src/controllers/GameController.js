import { GameView } from '../views/GameView.js';
import { Player } from '../models/Player.js';
import { Furniture } from '../models/Furniture.js';
import { InputController } from '../controllers/InputController.js';
import { formatTime } from '../utils/TimeUtils.js';

export class GameController {
    constructor() {
        this.gameView = new GameView();
        this.player = new Player(this.gameView, 500, 500);
        this.inputController = new InputController();
        this.furnitureList = [];
        this.isCleaning = false;
        this.startTime = Date.now(); // เวลาเริ่มต้นเกม
        this.elapsedTime = 0; // เวลาเริ่มต้น

        // สร้างเฟอร์นิเจอร์
        this.furnitureList.push(new Furniture(200, 550, 250, 250, this.gameView));
        this.furnitureList.push(new Furniture(600, 550, 250, 250, this.gameView));

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
                this.player.stop();
                this.isCleaning = true;
                this.player.attack();
            } else if (e.button === 2) { // คลิกขวา
                this.isCleaning = false;
            }
        });
    
        // หยุดทำความสะอาดเมื่อปล่อย
        this.gameView.canvas.addEventListener('mouseup', () => {
            this.isCleaning = false; 
            this.player.stopAttack();
        });
    }

    handlePlayerActions() {
        let isMoving = false;
    
        if (this.inputController.isKeyPressed('a') || this.inputController.isKeyPressed('ฟ')) {
            this.player.moveLeft();
            isMoving = true;
        }
        if (this.inputController.isKeyPressed('d') || this.inputController.isKeyPressed('ก')) {
            this.player.moveRight();
            isMoving = true;
        }
    
        if (!isMoving && !this.player.isAttacking) {
            this.player.stop();
        }
    
        // ตรวจสอบการทำความสะอาด (ถ้ากดค้างเมาส์)
        if (this.isCleaning) {
            this.furnitureList.forEach(furniture => {
                const playerHitBoxX = this.player.x + (this.player.width - this.player.hitBoxWidth) / 2;
                const playerHitBoxY = this.player.y + (this.player.height - this.player.hitBoxHeight) / 2;

                // ตรวจสอบว่าผู้เล่นอยู่ภายในเฟอร์นิเจอร์หรือไม่
                if (playerHitBoxX >= furniture.x &&
                    playerHitBoxX + this.player.hitBoxWidth <= furniture.x + furniture.width &&
                    playerHitBoxY >= furniture.y &&
                    playerHitBoxY + this.player.hitBoxHeight <= furniture.y + furniture.height) {
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
        
        // วาดเฟอร์นิเจอร์และอัพเดต
        this.furnitureList.forEach(furniture => {
            furniture.updateTick();
            furniture.draw(this.gameView.ctx);
            furniture.update(this.gameView);
        });

        this.handlePlayerActions();

        this.player.update();
        this.player.draw();
        
        this.gameView.displayScoreAndTime(formattedTime);

        requestAnimationFrame(() => this.gameLoop());
    }
    
    
}
