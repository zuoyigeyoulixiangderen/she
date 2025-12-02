const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;
let snake = [{ x: 8 * box, y: 8 * box }];
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};
let direction = 'RIGHT';
let score = 0;

// 键盘控制
document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (key === 38 && direction !== 'DOWN') direction = 'UP';
    else if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

// 触控滑动控制
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑动
        if (dx > 0 && direction !== 'LEFT') direction = 'RIGHT';
        else if (dx < 0 && direction !== 'RIGHT') direction = 'LEFT';
    } else {
        // 垂直滑动
        if (dy > 0 && direction !== 'UP') direction = 'DOWN';
        else if (dy < 0 && direction !== 'DOWN') direction = 'UP';
    }
});

// 随机生成食物
function randomFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

// 碰撞检测
function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// 游戏绘制
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 画食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // 画蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // 移动蛇
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // 吃食物
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        randomFood();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    // 游戏结束判定
    if (
        snakeX < 0 || snakeX >= canvasSize ||
        snakeY < 0 || snakeY >= canvasSize ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert('游戏结束! 得分: ' + score);
        return;
    }

    snake.unshift(newHead);

    // 显示分数
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("分数: " + score, 10, 20);
}

const game = setInterval(draw, 100);
