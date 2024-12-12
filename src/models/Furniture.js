export class Furniture {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty
        this.cleanTime = 100; // เวลาที่ต้องใช้ในการทำความสะอาด (วินาที)
        
    }

    clean() {
        if (this.status === 'dirty' || this.status === 'plain') {
            this.cleanTime -= 0.1; // ลดเวลาในการทำความสะอาดทุกครั้งที่เกมลูป
            console.log(this.cleanTime)
            if (this.cleanTime <= 0) {
                // เมื่อทำความสะอาดเสร็จ เปลี่ยนสถานะและรีเซ็ตเวลาทำความสะอาด
                if (this.status === 'dirty') {
                    this.status = 'plain'; 
                    this.cleanTime = 80;  // เวลาใหม่สำหรับสถานะ plain
                } else if (this.status === 'plain') {
                    this.status = 'clean';
                }
            }
        }
    }
    
    // ฟังก์ชันที่ใช้วาดเฟอร์นิเจอร์
    draw(ctx) {
        switch (this.status) {
            case 'clean':
                ctx.fillStyle = 'lightgreen'; // สีสะอาด
                break;
            case 'plain':
                ctx.fillStyle = 'gray'; // สีปานกลาง
                break;
            case 'dirty':
                ctx.fillStyle = 'brown'; // สีสกปรก
                break;
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
