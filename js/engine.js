function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
}


var worldArray;
var currentLocation = 7;
var moves = 0;
var viewOrient = "BACK";
var zAxis = ["UP","E","DOWN","W"];	
var yAxis = ["N","E","S","W"];
var xAxis = ["UP","S","DOWN","N"];
var direction = "N";
var topfacing = "UP";
var yawAxis;
var rollAxis;
var pitchAxis;
var um;
var fm;
var lm;
var x = 5;
var y = x*x;
var z = 1;



// ############### sin cos Math below ############ //
		// x1 = 500;
		// y1 = 500;
		// r =  1000;
		// ctx.moveTo(x1, y1);
		// ctx.lineTo(x1 + r * Math.cos(Math.PI/4), y1 + r * Math.sin(Math.PI/4));
		// ctx.moveTo(x1, y1);
		// ctx.lineTo(x1 + r * Math.cos(-Math.PI/4), y1 + r * Math.sin(-Math.PI/4));
		// ctx.moveTo(x1, y1);
		// ctx.lineTo(x1 + r * Math.cos(-Math.PI/.8), y1 + r * Math.sin(-Math.PI/.8));
		// ctx.moveTo(x1, y1);
		// ctx.lineTo(x1 + r * Math.cos(Math.PI/.8), y1 + r * Math.sin(Math.PI/.8));
		
		// ctx.stroke();

// ################### LOGIC ################## //

function generateWorld() {
	worldArray = [];
	let f=-1;
	for (i=0;i<(x*x);i++) {
		// f++;
		// if (f>35) {f=0};
		// worldArray.push(f.toString(36));
		worldArray.push("2");

	};
	worldArray = worldArray.join("");
	worldArray = "22222111100001111002221111222000111110002211112220000022222000"
};

function axisFinder() {
	var xyz = [0,0,0];
	if (topfacing == "UP" || topfacing == "DOWN") {yawAxis = y;xyz[1]=1;};
	if (topfacing == "E" || topfacing == "W") {yawAxis = x;xyz[0]=1;};
	if (topfacing == "N" || topfacing == "S") {yawAxis = z;xyz[2]=1;};
	if (direction == "UP" || direction == "DOWN") {rollAxis = y;xyz[1]=1;};
	if (direction == "E" || direction == "W") {rollAxis = x;xyz[0]=1;};
	if (direction == "N" || direction == "S") {rollAxis = z;xyz[2]=1;};
	if (xyz[0] == 1 && xyz[1] == 1) {pitchAxis = z;};
	if (xyz[0] == 1 && xyz[2] == 1) {pitchAxis = y;};
	if (xyz[1] == 1 && xyz[2] == 1) {pitchAxis = x;};
};
function cubePositioning(direction, topfacing, pos, orient) {
	// upward movement UM || forward movement FM || lateral movement LM	
	switch (direction) {
		case "N":fm = -x;break;
		case "S":fm = x;break;
		case "E":fm = z;break;
		case "W":fm = -z;break;
		case "UP":fm = -y;break;
		case "DOWN":fm = y;break;
		default:console.log("error");
	};
	switch (topfacing) {
		case "N":um = -x;break;
		case "S":um = x;break;
		case "E":um = z;break;
		case "W":um = -z;break;
		case "UP":um = -y;break;
		case "DOWN":um = y;break;
		default:console.log("error");
	};
	switch (Math.abs(fm) + Math.abs(um)) {
		case (x+y):
			if (fm*um < 0) {lm = -z;}
			else {lm = z;}
			break;
		case (z+y):
			if (fm*um < 0) {lm = x;}
			else {lm = -x;}
			break;
		case (z+x):
			if (fm*um < 0) {lm = y;}
			else {lm = -y;}
			break;
		default: console.log("error");
	}
	if ((direction == "E" || direction == "W") && (topfacing == "N" || topfacing == "S")) {lm = lm * -1};
	if (direction == "DOWN" || direction == "UP") {lm = lm * -1};
}

function getWorldArrayPosition(whatPosition) {
	if (whatPosition > worldArray.length) {return (whatPosition - worldArray.length);}
	else if (whatPosition < 1) {return (whatPosition + worldArray.length);}
	else {return whatPosition;};
};


