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
	// worldArray = "22222111100001111002221111222000111110002211112220000022222000"
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
canvas.style.maxHeight = "250px";
var ctx = canvas.getContext("2d");
ctx.translate(500,500);



// dataUrl = canvas.toDataURL();




// Draws the individual box art, doesn't place, just draws.
function drawPosition(pos,posAdj,sizeAdj) {
	

	switch (pos) {
		case "0":
			// wall.draw(ctx,wall.ceiling,"#0000ff",posAdj,sizeAdj);
			// wall.draw(ctx,wall.floor,"#00ff00",posAdj,sizeAdj);
			break;
		case "1":
			switch(direction) {
				case "N": case "S":
					// wall.draw(ctx,wall.ceiling,"#0000ff",posAdj,sizeAdj);
					// wall.draw(ctx,wall.floor,"#00FF00",posAdj,sizeAdj);
					wall.draw(ctx,wall.front,"#ff0000",posAdj,sizeAdj);
					
					break;
				case "E": case "W":
					// wall.draw(ctx,wall.ceiling,"#0000ff",posAdj,sizeAdj);
					// wall.draw(ctx,wall.floor,"#00FF00",posAdj,sizeAdj);
					wall.draw(ctx,wall.right,"#ff0000",posAdj,sizeAdj);
					wall.draw(ctx,wall.left,"#ff0000",posAdj,sizeAdj);
					
					break;
			};
		break;
		case "2":
			switch(direction) {
				case "N": case "S":
					// wall.draw(ctx,wall.ceiling,"#0000ff",posAdj,sizeAdj);
					// wall.draw(ctx,wall.floor,"#00FF00",posAdj,sizeAdj);
					wall.draw(ctx,wall.right,"#ff0000",posAdj,sizeAdj);
					wall.draw(ctx,wall.left,"#ff0000",posAdj,sizeAdj);
					break;
				case "E": case "W":
					// wall.draw(ctx,wall.ceiling,"#0000ff",posAdj,sizeAdj);
					// wall.draw(ctx,wall.floor,"#00FF00",posAdj,sizeAdj);
					wall.draw(ctx,wall.front,"#ff0000",posAdj,sizeAdj);
					break;
			};
		break;

		default: 
			ctx.font = "1500px Courier";
			ctx.fillText(pos, 0, 1000);
		break;
	};
	
};

function backgroundArt(tran) {
	ctx.beginPath();
	ctx.fillStyle="rgba(100,200,250,"+tran+")";
	ctx.fillRect(-500,-500,1000,500);
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle="rgba(100,250,150,"+tran+")";
	ctx.fillRect(-500,0,1000,500);
	ctx.closePath();
}

backgroundArt()

