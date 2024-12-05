export class GameView {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // กำหนดขนาด Canvas
        this.canvas.width = 800; 
        this.canvas.height = 600;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayer(player) {
        if (player) {
            this.ctx.fillStyle = 'white'; // สีของตัวละคร
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }
}
