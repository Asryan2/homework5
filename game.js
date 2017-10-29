const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = 500;
const ctx = canvas.getContext("2d");

const forLoop = function(start, end, op){
	const recursiveLoop = function(start, end){
		if(start >= end) return;
		op(start);
		recursiveLoop(start + 1, end);
	}
	recursiveLoop(start, end);
}

const forEach = function(array, op){
	const recursiveLoop = function(start, end){
		if(start >= end) return;
		op(array[start]);
		recursiveLoop(start + 1, end);
	}
	recursiveLoop(0, array.length);
}




const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

document.addEventListener('keydown', function(event) {
  	if(event.keyCode === upKey) {
		const hero = gameState.hero;
		startJump();
  	}
}, false);

const backgroundImage = new Image();
backgroundImage.src = "https://chupacdn.s3.amazonaws.com/catalog/product/cache/1/thumbnail/1280x/17f82f742ffe127f42dca9de82fb58b1/m/o/mountain-game-background-8133_imgs_8133.png";
const heroImage = new Image();
heroImage.src = "https://vignette.wikia.nocookie.net/fantendo/images/6/65/SmallMario.png/revision/latest?cb=20100202154500";
const heroImageWidth = 73;
const heroImageHeight = 81;
const badGuyImage = new Image();
badGuyImage.src = "http://classroom.uml.edu/art/webart0102/FA11/Scott/Images/pipe2.png";

const worldConfig = {
	startX: 0,
	startY: 460,
	maxYDelta: 4
}

const Helpers = {
	rand : function(num) {
		return Math.floor(Math.random() * num) + 1;
	},
	generateBadGuys : function(count){
	    if(count === NaN || count === undefined) return;
	    const badGuys = [];
	    forLoop(0, count, function(i){
	    	const xStart = 300;
	    	const sectorlength = (canvas.width - xStart)/count;

	    	badGuys[i] = {
	    		x: xStart + sectorlength*i,
	    		y: worldConfig.startY-79,
	    		width: 40,
	    		height: 80,
	    		image : badGuyImage
	    	}
	    });
	    return badGuys;
	}
}

const gameState = {
	background: backgroundImage,
	hero : {
		x: worldConfig.startX,
		y: worldConfig.startY - heroImageHeight,
		width: heroImageWidth,
		height: heroImageHeight,
        xDelta: 3,
    	yDelta: 0,
    	image: heroImage,
    	jumpCount: 0,
    	jumpDestination: 0,
    	jumpStart: 0
	},
	badGuys : Helpers.generateBadGuys(4)
}

const hasHeroHitBadGuy = function(){
	const res = { bool: false };
	const hero = gameState.hero;
	forEach(gameState.badGuys, function(badGuy){
		if(hero.x+hero.height >= badGuy.x && hero.x+hero.height <= badGuy.x + badGuy.width && hero.y > badGuy.y - badGuy.height ){
			res.bool = true;
		}
	});
	return res.bool;
}


const startJump = function(){
	const hero = gameState.hero;
	if(hero.jumpCount < 2){ 
		const isFirst = hero.height == 0;
		const height = hero.height*10;
		const jumpHeight = (isFirst)? height : height/2;
		hero.yDelta = worldConfig.maxYDelta;
		hero.jumpCount += 1;
		hero.jumpStart = hero.y;
		hero.jumpDestination = hero.y + jumpHeight;
	}
}

const updateState = function(){
	const hero = gameState.hero;
	hero.x += hero.xDelta;
	if(hero.x >= canvas.width){
		hero.x = 0;
	}
	if(hero.yDelta !== 0){
		const c = (hero.jumpDestination - hero.jumpStart) / (hero.jumpDestination - hero.y);
		if(hero.yDelta*c < 0.1) hero.yDelta = 0;
		else hero.yDelta *= c;
	}
	if(hero.yDelta === 0  && hero.y != worldConfig.startY - hero.height)
		hero.yDelta = -3;
	if(hero.yDelta < 0  && hero.y >= worldConfig.startY - hero.height){
		hero.y = worldConfig.startY - hero.height;
		hero.yDelta = 0;
		hero.jumpCount = 0;
	}
	hero.y -= hero.yDelta;
	const a = hasHeroHitBadGuy();
	if(a === true){

		hero.x = worldConfig.startX; 
		hero.y = worldConfig.startY - hero.height;
		hero.jumpCount = 0;
    	hero.jumpDestination = 0;
    	hero.jumpStart = 0;
    	hero.yDelta = 0;
	}
}



const Game = function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(gameState.background, 0, 0, canvas.width, canvas.height);
	const hero = gameState.hero;

	ctx.drawImage(heroImage, hero.x, hero.y, 71, 80);
	forEach(gameState.badGuys, function(badGuy){
		ctx.drawImage(badGuy.image, badGuy.x, badGuy.y, badGuy.width, badGuy.height);
	});
	updateState();
	requestAnimationFrame(Game);
}

Game();