// Renders the box contents at the appropriate size and placement. See drawPosition for individual box art.
function DISPLAY_renderAllBoxes() {	
	// ctx.clearRect(-500,-500,1000,1000);
	ctx.beginPath();

	// DISPLAY_BackLeft(0,[0,0,0,0,0,0,0,0,0]);
	// DISPLAY_BackRight(0,[0,0,0,0,0,0,0,0,0]);
	
	
	// DISPLAY_MiddleLeft(0,[0,0,0,0,0,0,0,0,0]);
	// DISPLAY_MiddleRight(0,[0,0,0,0,0,0,0,0,0]);
	
	
	// DISPLAY_FrontLeft(0,[0,0,0,0,0,0,0,0,0]);
	// DISPLAY_FrontRight(0,[0,0,0,0,0,0,0,0,0]);
	
	
	// DISPLAY_Left(0,[0,0,0,0,0,0,0,0,0]);
	// DISPLAY_Right(0,[0,0,0,0,0,0,0,0,0]);
	
	
	
	
	
	
	// DISPLAY_MiddleCenter(0,[0,0,0,0,0,0,0,0]);
	// DISPLAY_FrontCenter(0,[0,0,0,0,0,0,0,0]);
	
	DISPLAY_BackCenter(0,[0,0,0,0,0,0,0,0]);
	// DISPLAY_Current(0,[0,0,0,0,0,0,0,0]);

	ctx.closePath();
};
// ctx.fillStyle="rgba(0,0,0,0)"
function DISPLAY_BackLeft(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 5;
	var allObjects = drawingWhat();
	ctx.save();
	// ctx.translate(-190+xMove,0);
	var a = [-1000,0,-500,0,-500,0,-1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	console.log(c)
	ctx.scale(.19,.19);
	drawPosition(allObjects[0],c,sizeAdj);
	ctx.restore();
};
function DISPLAY_BackRight(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 5;
	var allObjects = drawingWhat();
	ctx.save();
	var a = [1000,0,500,0,500,0,1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.scale(.19,.19);
	drawPosition(allObjects[1],c,sizeAdj);
	ctx.restore();
};
function DISPLAY_BackCenter(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 2.5;
	var allObjects = drawingWhat();
	ctx.save();
	// ctx.translate(0+xMove,0);
	posAdj = [0,0,0,0,0,0,0,0];
	// ctx.scale(.19,.19);
	drawPosition(allObjects[2],posAdj,sizeAdj);
	ctx.restore();
};

function DISPLAY_MiddleLeft(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 2.5;
	var allObjects = drawingWhat();
	ctx.save();
	var a = [-1000,0,-500,0,-500,0,-1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.scale(.38,.38);
	drawPosition(allObjects[3],c,sizeAdj);
	ctx.restore();
};
function DISPLAY_MiddleRight(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 2.5;
	var allObjects = drawingWhat();
	var a = [1000,0,500,0,500,0,1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.save();
	// ctx.translate(380+xMove,0);
	ctx.scale(.38,.38);
	drawPosition(allObjects[4],c,sizeAdj);
	ctx.restore();
};
function DISPLAY_MiddleCenter(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	if (!sizeAdj) sizeAdj = 5;
	var allObjects = drawingWhat();
	ctx.save();
	posAdj = [0,0,0,0,0,0,0,0];
	// ctx.scale(.38,.38);
	drawPosition(allObjects[5],posAdj,sizeAdj);
	ctx.restore();
};

function DISPLAY_FrontLeft(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	ctx.save();
	var a = [-1000,0,-500,0,-500,0,-1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.scale(.75,.75);
	drawPosition(allObjects[6],c);
	ctx.restore();
};
function DISPLAY_FrontRight(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	var a = [1000,0,500,0,500,0,1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.save();
	// ctx.translate(750+xMove,0);
	ctx.scale(.75,.75,);
	drawPosition(allObjects[7],c);
	ctx.restore();
};

function DISPLAY_FrontCenter(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	ctx.save();
	ctx.translate(0+xMove,0);
	ctx.scale(.75,.75);
	drawPosition(allObjects[8],posAdj);
	ctx.restore();
};

function DISPLAY_Left(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	ctx.save();
	var a = [-1000,0,-500,0,-500,0,-1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.scale(1.5,1.5);
	drawPosition(allObjects[9],c);
	ctx.restore();
};	

function DISPLAY_Right(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	var a = [1000,0,500,0,500,0,1000,0],
		b = posAdj;
	var c = a.map(function(item,index) {
		return item+b[index];
	})
	ctx.save();
	// ctx.translate(1500+xMove,0);
	ctx.scale(1.5,1.5);
	drawPosition(allObjects[10],c);
	ctx.restore();
};


function DISPLAY_Current(xMove,posAdj,sizeAdj) {
	if (!xMove) xMove=0;
	if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
	var allObjects = drawingWhat();
	ctx.save();
	ctx.translate(0+xMove,0);
	ctx.scale(1.5,1.5);
	drawPosition(allObjects[11],posAdj);
	ctx.restore();
};



// ##################################### ART ######################################### //

var vanishingPoint = [0,0];


const wall = {
	left    : [-500,-500,-250,-250,-250,250,-500,500],
	right   : [500,-500,250,-250,250,250,500,500],
	ceiling : [-500,-500,-500,-250,500,-250,500,0],
	floor   : [-500,500,-500,250,500,250,500,500],
	front   : [-250,-250,250,-250,250,250,-250,250],
	behind  : [0,0,0,0,0,0,0,0],

	draw    : function(ctx,wallType,fill,posAdj,sizeAdj) {
		if (!posAdj) posAdj = [0,0,0,0,0,0,0,0];
		if (!sizeAdj) sizeAdj = 1;
		this.ctx = ctx;
		this.ctx.beginPath();
		this.ctx.fillStyle=fill;
		// let topSlope = this.slope(wallType[0]+posAdj[0],wallType[1]+posAdj[1],wallType[2]+posAdj[2],wallType[3]+posAdj[3]);
		// let botSlope = this.slope(wallType[4]+posAdj[4],wallType[5]+posAdj[5],wallType[6]+posAdj[6],wallType[7]+posAdj[7]);

		let topSlope = this.slope((wallType[0]+posAdj[0])/sizeAdj,(wallType[1]+posAdj[1])/sizeAdj,(wallType[2]+posAdj[2])/sizeAdj,(wallType[3]+posAdj[3])/sizeAdj,sizeAdj);
		let botSlope = this.slope((wallType[4]+posAdj[4])/sizeAdj,(wallType[5]+posAdj[5])/sizeAdj,(wallType[6]+posAdj[6])/sizeAdj,(wallType[7]+posAdj[7])/sizeAdj,sizeAdj);

		if (wallType == wall.front) {
			this.ctx.moveTo(topSlope[0],topSlope[1]);
			this.ctx.lineTo(topSlope[2],topSlope[3]);
			this.ctx.lineTo(botSlope[0],botSlope[1]);
			this.ctx.lineTo(botSlope[2],botSlope[3]);
			this.ctx.lineTo(topSlope[0],topSlope[1]);
		}
		else {

			this.ctx.moveTo(topSlope[0],topSlope[1]);
			this.ctx.lineTo(topSlope[2],topSlope[3]);
			this.ctx.lineTo(botSlope[0],botSlope[1]);
			this.ctx.lineTo(botSlope[2],botSlope[3]);
			this.ctx.lineTo(topSlope[0],topSlope[1]);
			
		};
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
		// this.bricks(wallType,posAdj);
		this.ctx.closePath();
		
		
	},
	bricks   : function(wallType,posAdj) {
		var brickLines = 4;
		var pp1 = ((wallType[7]+posAdj[7])-(wallType[1]+posAdj[1]))/brickLines;
		var pp2 = ((wallType[5]+posAdj[5])-(wallType[3]+posAdj[3]))/brickLines;
		if (wallType == wall.left || wallType == wall.right || wallType == wall.front) {
			for (let i=0;i<brickLines-1;i++) {
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.lineWidth = 4;
				this.ctx.moveTo(wallType[0]+posAdj[0],pp1+wallType[1]+posAdj[1]);
				this.ctx.lineTo(wallType[2]+posAdj[2],pp2+wallType[3]+posAdj[3]);
				this.ctx.stroke();
				pp1 = pp1 + ((wallType[7]+posAdj[7])-(wallType[1]+posAdj[1]))/brickLines;
				pp2 = pp2 + ((wallType[5]+posAdj[5])-(wallType[3]+posAdj[3]))/brickLines;
			};	
		};
	},
	slope    : function(x1, y1, x2, y2,sizeAdj) {
		//slope y2-y1/x2-x1
		if (Math.abs(x1)>Math.abs(x2)) {
			var vX1=x1+parseInt(vanishingPoint[0]);
			var vY1=y1;
			var vX2=x2+parseInt(vanishingPoint[0])*1.2;//innie
			var vY2=y2;
			
			let slope = (vY1-vanishingPoint[1])/(vX1-vanishingPoint[0]);
			vY2 = slope*vX2+(vY1+(-(slope)*vX1));
			return [vX1,vY1,vX2,vY2];
		}
		else if(Math.abs(x2)>Math.abs(x1)) {
			var vX1=x1+parseInt(vanishingPoint[0])*1.2;//innie
			var vY1=y1;
			var vX2=x2+parseInt(vanishingPoint[0]);
			var vY2=y2;
			let slope = (vY2-vanishingPoint[1])/(vX2-vanishingPoint[0]);
			vY1 = slope*vX1+(vY2+(-(slope)*vX2))
			return [vX1,vY1,vX2,vY2];
		}
		else {
			return [x1,y1,x2,y2];
		}
	}
};

// ##################################### GAME ###################################### // 


var FPS = 60;

function setVars() {
	vanishingPoint = [0,0];
	wall.left     = [-500,-500,-250,-250,-250,250,-500,500];
	wall.right    = [500,-500,250,-250,250,250,500,500];
	wall.ceiling  = [-500,-500,-500,-250,500,-250,500,0];
	wall.floor    = [-500,500,-500,250,500,250,500,500];
	wall.front    = [-250,-250,250,-250,250,250,-250,250];
	wall.behind   = [0,0,0,0,0,0,0,0];
};

function GAME_moveForward() {
	let c=[0,0,0,0];
	
	let animation = setInterval(function() {
		ctx.clearRect(0,0,1000,1000);
		c[0]+=1;
		c[1]+=(500/60);
		c[2]+=(1/60);
		c[3]+=.0025;
		ctx.save();
		
		ctx.transform(1+c[2],0,0,1+c[2],0,0);
		DISPLAY_renderAllBoxes(.3-c[3]);

		ctx.restore();
		// if (c[0]==30) LOGIC_movement();
		

		if (c[0]>59) clearInterval(animation),LOGIC_movement(),DISPLAY_renderAllBoxes(.3);
	}, 1000/FPS);
};

function GAME_turnRight() {
	let c=[0,0,0,0,0,0,0,0,0,0,0];
	

	let animation = setInterval(function() {
		backgroundArt(.8)
		c[0]+=1;
		c[1]+=(1100/60);
		c[2]+=(500/60);
		

		
		// DISPLAY_FrontCenter(0,[0,0,0,0,0,0,0,0]);

		console.log(vanishingPoint[0])
		
		
		if (c[0]<29) {
			vanishingPoint = [-c[1],0];

			// DISPLAY_MiddleCenter(-c[6] ,[-c[2] ,-c[1] ,-c[3] ,-c[3] ,-c[3] ,c[3] ,-c[2] ,c[1]   ]);
			// DISPLAY_FrontCenter(-c[5]  ,[-c[2] ,0     ,-c[3] ,-c[2] ,-c[3] ,c[2] ,-c[2] ,0      ]);
			

			// DISPLAY_BackCenter(-c[8],[
			// 	c[6],-c[6],
			// 	-c[8],-c[7],
			// 	-c[8],c[7],
			// 	c[6],c[6]
			// 	]);

			// DISPLAY_MiddleCenter(-c[6],[
			// 	c[4],-c[4],
			// 	-c[9],-c[1],
			// 	-c[9],c[1],
			// 	c[4],c[4]
			// 	]);

			DISPLAY_FrontCenter(0,[
				-c[2],0,
				-c[1],0,
				-c[1],0,
				-c[2],0,
				]);

			// DISPLAY_Current(-c[1],[
			// 	c[2],c[2],
			// 	0,0,
			// 	0,0,
			// 	c[2],-c[2]
			// 	]);

			// ctx.setTransform(1,0,0,1,0,0)

		}
		else {

			if (c[0]==29) {
				wall.left  = wall.front;
				wall.front = wall.right;
				LOGIC_rotate("YAW", 1);
			}
			vanishingPoint = [-c[1]+1000,0];

			
			// DISPLAY_MiddleCenter(-c[6] ,[-c[2] ,-c[1] ,-c[3] ,-c[3] ,-c[3] ,c[3] ,-c[2] ,c[1]   ]);
			// DISPLAY_FrontCenter(-c[5]  ,[-c[2] ,0     ,-c[3] ,-c[2] ,-c[3] ,c[2] ,-c[2] ,0      ]);
			
			// DISPLAY_BackCenter(-c[8],[
			// 	c[6],-c[6],
			// 	-c[8],-c[7],
			// 	-c[8],c[7],
			// 	c[6],c[6]
			// 	]);

			// DISPLAY_MiddleCenter(-c[6],[
			// 	c[4],-c[4],
			// 	-c[9],-c[1],
			// 	-c[9],c[1],
			// 	c[4],c[4]
			// 	]);

			DISPLAY_FrontCenter(0,[
				c[2],0,
				c[1],0,
				c[1],0,
				c[2],0,
				]);

			// DISPLAY_Current(-c[1],[
			// 	c[2],c[2],
			// 	0,0,
			// 	0,0,
			// 	c[2],-c[2]
			// 	]);



			// ctx.setTransform(1,0,0,1,0,0)
			

			// ctx.save()
			// ctx.setTransform(1+c[1],0,0,1+c[5],-c[3],-c[2]);
			// DISPLAY_FrontCenter();
			// ctx.restore();
			// ctx.save();
			// ctx.setTransform(1,0,0,1,-c[4],0);
			// DISPLAY_Current();
			// ctx.restore();

		}




		if (c[0]>59) clearInterval(animation),setVars(),backgroundArt(1),DISPLAY_renderAllBoxes();  //
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




			// this.ctx.moveTo(vanishingPoint[0],wallType[1]+posAdj[1]);
			// this.ctx.lineTo(wallType[0]+posAdj[0],wallType[1]+posAdj[1]);
			// this.ctx.lineTo(wallType[0]+posAdj[0],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],wallType[1]+posAdj[1]);

			// this.ctx.moveTo(vanishingPoint[0],wallType[3]+posAdj[3]);
			// this.ctx.lineTo(wallType[2]+posAdj[2],wallType[3]+posAdj[3]);
			// this.ctx.lineTo(wallType[2]+posAdj[2],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],wallType[3]+posAdj[3]);

			// this.ctx.moveTo(vanishingPoint[0],wallType[5]+posAdj[5]);
			// this.ctx.lineTo(wallType[4]+posAdj[4],wallType[5]+posAdj[5]);
			// this.ctx.lineTo(wallType[4]+posAdj[4],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],wallType[5]+posAdj[5]);

			// this.ctx.moveTo(vanishingPoint[0],wallType[7]+posAdj[7]);
			// this.ctx.lineTo(wallType[6]+posAdj[6],wallType[7]+posAdj[7]);
			// this.ctx.lineTo(wallType[6]+posAdj[6],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],vanishingPoint[1]);
			// this.ctx.lineTo(vanishingPoint[0],wallType[7]+posAdj[7]);
			
			