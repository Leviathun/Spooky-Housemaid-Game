const STATUS_CHANGE_TIME = {
    clean: { min: 1000, max: 1000 }, //10 วิ
    plain: { min: 1300, max: 1300 }, 
    dirty: { min: 0, max: 0 }, // dirty ไม่ต้องการเวลาสุ่ม
    dirtysp: { min: 0, max: 0 } // dirtysp ไม่ต้องการเวลาสุ่ม
};

const CLEAN_TIME = {
    clean: { min: 0, max: 0 }, 
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

        // ตัวแปรควบคุมความเร็วอนิเมชั่น
        this.tickCount = 0;
        this.ticksPerFrame = 14; // อัพเดตเฟรมทุกๆ 14 ticks

        // ตัวแปรควบคุมอนิเมชั่น
        this.imagesLoaded = 0;
        this.totalImages = 4; // จำนวนภาพทั้งหมด
        this.sprites = {
            Idle: {
                img: new Image(),
                frames: 7,
                currentFrame: 0
            },
            Stun: {
                img: new Image(),
                frames: 18,
                currentFrame: 0
            },
            Die: {
                img: new Image(),
                frames: 15,
                currentFrame: 0
            },
            Hit: {
                img: new Image(),
                frames: 5,
                currentFrame: 0
            }
        };
        this.currentSprite = 'Idle';
        this.loadSprites();

        this.status = 'dirty'; // ตั้งสถานะเริ่มต้นเป็น dirty

        this.cleanTime = 1200; // เวลาที่ต้องใช้ในการทำความสะอาดของสถานะเริ่มต้น
        this.timeUntilChange = this.getRandomChangeTime(); // เวลาที่จะใช้ก่อนเปลี่ยนสถานะ
        this.changeNotificationTime = 7000; // เวลาก่อนการเปลี่ยนสถานะที่จะเริ่มแจ้งเตือน
        this.isNotified = false; // ใช้ตรวจสอบว่าได้แจ้งเตือนหรือยัง
    }

    loadSprites() {
        Object.keys(this.sprites).forEach(key => {
            this.sprites[key].img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.totalImages) {
                    this.readyToDraw = true;
                }
            };
            this.sprites[key].img.src = `assets/images/mushroom/Mushroom-${key}.png`;
        });
    }

    updateTick() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.sprites[this.currentSprite].currentFrame = (this.sprites[this.currentSprite].currentFrame + 1) % this.sprites[this.currentSprite].frames;
        }
    }    

    draw(ctx) {
        if (!this.readyToDraw) return; // ตรวจสอบว่ารูปภาพถูกโหลดครบทั้งหมดและพร้อมสำหรับการวาดหรือไม่
    
        // ตรวจสอบการตั้งค่าสถานะให้ตรงกับ currentSprite
        this.updateCurrentSprite();
        if (this.status !== 'clean') {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(`Time: ${this.cleanTime.toFixed(1)}s`, this.x + 100, this.y - 10);
        }
    
        const sprite = this.sprites[this.currentSprite];
        if (!sprite.img.complete) { // ตรวจสอบว่ารูปภาพถูกโหลดเสร็จสมบูรณ์แล้วหรือไม่
            return; // หากยังไม่โหลดเสร็จ ออกจากฟังก์ชัน
        }
    
        const frameWidth = sprite.img.width / sprite.frames;
        const frameHeight = sprite.img.height;
        ctx.drawImage(
            sprite.img,
            sprite.currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            this.x, this.y,
            this.width, this.height
        );

        // Draw hit box for debugging
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    updateCurrentSprite() {
        // อัพเดต this.currentSprite ตามสถานะปัจจุบันของเฟอร์นิเจอร์
        switch (this.status) {
            case 'dirty':
                this.currentSprite = 'Idle';
                break;
            case 'plain':
                this.currentSprite = 'Stun';
                break;
            case 'clean':
                this.currentSprite = 'Die';
                break;
            case 'dirtysp':
                this.currentSprite = 'Hit';
                break;
        }
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
