export class Furniture {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty
        this.cleanTime = 100; // เวลาที่ต้องใช้ในการทำความสะอาด (วินาที)
        this.timeUntilChange = this.getRandomChangeTime(); // เวลาที่จะใช้ก่อนเปลี่ยนสถานะ
        this.changeNotificationTime = 300; // เวลาก่อนการเปลี่ยนสถานะที่จะเริ่มแจ้งเตือน
        this.isNotified = false; // ใช้ตรวจสอบว่าได้แจ้งเตือนหรือยัง
    }

    // ฟังก์ชันสุ่มเวลาการเปลี่ยนแปลงสถานะ
    getRandomChangeTime() {
        if (this.status === 'clean') {
            return Math.random() * (550 - 500) + 500; // สุ่มเวลา 500-550 วินาที
        } else if (this.status === 'plain') {
            return Math.random() * (700 - 500) + 500; // สุ่มเวลา 500-700 วินาที
        }
        return 0; // สำหรับสถานะ 'dirty' ยังไม่ต้องการสุ่มเวลา
    }

    update(gameView) {
        if (this.status !== 'dirty') {
            this.timeUntilChange -= 0.1; // ลดเวลาในแต่ละเกมลูป (เฟรมละ 0.1 วินาที)
    
            // แสดงข้อความแจ้งเตือนเมื่อเวลาเหลือ <= 300 วินาที
            if (this.timeUntilChange <= this.changeNotificationTime) {
                // วาดข้อความแจ้งเตือนใกล้กับเฟอร์นิเจอร์
                gameView.drawText(
                    `Warning! Changing soon in ${Math.ceil(this.timeUntilChange)}s`,
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
                    this.cleanTime = 80; // รีเซ็ตเวลาสำหรับสถานะใหม่
                } else if (this.status === 'plain') {
                    this.status = 'dirty';
                    this.cleanTime = 100; // รีเซ็ตเวลาสำหรับสถานะใหม่
                }
    
                this.timeUntilChange = this.getRandomChangeTime(); // สุ่มเวลาเปลี่ยนสถานะใหม่
                this.isNotified = false; // รีเซ็ตสถานะแจ้งเตือน
            }
        }
    }
    

    clean() {
        if (this.status === 'dirty' || this.status === 'plain') {
            this.cleanTime -= 0.1; // ลดเวลาในการทำความสะอาดทุกครั้งที่เกมลูป
            console.log(this.cleanTime);
    
            if (this.cleanTime <= 0) {
                // เมื่อทำความสะอาดเสร็จ เปลี่ยนสถานะและรีเซ็ตค่าต่าง ๆ
                if (this.status === 'dirty') {
                    this.status = 'plain'; 
                    this.cleanTime = 100;  // เวลาใหม่สำหรับสถานะ plain
                    this.timeUntilChange = this.getRandomChangeTime(); // รีเซ็ตเวลาสุ่ม
                    this.isNotified = false; // รีเซ็ตสถานะแจ้งเตือน
                } else if (this.status === 'plain') {
                    this.status = 'clean';
                    this.cleanTime = 80;  // เวลาใหม่สำหรับสถานะ clean
                    this.timeUntilChange = this.getRandomChangeTime(); // รีเซ็ตเวลาสุ่ม
                    this.isNotified = false; // รีเซ็ตสถานะแจ้งเตือน
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
