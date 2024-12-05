export class Furniture {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty
        this.cleanTime = 3; // เวลาที่ต้องใช้ในการทำความสะอาด (วินาที)
    }

    // ฟังก์ชันที่ใช้ทำความสะอาด
    clean() {
        if (this.status === 'dirty') {
            this.status = 'plain';
            this.cleanTime = 2; // เวลาที่ใช้ทำความสะอาดจะลดลง
        } else if (this.status === 'plain') {
            this.status = 'clean';
            this.cleanTime = 1; // เวลาทำความสะอาดเสร็จ
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
