const STATUS_CHANGE_TIME = {
    clean: { min: 6000, max: 6000 },
    plain: { min: 6000, max: 6000 }, //60 วิ
    dirty: { min: 0, max: 0 } // dirty ไม่ต้องการเวลาสุ่ม
};


export class Furniture {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty
        this.cleanTime = 1200; // เวลาที่ต้องใช้ในการทำความสะอาด (1 วินาที)
        this.timeUntilChange = this.getRandomChangeTime(); // เวลาที่จะใช้ก่อนเปลี่ยนสถานะ
        this.changeNotificationTime = 7000; // เวลาก่อนการเปลี่ยนสถานะที่จะเริ่มแจ้งเตือน
        this.isNotified = false; // ใช้ตรวจสอบว่าได้แจ้งเตือนหรือยัง
    }

    update(gameView) {
        if (this.status !== 'dirty') {
            this.timeUntilChange -= 1; // ลดเวลาในแต่ละเกมลูป (เฟรมละ 0.1 วินาที)
            console.log(this.timeUntilChange)

            // แสดงข้อความแจ้งเตือนเมื่อเวลาเหลือ <= 300 วินาที
            if (this.timeUntilChange <= this.changeNotificationTime) {
                console.log(`timeUntilChange: ${this.timeUntilChange}, changeNotificationTime: ${this.changeNotificationTime}`);

                gameView.drawText(
                    `Warning! Changing soon in ${this.timeUntilChange}s`,
                    this.x + this.width / 2,
                    this.y - 25,
                    'yellow'
                );
                this.isNotified = true; // ตั้งค่าการแจ้งเตือนแล้ว
            }
    
            // เปลี่ยนสถานะเมื่อเวลาเหลือ 0
            if (this.timeUntilChange <= 0) {
                if (this.status === 'clean') {
                    this.status = 'plain';
                    this.cleanTime = 1000; // รีเซ็ตเวลาสำหรับสถานะใหม่
                } else if (this.status === 'plain') {
                    this.status = 'dirty';
                    this.cleanTime = 1200; // รีเซ็ตเวลาสำหรับสถานะใหม่
                }
    
                this.timeUntilChange = this.getRandomChangeTime(); // สุ่มเวลาเปลี่ยนสถานะใหม่
                this.isNotified = false; // รีเซ็ตสถานะแจ้งเตือน
            }
        }
    }
    
    getRandomChangeTime() {
        const timeRange = STATUS_CHANGE_TIME[this.status];
        return Math.floor(Math.random() * (timeRange.max - timeRange.min) + timeRange.min);
    }
    
    clean() {
        if (this.status === 'dirty' || this.status === 'plain') {
            this.cleanTime -= 1;
            if (this.cleanTime <= 0) {
                this.status = this.status === 'dirty' ? 'plain' : 'clean';
                this.timeUntilChange = this.getRandomChangeTime();
                this.isNotified = false;
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
