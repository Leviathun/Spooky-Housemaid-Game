const STATUS_CHANGE_TIME = {
    clean: { min: 1000, max: 1000 }, //10 วิ
    plain: { min: 1300, max: 1300 }, 
    dirty: { min: 0, max: 0 }, // dirty ไม่ต้องการเวลาสุ่ม
    dirtysp: { min: 0, max: 0 } // dirtysp ไม่ต้องการเวลาสุ่ม
};

const CLEAN_TIME = {
    clean: { min: 0, max: 0 }, //12 วิ
    plain: { min: 1000, max: 1000 }, 
    dirty: { min: 1200, max: 1200 }, // dirty ไม่ต้องการเวลาสุ่ม
    dirtysp: { min: 1200, max: 1200 } // dirtysp ไม่ต้องการเวลาสุ่ม
};

export class Furniture {
    constructor(x, y, width, height, gameView) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameView = gameView;
        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty
        this.cleanTime = 1200; // เวลาที่ต้องใช้ในการทำความสะอาดของสถานะเริ่มต้น
        this.timeUntilChange = this.getRandomChangeTime(); // เวลาที่จะใช้ก่อนเปลี่ยนสถานะ
        this.changeNotificationTime = 7000; // เวลาก่อนการเปลี่ยนสถานะที่จะเริ่มแจ้งเตือน
        this.isNotified = false; // ใช้ตรวจสอบว่าได้แจ้งเตือนหรือยัง
    }

    update(gameView) {
        if (this.status !== 'dirty' && this.timeUntilChange > 0) {
            this.timeUntilChange -= 1; // ลดเวลาในแต่ละเกมลูป 
            console.log(this.timeUntilChange)

            // แสดงข้อความแจ้งเตือนเมื่อเวลาเหลือ <= 70 วินาที
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
                    if (Math.random() < 0.1) {  // โอกาส 10% ที่จะเปลี่ยนเป็น 'dirtysp'
                        this.status = 'dirtysp';
                        this.cleanTime = 1200;
                    } else {
                        this.status = 'dirty';
                        this.cleanTime = 1200; // รีเซ็ตเวลาสำหรับสถานะใหม่
                    }
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

    getRandomCleanTime() {
        const timeRange = CLEAN_TIME[this.status];
        return Math.floor(Math.random() * (timeRange.max - timeRange.min) + timeRange.min);
    }
    
    clean() {
        // ลดเวลาทำความสะอาดเมื่อมีการทำความสะอาดกำลังดำเนินการ
        if (this.cleanTime > 0) {
            this.cleanTime -= 1;
        }
    
        // ตรวจสอบว่าเวลาทำความสะอาดได้ลดลงถึง 0 แล้วหรือยัง
        if (this.cleanTime <= 0) {
            if (this.status === 'dirtysp') {
                // ถ้าสถานะเป็น 'dirtysp' เปลี่ยนเป็น 'plain' และเพิ่มคะแนนพิเศษ
                this.status = 'plain';
                this.gameView.updateScore(12);
            } else if (this.status === 'dirty') {
                // ถ้าสถานะเป็น 'dirty' เปลี่ยนเป็น 'plain' และเพิ่มคะแนนมาตรฐาน
                this.status = 'plain';
                this.gameView.updateScore(10);
            } else if (this.status === 'plain') {
                // ถ้าสถานะเป็น 'plain' เปลี่ยนเป็น 'clean' และเพิ่มคะแนนมาตรฐาน
                this.status = 'clean';
                this.gameView.updateScore(10);
            }
    
            // รีเซ็ตเวลาทำความสะอาดและสุ่มเวลาการเปลี่ยนสถานะใหม่
            this.timeUntilChange = this.getRandomChangeTime();
            this.cleanTime = this.getRandomCleanTime();
            this.isNotified = false;  // รีเซ็ตสถานะการแจ้งเตือน
        }
    }  
}
