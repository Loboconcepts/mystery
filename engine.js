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
var currentLocation = 3;
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
var x = 6;
var y = x*x;
var z = 1;


// ################### LOGIC ################## //

function generateWorld() {
	worldArray = [];
	for (i=0;i<(x*x);i++) {
		worldArray.push(i.toString(36));
	};
	worldArray = worldArray.join("");
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
	else {return (whatPosition);}
};

function getWorldArrayIndexPosition(whatPosition) {
	if (whatPosition > worldArray.length) {return worldArray[(whatPosition - worldArray.length)-1];}
	else if (whatPosition < 1) {return worldArray[(whatPosition + worldArray.length)-1];}
	else {return worldArray[(whatPosition-1)];	}
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

function drawingWhat() {
	var whatArray = [];
	// back left, back right, back middle, middle left, middle right, middle center, front center
	whatArray.push(getWorldArrayIndexPosition(currentLocation + 2*fm - lm),getWorldArrayIndexPosition(currentLocation + 2*fm + lm),getWorldArrayIndexPosition(currentLocation + 2*fm),getWorldArrayIndexPosition(currentLocation + fm - lm),getWorldArrayIndexPosition(currentLocation + fm + lm),getWorldArrayIndexPosition(currentLocation + fm),getWorldArrayIndexPosition(currentLocation))
	console.log(whatArray);
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

function drawWall() {
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(250,250);
	ctx.lineTo(250,750);
	ctx.lineTo(0,1000);
	ctx.closePath();
	ctx.fillStyle = "#000000"
	ctx.fill();
}



ctx.scale(.5,.5)

drawWall();

// var canvasPosition = {
//     canvas:     '',
//     ctx:        '',
//     height:     0,
//     width:      0,
//     position:   '',
//     backScale: [.75,.75],
//     // back left, back right, back middle, middle left, middle right, middle center, front center
//     draw : function(position,)


// }


