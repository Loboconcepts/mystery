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
var currentLocation = 2;
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
		worldArray.push("0");

	};
	// worldArray = worldArray.join("");
	worldArray = "22222000000222222000000222220000022222000"
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

// get view positions. Back three, middle three, front
function drawingWhat() {
	var whatArray = [];
	// back left, back right, back middle, middle left, middle right, middle center, front center
	whatArray.push(worldArray[getWorldArrayPosition(currentLocation + 2*fm - lm)],worldArray[getWorldArrayPosition(currentLocation + 2*fm + lm)],worldArray[getWorldArrayPosition(currentLocation + 2*fm)],worldArray[getWorldArrayPosition(currentLocation + fm - lm)],worldArray[getWorldArrayPosition(currentLocation + fm + lm)],worldArray[getWorldArrayPosition(currentLocation + fm)],worldArray[getWorldArrayPosition(currentLocation)]);
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
function drawPosition(pos,transparency) {
	ctx.beginPath();
	

	switch (pos) {
		case "0":
			wall.draw(ctx,wall.ceiling,"#0000ff");
			wall.draw(ctx,wall.floor,"#00ff00");
			break;
		case "2":
			switch(direction) {
				case "N": case "S":
					wall.draw(ctx,wall.ceiling,"#0000ff");
					wall.draw(ctx,wall.floor,"#00FF00");
					wall.draw(ctx,wall.left,"#ff0000");
					wall.draw(ctx,wall.right,"#ff0000");
					
					break;
				case "E": case "W":
					wall.draw(ctx,wall.front,"#00ff00");
					break;
			};
			
		break;
		default: 
			ctx.font = "1500px Courier";
			ctx.fillText(pos, 0, 1000);
		break;
	};
	ctx.fillStyle = "rgba(0,0,0,"+transparency+")";
	ctx.fillRect(0,0,1000,1000);
	
	ctx.closePath();
};

// Renders the box contents at the appropriate size and placement. See drawPosition for individual box art.
function DISPLAY_renderAllBoxes(tran) {
	ctx.clearRect(0,0,1000,1000);
	var allObjects = drawingWhat();
	for (var i=0;i<allObjects.length;i++) {
		ctx.save();
		switch (i) {
			case 0:
				ctx.translate(125,375);
				ctx.scale(.25,.25);
			break;
			case 2:
				ctx.translate(375,375)
				ctx.scale(.25,.25);
			break;
			case 1:
				ctx.translate(625,375)
				ctx.scale(.25,.25);
			break;
			case 3:
				ctx.translate(-250,250)
				ctx.scale(.5,.5);
			break;
			case 5:
				ctx.translate(250,250)
				ctx.scale(.5,.5);
			break;
			case 4:
				ctx.translate(750,250)
				ctx.scale(.5,.5);
			break;
			default:
				ctx.scale(1,1);
			break;

		}
		drawPosition(allObjects[i],tran);
		ctx.restore();
	};
};

var FPS = 60;

function DISPLAY_movement() {
	let c=[0,0,0,0];
	let animation = setInterval(function() {
		c[0]=c[0]+1;
		c[1]=c[1]+(500/60);
		c[2]=c[2]+(1/60);
		c[3]=c[3]+.0025;
		ctx.save();
		
		// ctx.scale(1+c[2],1+c[2]);
		// ctx.translate(-c[1],-c[1]);
		ctx.setTransform(1+c[2],0,0,1+c[2],-c[1],-c[1]);
		DISPLAY_renderAllBoxes(.3-c[3]);

		ctx.restore();
		// if (c[0]==30) LOGIC_movement();

		if (c[0]>60) clearInterval(animation),LOGIC_movement(),DISPLAY_renderAllBoxes(.3);
	}, 1000/FPS);
};

// ############### ART ################### //

var vanishingPoint = [500,500];





var wall = {
	left    : [0,0,250,250,250,750,0,1000],
	right   : [1000,0,750,250,750,750,1000,1000],
	ceiling : [0,0,0,250,1000,250,1000,0],
	floor   : [0,1000,0,750,1000,750,1000,1000],
	front   : [0,0,1000,0,1000,1000,0,1000],

	draw    : function(ctx,wallType,fill) {
		this.ctx = ctx;
		this.ctx.beginPath();
		this.ctx.fillStyle=fill;
		this.ctx.moveTo(wallType[0],wallType[1]);
		this.ctx.lineTo(wallType[2],wallType[3]);
		this.ctx.lineTo(wallType[4],wallType[5]);
		this.ctx.lineTo(wallType[6],wallType[7]);
		this.ctx.fill();
		this.bricks(wallType);
		this.ctx.closePath();
	},
	bricks   : function(wallType) {
		var brickLines = 12;
		var pp1 = 0;
		var pp2 = 0;
		if (wallType == wall.left || wallType == wall.right || wallType == wall.front) {
			for (var i=0;i<brickLines;i++) {
				this.ctx.strokeStyle = "#ffffff";
				this.ctx.lineWidth = 4;
				this.ctx.moveTo(wallType[0],pp1+wallType[1]);
				this.ctx.lineTo(wallType[2],pp2+wallType[3]);
				if (wallType == wall.left || wallType == wall.front) {
					if (i%2==0) {
						var i1=0;
						var i2 = 10;
						var i3 = 0;
						while (i3<5) {
							var y1;
							var m1 = ((pp2+wallType[3])-(pp1+wallType[1]))/wallType[2]-wallType[0];
							var x1 = i1;
							var b1 = pp1+wallType[1];
							y1 = (m1*x1)+b1

							var y2;
							var m2 = ((pp2+((wallType[5]-wallType[3])/brickLines)+wallType[3])-(pp1+((wallType[7]-wallType[1])/brickLines)+wallType[1]))/wallType[2]-wallType[0];
							var x2 = i1;
							var b2 = pp1+((wallType[7]-wallType[1])/brickLines);+wallType[1];
							y2 = (m2*x2)+b2

							this.ctx.moveTo(i1,y1);
							this.ctx.lineTo(i1,y2);
							i1 = i1+80-i2;
							i2 = i2+7;
							i3++;
						};
					}
					else {
						var i1 = 25;
						var i2 = 10;
						var i3 = 0;	
						while (i3<4) {
							var y1;
							var m1 = ((pp2+wallType[3])-(pp1+wallType[1]))/wallType[2]-wallType[0];
							var x1 = i1;
							var b1 = pp1+wallType[1];
							y1 = (m1*x1)+b1

							var y2;
							var m2 = ((pp2+((wallType[5]-wallType[3])/brickLines)+wallType[3])-(pp1+((wallType[7]-wallType[1])/brickLines)+wallType[1]))/wallType[2]-wallType[0];
							var x2 = i1;
							var b2 = pp1+((wallType[7]-wallType[1])/brickLines);+wallType[1];
							y2 = (m2*x2)+b2

							this.ctx.moveTo(i1,y1);
							this.ctx.lineTo(i1,y2);
							i1 = i1+80-i2;
							i2 = i2+5;
							i3++;
						};
					};
				}

				// THIS NEEDS TO BE INVERTED BECAUSE Y=MX+B, B = Y WHEN X=0. 
				// NEVER EQUALS 0 ON RIGHT SIDE OF CANVAS. 
				// NEED TO FIGURE OUT HOW TO SIMULATE X CROSSING THE LEFT SIDE OF CANVAS (WHICH IS 0) TO FIGURE OUT Y. 
				else if (wallType == wall.right) {
					if (i%2==0) {
						var i1=0;
						var i2 = 10;
						var i3 = 0;
						while (i3<5) {
							var y1;
							var m1 = ((pp2+wallType[3])-(pp1+wallType[1]))/wallType[2]-wallType[0];
							var x1 = i1;
							var b1 = pp1+wallType[1];
							y1 = (m1*x1)+b1
							console.log(y1)

							var y2;
							var m2 = ((pp2+((wallType[5]-wallType[3])/brickLines)+wallType[3])-(pp1+((wallType[7]-wallType[1])/brickLines)+wallType[1]))/wallType[2]-wallType[0];
							var x2 = i1;
							var b2 = pp1+((wallType[7]-wallType[1])/brickLines);+wallType[1];
							y2 = (m2*x2)+b2

							this.ctx.moveTo(i1,y1);
							this.ctx.lineTo(i1,y2);
							i1 = i1+80-i2;
							i2 = i2+7;
							i3++;
						};
					}
					else {
						var i1 = 25;
						var i2 = 10;
						var i3 = 0;	
						while (i3<4) {
							var y1;
							var m1 = ((pp2+wallType[3])-(pp1+wallType[1]))/wallType[2]-wallType[0];
							var x1 = i1;
							var b1 = pp1+wallType[1];
							y1 = (m1*x1)+b1

							var y2;
							var m2 = ((pp2+((wallType[5]-wallType[3])/brickLines)+wallType[3])-(pp1+((wallType[7]-wallType[1])/brickLines)+wallType[1]))/wallType[2]-wallType[0];
							var x2 = i1;
							var b2 = pp1+((wallType[7]-wallType[1])/brickLines);+wallType[1];
							y2 = (m2*x2)+b2

							this.ctx.moveTo(i1,y1);
							this.ctx.lineTo(i1,y2);
							i1 = i1+80-i2;
							i2 = i2+5;
							i3++;
						};
					};
				}
					
					
					
				this.ctx.stroke();
				pp1 = pp1 + (wallType[7]-wallType[1])/brickLines;
				pp2 = pp2 + (wallType[5]-wallType[3])/brickLines;
			}	
		}
	}
}

// ############# CONTROLS ############## // 
function CONTROL_turnRight() {
	LOGIC_rotate("YAW", 1);
	DISPLAY_renderAllBoxes(.3)
}

