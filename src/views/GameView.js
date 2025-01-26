export class GameView {
    constructor(canvasId = 'gameCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1900;
        this.canvas.height = 900;
        this.score = 0;
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/images/background.png'; // กำหนดเส้นทางไปยังภาพพื้นหลัง
    
        this.backgroundImage.onload = () => { // ตรวจสอบว่าภาพโหลดเสร็จสมบูรณ์ก่อนวาด
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        };

        // กำหนดขนาด canvas ตามขนาดของหน้าต่าง
        this.resizeCanvas(); // ปรับขนาด canvas

        // ตั้งค่าให้เมื่อหน้าต่างถูกปรับขนาด จะปรับขนาด canvas ด้วย
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height); // วาดพื้นหลังทุกครั้งที่ clear canvas
    }

    drawText(text, x, y, color, font = '16px Arial') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = 'center'; 
        this.ctx.fillText(text, x, y);
    }

    updateScore(points) {
        this.score += points;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasWidth = this.canvas.width; // อัพเดตความกว้าง canvas ให้กับ player
        this.canvasHeight = this.canvas.height; // อัพเดตความสูง canvas
    }
    
    
    /*drawPlayer(player) {
        if (player) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }*/

    /*drawFurniture(furnitureList) {
        furnitureList.forEach(furniture => {
            switch (furniture.status) {
                case 'clean': this.ctx.fillStyle = 'lightgreen'; break;
                case 'plain': this.ctx.fillStyle = 'gray'; break;
                case 'dirty': this.ctx.fillStyle = 'brown'; break;
                case 'dirtysp': this.ctx.fillStyle = 'pink'; break;
            }
            this.ctx.fillRect(furniture.x, furniture.y, furniture.width, furniture.height);
            
            if (furniture.status !== 'clean') {
                this.ctx.fillStyle = 'white';
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`Time: ${furniture.cleanTime.toFixed(1)}s`, furniture.x + 100, furniture.y - 10);
            }
        });
    }*/

    displayScoreAndTime(time) {
        this.drawText(`Time: ${time}`, 150, 50, 'white', '50px Arial');
        this.drawText(`Score: ${this.score}`, 400, 50, 'white', '50px Arial');
    }
}
