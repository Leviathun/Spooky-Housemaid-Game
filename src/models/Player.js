export class Player {
    constructor() {
        this.x = 375;
        this.y = 275;
        this.width = 50;
        this.height = 50;
        this.speed = 5; // ความเร็วของผู้เล่น
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
        }
    }
}
