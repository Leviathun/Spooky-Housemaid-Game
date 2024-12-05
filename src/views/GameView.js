export class GameView {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1800; // กำหนดขนาด Canvas
        this.canvas.height = 800;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayer(player) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}