// LOGIC for rotation, including all three axis, roll, pitch, yaw //
function LOGIC_rotate(rAxes, lr) {
	axisFinder();

	function loopThroughArray(rAxis, array, topOrDir, lr) {
		// console.log("rAxis: " + rAxis + "\n" + "array: " + array + "\n" + "topOrDir: " + topOrDir + "\n" + "left right: " + lr);
		var newDirection = array.indexOf(topOrDir) + lr;
		if (newDirection > array.length - 1) {
			newDirection = 0;
		}
		if (newDirection < 0) {
			newDirection = array.length - 1;
		}
		return newDirection;
	}
	if (rAxes == "YAW") {
		if (topfacing == "N" || topfacing == "DOWN" || topfacing == "E") {lr = lr * -1};
		switch(yawAxis) {
		case z:direction = zAxis[loopThroughArray(rAxes, zAxis, direction, lr)];break;
		case x:direction = xAxis[loopThroughArray(rAxes, xAxis, direction, lr)];break;
		case y:direction = yAxis[loopThroughArray(rAxes, yAxis, direction, lr)];break;
		default: console.log("error");
		}
	}
	if (rAxes == "ROLL") {
		if (direction == "S" || direction == "UP" || direction == "W") {lr = lr * -1};
		switch(rollAxis) {
		case z:topfacing = zAxis[loopThroughArray(rAxes, zAxis, topfacing, lr)];break;
		case x:topfacing = xAxis[loopThroughArray(rAxes, xAxis, topfacing, lr)];break;
		case y:topfacing = yAxis[loopThroughArray(rAxes, yAxis, topfacing, lr)];break;
		default: console.log("error");
		}
	}
	if (rAxes == "PITCH") {
		switch(pitchAxis) {
		case z:
			if ((zAxis.indexOf(direction) - zAxis.indexOf(topfacing) == 1) || (zAxis.indexOf(direction) - zAxis.indexOf(topfacing) == -3)) {lr = lr * -1;};
			topfacing = zAxis[loopThroughArray(rAxes, zAxis, topfacing, lr)];
			direction = zAxis[loopThroughArray(rAxes, zAxis, direction, lr)];
			break;
		case x:
			if ((xAxis.indexOf(direction) - xAxis.indexOf(topfacing) == 1) || (xAxis.indexOf(direction) - xAxis.indexOf(topfacing) == -3)) {lr = lr * -1;};
			topfacing = xAxis[loopThroughArray(rAxes, xAxis, topfacing, lr)];
			direction = xAxis[loopThroughArray(rAxes, xAxis, direction, lr)];
			break;
		case y:
			if ((yAxis.indexOf(direction) - yAxis.indexOf(topfacing) == 1) || (yAxis.indexOf(direction) - yAxis.indexOf(topfacing) == -3)) {lr = lr * -1;};
			topfacing = yAxis[loopThroughArray(rAxes, yAxis, topfacing, lr)];
			direction = yAxis[loopThroughArray(rAxes, yAxis, direction, lr)];
			break;
		default: console.log("error");
		}
	}
	console.log(direction, topfacing, currentLocation, viewOrient);
	cubePositioning(direction, topfacing, currentLocation, viewOrient);
};

function LOGIC_movement() {
	switch (direction) {
		case "N":currentLocation = currentLocation - x;break;
		case "S":currentLocation = currentLocation + x;break;
		case "E":currentLocation = currentLocation + z;break;
		case "W":currentLocation = currentLocation - z;break;
		case "UP":currentLocation = currentLocation - y;break;
		case "DOWN":currentLocation = currentLocation + y;break;
		default: console.log("OK");
	}
	if (currentLocation > worldArray.length) {currentLocation = (currentLocation - worldArray.length);}
	else if (currentLocation < 1) {currentLocation = (currentLocation + worldArray.length);}
	else {currentLocation = (currentLocation);};
}

