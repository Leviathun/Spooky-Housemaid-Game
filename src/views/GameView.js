export class GameView {
    constructor(canvasId = 'gameCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.score = 0;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    
    drawPlayer(player) {
        if (player) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }

    drawFurniture(furnitureList) {
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
                this.ctx.font = '12px Arial';
                this.ctx.fillText(`Time: ${furniture.cleanTime.toFixed(1)}s`, furniture.x, furniture.y - 10);
            }
        });
    }

    displayScoreAndTime(time) {
        this.drawText(`Time: ${time}`, 90, 40, 'white', '30px Arial');
        this.drawText(`Score: ${this.score}`, 250, 40, 'white', '30px Arial');
    }
}
