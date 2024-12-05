export class Player {
    constructor() {
        this.x = 375; // เริ่มต้นกลาง Canvas
        this.y = 275; 
        this.width = 50; // ขนาดตัวผู้เล่น
        this.height = 50;
        this.speed = 5; // ความเร็วในการเคลื่อนที่
        this.isHiding = false; // สถานะการซ่อนตัว
    }

    moveLeft() {
        if (!this.isHiding) {
            this.x = Math.max(0, this.x - this.speed); // ไม่ให้ออกนอก Canvas
        }
    }

    moveRight() {
        if (!this.isHiding) {
            this.x = Math.min(750, this.x + this.speed); // ไม่ให้ออกนอก Canvas
        }
    }

    toggleHiding() {
        this.isHiding = !this.isHiding; // สลับสถานะการซ่อนตัว
    }

    clean() {
        if (!this.isHiding) {
            console.log("Cleaning..."); // เพิ่มลอจิกในอนาคต
        }
    }
}
