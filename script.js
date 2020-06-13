// ~~~~~~~~~~~~~~~~ THIS GAME WAS CREATED FOLLOWING ~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~ THIS VERY AMAZING TUTORIAL AT   ~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~ https://www.youtube.com/watch?v=nl0KXCa5pJk&list=PLt4757glfbhHkfz7dqojMbnBdgUnFih4B&index=4 ~~~~~~~~~~~~~~~~~~~~

const cvs = document.getElementById('pong');
const ctx = cvs.getContext('2d');

// ctx.fillStyle = 'black';

// ctx.fillRect(100, 200, 50, 75);

// User paddle

const user = {
	x: 0,
	y: (cvs.height / 2 - 100) / 2,
	width: 10,
	height: 100,
	score: 0,
	color: 'WHITE',
};
//com paddle
const com = {
	x: cvs.width - 10,
	y: (cvs.height - 100) / 2,
	width: 10,
	height: 100,
	color: 'WHITE',
	score: 0,
};
// net
const net = {
	x: (cvs.width - 2) / 2,
	y: 0,
	width: 2,
	height: 10,
	color: 'WHITE',
};
//ball
const ball = {
	x: cvs.width / 2,
	y: cvs.height / 2,
	radius: 10,
	velocityX: 5,
	velocityY: 5,
	speed: 7,
	color: 'WHITE',
};

//control user paddle

cvs.addEventListener('mousemove', movePaddle);
function movePaddle(evt) {
	let rect = cvs.getBoundingClientRect();
	user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
	ball.x = cvs.width / 2;
	ball.y = cvs.height / 2;
	ball.speed = 7;
	ball.velocityX = -ball.velocityX;
}

function collision(b, p) {
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	return (
		p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
	);
}

//update, logic for pos, movement, score, ect
function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	//ai to control comp paddle
	let compDifficulty = 0.1;
	com.y += (ball.y - (com.y + com.height / 2)) * compDifficulty;

	if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
	}

	let player = ball.x + ball.radius < cvs.width / 2 ? user : com;

	if (collision(ball, player)) {
		// where the ball hit paddle
		let collidePoint = ball.y - (player.y + player.height / 2);
		// normalize
		collidePoint = collidePoint / (player.height / 2);

		//calculate angle in radian
		let angleRad = (Math.PI / 4) * collidePoint;
		//direction of ball
		let direction = ball.x + ball.radius < cvs.width / 2 ? 1 : -1;
		// change velocity x and y
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
		//when ball hit increase speed
		ball.speed += 0.2;
	}
	if (ball.x - ball.radius < 0) {
		com.score++;
		resetBall();
	} else if (ball.x + ball.radius > cvs.width) {
		user.score++;
		resetBall();
	}
}

function drawText(text, x, y, color) {
	ctx.fillStyle = color;
	ctx.font = '45px fantasy';
	ctx.fillText(text, x, y);
}

//draw rect function
function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawNet() {
	for (let i = 0; i <= cvs.height; i += 15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

function render() {
	//clear canvas
	drawRect(0, 0, cvs.width, cvs.height, 'BLACK');
	//draw score
	drawText(user.score, cvs.width / 4, cvs.height / 5, 'WHITE');
	drawText(com.score, (3 * cvs.width) / 4, cvs.height / 5, 'WHITE');
	drawNet();
	//draw user and comp paddles
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(com.x, com.y, com.width, com.height, com.color);
	//draw ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
//game init
function game() {
	render();
	update();
}
//loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
