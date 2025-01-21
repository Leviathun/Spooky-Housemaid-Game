export class Player {
    constructor(gameView, x, y) {
        this.gameView = gameView;
        this.ctx = gameView.ctx;
        this.canvasWidth = gameView.canvas.width; // บันทึกความกว้าง canvas
        
        // ตัวแปรควบคุมลักษณะผู้เล่น
        this.x = x; 
        this.y = y;
        this.width = 200; 
        this.height = 200;
        this.speed = 5; 
        
        // ตัวแปรควบคุมสถานะตัวละครหลัก 
        this.isHiding = false;
        this.isAttacking = false;
        this.movingLeft = false; // เพื่อกลับด้านตัวละคร
        this.isMoving = false; 
        this.isLocked = false; // เพื่อหยุดตัวละคร

        // ตัวแปรควบคุมความเร็วอนิเมชั่น
        this.tickCount = 0;
        this.ticksPerFrame = 10; // อัพเดตเฟรมทุกๆ 10 ticks

        // ตัวแปรควบคุมอนิเมชั่น
        this.imagesLoaded = 0;
        this.totalImages = 3; // จำนวนภาพทั้งหมด
        this.sprites = {
            idle: {
                img: new Image(),
                frames: 8,
                currentFrame: 0
            },
            run: {
                img: new Image(),
                frames: 8,
                currentFrame: 0
            },
            attack: {
                img: new Image(),
                frames: 8,
                currentFrame: 0
            }
        };
        this.currentSprite = 'idle';
        this.loadSprites();
    }

    loadSprites() {
        Object.keys(this.sprites).forEach(key => {
            this.sprites[key].img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.totalImages) {
                    this.readyToDraw = true;
                }
            };
            this.sprites[key].img.src = `assets/images/character/Character-${key}.png`;
        });
    }
ก
    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.sprites[this.currentSprite].currentFrame = (this.sprites[this.currentSprite].currentFrame + 1) % this.sprites[this.currentSprite].frames;
        }
    }
       
    draw() {
        if (!this.readyToDraw) return;
    
        const sprite = this.sprites[this.currentSprite];
        const frameWidth = sprite.img.width / sprite.frames;
        const frameHeight = sprite.img.height;
    
        // ตรวจสอบว่าตัวละครกำลังเคลื่อนที่ไปทางซ้ายหรือไม่
        if (this.movingLeft) {
            // กลับด้าน canvas
            this.ctx.save(); // บันทึกสถานะปัจจุบันของ canvas
            this.ctx.scale(-1, 1); // กลับด้านแกน x
            // วาดตัวละครในตำแหน่งที่สะท้อนกลับ อย่าลืมว่าต้องเปลี่ยน x ให้เป็นค่าลบและขยับไปทางขวา
            this.ctx.drawImage(
                sprite.img,
                sprite.currentFrame * frameWidth, 0,
                frameWidth, frameHeight,
                -this.x - this.width, this.y, // จุดเริ่มต้นวาดที่ตำแหน่งสะท้อนกลับ
                this.width, this.height
            );
            this.ctx.restore(); // คืนค่าสถานะ canvas กลับ

            // วาด hit box
            this.ctx.strokeStyle = 'red'; // สีแดงสำหรับ hit box
            this.ctx.strokeRect(this.x, this.y, this.width, this.height); // วาดกรอบ hit box

            // Debug: แสดงพิกัด
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`X: ${this.x}, Y: ${this.y}`, this.x, this.y - 10);

            
        } else {
            // วาดตัวละครตามปกติถ้าไม่ใช่การเคลื่อนที่ไปทางซ้าย
            this.ctx.drawImage(
                sprite.img,
                sprite.currentFrame * frameWidth, 0,
                frameWidth, frameHeight,
                this.x, this.y,
                this.width, this.height
            );

            // วาด hit box
            this.ctx.strokeStyle = 'red'; // สีแดงสำหรับ hit box
            this.ctx.strokeRect(this.x, this.y, this.width, this.height); // วาดกรอบ hit box

            // Debug: แสดงพิกัด
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`X: ${this.x}, Y: ${this.y}`, this.x, this.y - 10);
        }
    }

    moveLeft() {
        if (this.isLocked) return; // หยุดการเคลื่อนที่ถ้าล็อค
        this.isMoving = true;
        this.x -= this.speed;
        if (!this.isAttacking) {
            this.currentSprite = 'run';
            this.movingLeft = true;
        }
    }

    moveRight() {
        if (this.isLocked) return; // หยุดการเคลื่อนที่ถ้าล็อค
        this.isMoving = true;
        this.x += this.speed;
        if (!this.isAttacking) {
            this.currentSprite = 'run';
            this.movingLeft = false;
        }
    }

    stop() {
        this.isMoving = false;
        if (!this.isAttacking) {
            this.currentSprite = 'idle';
        }
    }

    attack() {
        this.currentSprite = 'attack';
        this.isAttacking = true;
        this.isLocked = true; // ล็อคการเคลื่อนที่เมื่อเริ่มโจมตี
    }

    stopAttack() {
        this.isAttacking = false;
        this.isLocked = false; // ปลดล็อคการเคลื่อนที่เมื่อหยุดโจมตี
        if (!this.isMoving) {
            this.stop();
        }
    }
}

