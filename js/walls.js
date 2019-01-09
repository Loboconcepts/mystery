var numTextures = 4;
var wallTextures = [
	"walls_1.png",
	"walls_2.png",
	"walls_3.png",
	"walls_4.png"
];

var stripWidth = 3;
var fov = 60 * Math.PI / 180;

var numRays = Math.ceil(screenWidth / stripWidth);
var fovHalf = fov / 2;

var viewDist = (screenWidth/2) / Math.tan((fov / 2));

var twoPI = Math.PI * 2;

var screenStrips = [];
var overlay;