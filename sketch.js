// Glowing effect:
// https://infosmith.biz/blog/it/p5js-blur-glow
//
// Following behavior:
// https://processing.org/examples/easing.html
//
// Particle system:
// https://p5js.org/examples/simulate-particle-system.html
// https://p5js.org/examples/simulate-multiple-particle-systems.html

var fSize = 800;
var fImg, f;
var e = 0.01;

var ff = [];
var fCount = 10;
var parti = [];
var maxP = 30;

function setup() {
	// Setup default canvas to fill up entire window & black
	createCanvas(window.innerWidth, window.innerHeight-10);
	background(0);
	noStroke();
	
	// Define f
	fSet();	// Create an image
	f = new fObj(true);

	for (var i = 0; i < fCount; i++)
		ff[i] = new fObj(false);
}

function draw() {
	// For each loop, background color should be consistent
	background(0);
	
	// This is for mouse following fOgj
	f.draw();
	f.update();

	// Non-following fObjs
	for (var i = 0; i < fCount; i++) {
		ff[i].draw();
		ff[i].update();
	}
	
	// If particle systems exist, run it
	for (var i = 0; i < parti.length; i++) {
		parti[i].run();
		if (parti[i].pCount < maxP)
			parti[i].addP();
		// Destroy particle system done with animation
		if (parti[i].particles.length == 0)
			parti.splice(i, 1);
	}
}

function windowResized() {
	// When window is resized, resize the canvas & pass in the background color
	resizeCanvas(window.innerWidth, window.innerHeight-10);
	background(0);
}

// Throw some particles when clicked
function mousePressed() {
	this.p = new particleSys(createVector(f.pX + fImg.width/2, f.pY + fImg.height/2));
	parti.push(p);
}

function fSet() {
	// Create image for fairy (square size)
	fImg = createImage(fSize, fSize);
	fImg.loadPixels();
	
	// Fill in the image data
	for (var i = 0; i < fImg.width; i++) {
		for (var j = 0; j < fImg.height; j++) {
			var a = 255/(dist(fImg.width/2, fImg.height/2, i, j)-1)*1.47;
			if (a < .94) a = 0;
			fImg.set(i, j, color(255, 255, 250, a));
		}
	}
	fImg.updatePixels();
}

// Construcor for fObj
var fObj = function(interactive) {
	// Initial position
	if (interactive) {
		this.pX = mouseX;
		this.pY = mouseY;
	}
	else {
		this.pX = random(0-fImg.width/2, width-fImg.width/2);
	    this.pY = random(0-fImg.height/2, height-fImg.height/2);
	}

	this.noiseX = random()*1000;
	this.noiseY = random()*1000;
	this.noiseScale = random(0.001, 0.02);

	this.ia = interactive;
};

// Class function for drawing fObj
// This needs to be called to actually printed out to the canvas
fObj.prototype.draw = function() {
	image(fImg, this.pX, this.pY);
	if (this.ia) {
		fill(255, 255, 250, 255);
	}
	else {
		fill(198, 255, 0, 198);
	}

	ellipse(this.pX+fImg.width/2, this.pY+fImg.height/2,5);
}

// This needs to be called to update position
// For animating fObj
fObj.prototype.update = function() {
	if (this.ia) {
		this.pX += (mouseX - this.pX - fImg.width/2) * e;
		this.pY += (mouseY - this.pY - fImg.height/2) * e;
	}

	this.pX += noise(this.noiseX)*4-1.86;
    this.pY += noise(this.noiseY)*4-1.86;

	// Prevent object from leaving the canvas
    if (this.pX < 0-fImg.width/2) { this.pX = 0-fImg.width/2;}
    if (this.pX > width-fImg.width/2) { this.pX = width-fImg.width/2;}
    if (this.pY < 0-fImg.height/2) { this.pY = 0-fImg.height/2;}
    if (this.pY > height-fImg.height/2) { this.pY = height-fImg.height/2;}

    this.noiseX += this.noiseScale;
    this.noiseY += this.noiseScale;
}

// Define single particle
var particle = function(pos) {
	// y is set to 0.01 to evenly spread out the particle
	this.acceleration = createVector(0, 0.01);
	this.velocity = createVector(random(-1, 1), random(-1, 0));
	this.position = pos.copy();
	this.lifespan = 255;
};

particle.prototype.run = function() {
	this.update();
	this.draw();
}

// Display particles
particle.prototype.draw = function() {
	fill(255, 255, 250, this.lifespan);
	ellipse(this.position.x, this.position.y, 2, 2);
	fill(255, 225, 250, this.lifespan/2);
	ellipse(this.position.x, this.position.y, 5, 5);
	fill(255, 225, 250, this.lifespan/10);
	ellipse(this.position.x, this.position.y, 12, 12);
}

// Update particle pos & lifespan
particle.prototype.update = function() {
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
	this.lifespan -= 2;
}

// Check particle's lifespan
particle.prototype.isDead = function () {
	return this.lifespan < 0;
}

// Define single particle system
var particleSys = function (pos) {
	this.origin = pos.copy();
	this.pCount = 0;
	this.particles = [];
};

// Add particle into the system
particleSys.prototype.addP = function () {
	var p = new particle(this.origin);
	this.particles.push(p);
	this.pCount++;
}

// Run the system
particleSys.prototype.run = function () {
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var p = this.particles[i];
		p.run();
		if (p.isDead())
			this.particles.splice(i, 1);
	}
}