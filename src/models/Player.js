export class Player {
    constructor() {
        this.x = 275; // เริ่มต้นกลาง Canvas
        this.y = 275;
        this.width = 50; // ขนาดตัวผู้เล่น
        this.height = 50;
        this.speed = 5; // ความเร็วในการเคลื่อนที่
        this.isHiding = false; // สถานะการซ่อนตัว
    }

    moveLeft() {
        if (!this.isHiding && this.x > 0) {
            this.x -= this.speed;
        }
    }

    moveRight() {
        if (!this.isHiding && this.x + this.width < 800) { // 800 ควรถูกแทนที่ด้วย this.gameView.canvas.width ถ้าตัวแปรนี้ถูกส่งไปยัง Player
            this.x += this.speed;
        }
    }
}