// get view positions. Back three, middle three, closest three, current location
function drawingWhat() {
	var whatArray = []; // An array of all the positions that should be displayed.
	whatArray.push(
		worldArray[getWorldArrayPosition(currentLocation + 3*fm - lm)],   // BACK BACK LEFT
		worldArray[getWorldArrayPosition(currentLocation + 3*fm + lm)],   // BACK BACK RIGHT
		worldArray[getWorldArrayPosition(currentLocation + 3*fm)],        // BACK BACK CENTER 
		worldArray[getWorldArrayPosition(currentLocation + 2*fm - lm)],   // BACK LEFT
		worldArray[getWorldArrayPosition(currentLocation + 2*fm + lm)],   // BACK RIGHT
		worldArray[getWorldArrayPosition(currentLocation + 2*fm)],        // BACK CENTER
		worldArray[getWorldArrayPosition(currentLocation + fm - lm)],     // MIDDLE LEFT
		worldArray[getWorldArrayPosition(currentLocation + fm + lm)],     // MIDDLE RIGHT
		worldArray[getWorldArrayPosition(currentLocation + fm)],          // MIDDLE CENTER
		worldArray[getWorldArrayPosition(currentLocation - lm)],     	  // LEFT
		worldArray[getWorldArrayPosition(currentLocation + lm)],     	  // RIGHT
		worldArray[getWorldArrayPosition(currentLocation)]);              // CURRENT LOCATION
	return whatArray;
}

// ############ DISPLAY ################ //

// Canvas
var W = H = 1000;
var scale = Math.min(window.innerHeight/H, window.innerWidth/W);

var canvas = document.getElementById("canvas");
canvas.width = W;
canvas.height = H;
canvas.style.position = "relative";
canvas.style.width = "100%";
canvas.style.maxWidth = "500px";
canvas.style.height = "auto";
canvas.style.maxHeight = "500px";
var ctx = canvas.getContext("2d");
// dataUrl = canvas.toDataURL();




// Draws the individual box art, doesn't place, just draws.
function drawPosition(pos) {
	

	switch (pos) {
		case "0":
			wall.draw(ctx,wall.ceiling,"#0000ff");
			wall.draw(ctx,wall.floor,"#00ff00");
			break;
		case "1":
			switch(direction) {
				case "N": case "S":
					wall.draw(ctx,wall.ceiling,"#0000ff");
					wall.draw(ctx,wall.floor,"#00FF00");
					wall.draw(ctx,wall.front,"#ff0000");
					
					break;
				case "E": case "W":
					wall.draw(ctx,wall.ceiling,"#0000ff");
					wall.draw(ctx,wall.floor,"#00FF00");
					wall.draw(ctx,wall.right,"#ff0000");
					wall.draw(ctx,wall.left,"#ff0000");
					
					break;
			};
		break;
		case "2":
			switch(direction) {
				case "N": case "S":
					wall.draw(ctx,wall.ceiling,"#0000ff");
					wall.draw(ctx,wall.floor,"#00FF00");
					wall.draw(ctx,wall.right,"#ff0000");
					wall.draw(ctx,wall.left,"#ff0000");
					break;
				case "E": case "W":
					wall.draw(ctx,wall.ceiling,"#0000ff");
					wall.draw(ctx,wall.floor,"#00FF00");
					wall.draw(ctx,wall.front,"#ff0000");
					break;
			};
		break;

		default: 
			ctx.font = "1500px Courier";
			ctx.fillText(pos, 0, 1000);
		break;
	};
	
};

