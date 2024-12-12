import { GameView } from '../views/GameView.js';
import { Player } from '../models/Player.js';
import { Furniture } from '../models/Furniture.js';
import { InputController } from '../controllers/InputController.js';

export class GameController {
    constructor() {
        this.gameView = new GameView();
        this.player = new Player();
        this.inputController = new InputController();
        this.furnitureList = [];
        this.isCleaning = false;

        // สร้างเฟอร์นิเจอร์
        this.furnitureList.push(new Furniture(200, 300, 100, 50));
        this.furnitureList.push(new Furniture(400, 300, 100, 50));

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

    handleCleaning(event) {
        const mouseX = event.clientX - this.gameView.canvas.offsetLeft;
        const mouseY = event.clientY - this.gameView.canvas.offsetTop;

        // ตรวจสอบว่าเฟอร์นิเจอร์ตัวไหนอยู่ใกล้คลิก
        this.furnitureList.forEach(furniture => {
            if (mouseX >= furniture.x && mouseX <= furniture.x + furniture.width &&
                mouseY >= furniture.y && mouseY <= furniture.y + furniture.height) {
                    furniture.clean();  // ทำความสะอาดเฟอร์นิเจอร์
                }
        });
    }

    handlePlayerActions() {
        // ตรวจสอบการเคลื่อนที่ (ใช้ inputController)
        if (this.inputController.isKeyPressed('a') && this.player.x > 0) {  // เคลื่อนที่ไปทางซ้าย
            this.player.x -= 5; // เคลื่อนที่ซ้าย
        }
        if (this.inputController.isKeyPressed('d') && this.player.x + this.player.width < this.gameView.canvas.width) {  // เคลื่อนที่ไปทางขวา
            this.player.x += 5; // เคลื่อนที่ขวา
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
        this.handlePlayerActions();
        
        this.gameView.clearCanvas();  // ลบ Canvas
        this.gameView.drawPlayer(this.player);  // วาดผู้เล่น
        this.gameView.drawFurniture(this.furnitureList);  // วาดเฟอร์นิเจอร์

        requestAnimationFrame(() => this.gameLoop());  // เรียกวนซ้ำ
    }
}
