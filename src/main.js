import { GameController } from './controllers/GameController.js';

document.getElementById('startButton').addEventListener('click', () => {
    // ซ่อนหน้าเริ่มเกม
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';

    // สร้าง GameController และเริ่มเกม
    const gameController = new GameController();
    gameController.startGame();
});