// Renders the box contents at the appropriate size and placement. See drawPosition for individual box art.
function DISPLAY_renderAllBoxes() {
	ctx.clearRect(0,0,1000,1000);
	ctx.beginPath();
	DISPLAY_BackRight();
	DISPLAY_BackLeft();
	
	
	DISPLAY_MiddleRight();
	DISPLAY_MiddleLeft();
	
	
	DISPLAY_FrontRight();
	DISPLAY_FrontLeft();
	

	DISPLAY_Right();
	DISPLAY_Left();
	
	
	

	DISPLAY_BackCenter();
	DISPLAY_MiddleCenter();
	DISPLAY_FrontCenter();
	
	DISPLAY_Current();
	ctx.closePath();
};
// ctx.fillStyle="rgba(0,0,0,0)"
function DISPLAY_BackLeft(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(0,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(180+xMove,405);
	ctx.scale(.62,.19);
	drawPosition(allObjects[0]);
	ctx.restore();
};
function DISPLAY_BackRight(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(500,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);

	ctx.translate(200+xMove,405);
	ctx.scale(.62,.19);
	drawPosition(allObjects[1]);
	ctx.restore();
};
function DISPLAY_BackCenter(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	ctx.translate(405+xMove,405);
	ctx.scale(.19,.19);
	drawPosition(allObjects[2]);
	ctx.restore();
};

function DISPLAY_MiddleLeft(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(0,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-120+xMove,310);
	ctx.scale(1.15,.38);
	drawPosition(allObjects[3]);
	ctx.restore();
};
function DISPLAY_MiddleRight(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(500,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-110+xMove,310);
	ctx.scale(1.25,.38);
	drawPosition(allObjects[4]);
	ctx.restore();
};
function DISPLAY_MiddleCenter(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	ctx.translate(310+xMove,310);
	ctx.scale(.38,.38);
	drawPosition(allObjects[5]);
	ctx.restore();
};

function DISPLAY_FrontLeft(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(0,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-725+xMove,125);
	ctx.scale(2.5,.75);
	drawPosition(allObjects[6]);
	ctx.restore();
};
function DISPLAY_FrontRight(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();

	ctx.save();
	let region = new Path2D();
	region.rect(500,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-725+xMove,125);
	ctx.scale(2.5,.75,);
	drawPosition(allObjects[7]);
	ctx.restore();
};

function DISPLAY_FrontCenter(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();

	ctx.save();
	ctx.translate(125+xMove,125);
	ctx.scale(.75,.75);
	drawPosition(allObjects[8]);
	ctx.restore();
};

function DISPLAY_Left(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(0,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-1800+xMove,-250);
	ctx.scale(5,1.5);
	drawPosition(allObjects[9]);
	ctx.restore();
};	

function DISPLAY_Right(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	let region = new Path2D();
	region.rect(500,0,500,1000);
	// ctx.stroke();
	ctx.clip(region);
	ctx.translate(-1000+xMove,-250);
	ctx.scale(5,1.5);
	drawPosition(allObjects[10]);
	ctx.restore();
};


function DISPLAY_Current(xMove) {
	if (!xMove) xMove=0;
	var allObjects = drawingWhat();
	ctx.save();
	ctx.translate(-250+xMove,-250);
	ctx.scale(1.5,1.5);
	drawPosition(allObjects[11]);
	ctx.restore();
};



// ############### ART ################### //

var vanishingPoint = [500,500];


const wall = {
	left    : [0,0,250,250,250,750,0,1000],
	right   : [1000,0,750,250,750,750,1000,1000],
	ceiling : [0,0,0,250,1000,250,1000,0],
	floor   : [0,1000,0,750,1000,750,1000,1000],
	front   : [250,250,750,250,750,750,250,750],
	behind  : [0,0,0,0,0,0,0,0],

	draw    : function(ctx,wallType,fill) {
		this.ctx = ctx;
		this.ctx.beginPath();
		this.ctx.fillStyle=fill;
		this.ctx.moveTo(wallType[0],wallType[1]);
		this.ctx.lineTo(wallType[2],wallType[3]);
		this.ctx.lineTo(wallType[4],wallType[5]);
		this.ctx.lineTo(wallType[6],wallType[7]);
		this.ctx.lineTo(wallType[0],wallType[1]);
		this.ctx.fill();
		this.bricks(wallType);
		this.ctx.closePath();
		
		
	},
	bricks   : function(wallType) {
		var brickLines = 4;
		var pp1 = 0;
		var pp2 = 0;
		if (wallType == wall.left || wallType == wall.right || wallType == wall.front) {
			for (let i=0;i<brickLines;i++) {
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.lineWidth = 4;
				this.ctx.moveTo(wallType[0],wallType[1]);
				this.ctx.lineTo(wallType[2],wallType[3]);
				this.ctx.lineTo(wallType[4],wallType[5]);
				this.ctx.lineTo(wallType[6],wallType[7]);
				this.ctx.lineTo(wallType[0],wallType[1]);
				this.ctx.moveTo(wallType[0],pp1+wallType[1]);
				this.ctx.lineTo(wallType[2],pp2+wallType[3]);
				this.ctx.stroke();
				pp1 = pp1 + (wallType[7]-wallType[1])/brickLines;
				pp2 = pp2 + (wallType[5]-wallType[3])/brickLines;
			};	
		};
	}
};

// ############# GAME ############## // 


var FPS = 60;

function setVars() {
	wall.left     = [0,0,250,250,250,750,0,1000]
	wall.right    = [1000,0,750,250,750,750,1000,1000]
	wall.ceiling  = [0,0,0,250,1000,250,1000,0]
	wall.floor    = [0,1000,0,750,1000,750,1000,1000]
	wall.front    = [250,250,750,250,750,750,250,750]
	wall.behind   = [0,0,0,0,0,0,0,0]
};

function GAME_moveForward() {
	let c=[0,0,0,0];
	let animation = setInterval(function() {
		c[0]+=1;
		c[1]+=(500/60);
		c[2]+=(1/60);
		c[3]+=.0025;
		ctx.save();
		
		// ctx.scale(1+c[2],1+c[2]);
		// ctx.translate(-c[1],-c[1]);
		ctx.transform(1+c[2],0,0,1+c[2],-c[1],-c[1]);
		DISPLAY_renderAllBoxes(.3-c[3]);

		ctx.restore();
		// if (c[0]==30) LOGIC_movement();
		

		if (c[0]>59) clearInterval(animation),LOGIC_movement(),DISPLAY_renderAllBoxes(.3);
	}, 1000/FPS);
};

function GAME_turnRight() {
	let oldWalls;
	let tempStable = wall;
	let c=[0,0,0,0,0,0];
	let fb=wall.right;
	let animation = setInterval(function() {
		ctx.clearRect(0,0,1000,1000);
		c[0]+=1;
		c[1]+=(1/35);
		c[2]+=(500/60);
		c[3]+=(2200/60);
		c[4]+=(750/60);
		c[5]+=(1/60)

		
		
		if (c[0]<29) {
			wall.right[0]+=(250/60);
			wall.right[1]+=(250/60);
			wall.right[2];
			wall.right[3];
			wall.right[4];
			wall.right[5];
			wall.right[6]+=(250/60);
			wall.right[7]-=(250/60);
			ctx.save()
			
			ctx.setTransform(1+c[1],0,0,1+c[5],-c[3],-c[2]);
			DISPLAY_FrontCenter();
			ctx.restore();
			ctx.save();
			ctx.setTransform(1,0,0,1,-c[4],0);
			DISPLAY_Current();
			ctx.restore();
		}

		else if (c[0]==29) {
			wall.front = wall.right;

			LOGIC_rotate("YAW", 1);
		}
		else {

			wall.front[0]+=(250/60);
			wall.front[1]+=(250/60);
			wall.front[2]
			wall.front[3]
			wall.front[4]
			wall.front[5]
			wall.front[6]+=(250/60);
			wall.front[7]-=(250/60);
			ctx.save()
			
			ctx.setTransform(1+c[1],0,0,1+c[5],-c[3],-c[2]);
			DISPLAY_FrontCenter();
			ctx.restore();
			ctx.save();
			ctx.setTransform(1,0,0,1,-c[4],0);
			DISPLAY_Current();
			ctx.restore();

		}

		
		
		


		if (c[0]>59) clearInterval(animation),setVars(),ctx.setTransform(1,0,0,1,0,0),DISPLAY_renderAllBoxes(); //
	}, 1000/FPS);
	
	
}



// ########## DEGUB ############ //
function guideLines() {
	ctx.beginPath()
	ctx.strokeStyle="#000000"
	ctx.moveTo(0,0)
	ctx.lineTo(1000,1000)
	ctx.moveTo(1000,0)
	ctx.lineTo(0,1000)
	ctx.moveTo(0,350)
	ctx.lineTo(1000,650)
	ctx.moveTo(0,650)
	ctx.lineTo(1000,350)
	ctx.stroke()
	ctx.closePath()
}
