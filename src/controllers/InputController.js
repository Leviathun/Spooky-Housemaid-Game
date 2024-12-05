export class InputController {
    constructor(player) {
        this.player = player;
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'a':
                    this.player.moveLeft();
                    break;
                case 'd':
                    this.player.moveRight();
                    break;
            }
        });
    }
}
