const canvas = document.getElementById("canvas");
canvas.width = 495;
canvas.height = 495;
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

const Helpers = {
	colorArray : ['red', 'green', 'orange', 'blue', 'purpule', 'cyan', '#012345'],
	maxDelata : 10,
	// returns a random number between 1 and the given number inclusively
	// Example: rand(5) will return 1, 2, 3, 4, or 5 randomly
	rand : function(num) {
		return Math.floor(Math.random() * num) + 1;
	},
	createPoints : function(count, canvasWidth, canvasHeight) {
		maxDelata = Helpers.maxDelata;
        if(count === NaN || count === undefined) return;
        const points = [];
        forLoop(0, count, function(i){
        	points[i] = {
        		x: Helpers.rand(canvasWidth-30),
        		y: Helpers.rand(canvasHeight-30),
        		width: 30,
        		height: 30,
	            xDelta: Helpers.rand(maxDelata),
	        	yDelta: Helpers.rand(maxDelata),
	        	color: Helpers.colorArray[Helpers.rand(Helpers.colorArray.length)-1]
        	}
        });
        return points;
	},
}

const animation = {
	boxes: Helpers.createPoints(40, canvas.width, canvas.height)
}

const updateState = function(){
	forEach(animation.boxes, function(box){
		if(!(box.x > 0 && box.x + box.width <= canvas.width)) {
			box.xDelta = -1 * Math.sign(box.xDelta) * Helpers.rand(maxDelata);
			(box.x > 0)? box.x = canvas.width - box.width : box.x = 0;
		}
		if(!(box.y > 0 && box.y + box.height < canvas.height)) {
			box.yDelta = -1 * Math.sign(box.yDelta) * Helpers.rand(maxDelata);
			(box.y > 0)? box.y = canvas.width - box.width : box.y = 0;
		}
		box.x += box.xDelta;
		box.y += box.yDelta;
	});
}

const animationLoop = function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	forEach(animation.boxes, function(box){
		ctx.fillStyle = box.color;
		ctx.fillRect(box.x, box.y, box.width, box.height);
	});
	updateState();
	requestAnimationFrame(animationLoop);
}

animationLoop();
