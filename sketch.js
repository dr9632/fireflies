// Glowing effect:
// https://infosmith.biz/blog/it/p5js-blur-glow
//
// Following behavior:
// https://processing.org/examples/easing.html
//
// Particle system:
// https://p5js.org/examples/simulate-particle-system.html
// https://p5js.org/examples/simulate-multiple-particle-systems.html

var bgImg, bgSound;
var enabled = false;

var fSize = 800;
var fImg, f;
var e = 0.03;

var ff = [];
var fCount = 25;
var parti = [];
var maxP = 15;

function preload() {
	bgImg = loadImage('assets/img/bg.jpg');
	bgSound = loadSound('assets/audio/amb.mp3');
}

function setup() {
	// Setup default canvas to fill up entire window & black
	createCanvas(window.innerWidth, window.innerHeight-10);
	background(bgImg);
	noStroke();
	// Play ambient
	bgSound.play();
	bgSound.setLoop(true);
	bgSound.setVolume(0.15);
	
	// Define f
	fSet();	// Create an image
	f = new fObj(true);

	for (let i = 0; i < fCount; i++)
		ff[i] = new fObj(false);
}

function draw() {
	// For each loop, background color should be consistent
	background(bgImg);
	
	// This is for mouse following fOgj
	f.draw();
	f.update();

	// Non-following fObjs
	for (let i = 0; i < fCount; i++) {
		ff[i].draw();
		ff[i].update();
	}
	
	// If particle systems exist, run it
	for (let i = 0; i < parti.length; i++) {
		parti[i].run();
		if (parti[i].pCount < maxP)
			parti[i].addP();
		// Destroy particle system done with animation
		if (parti[i].particles.length == 0)
			parti.splice(i, 1);
	}

	if (!enabled) {
		// Overlay screen
		fill(0, 0, 0, 148);
		rect(0, 0, window.innerWidth, window.innerHeight);
		
		// Welcome text
		fill(255, 255, 250, 255);
		textSize(64);
		textFont("Covered By Your Grace");
		let wel = 'Welcome to the Forest';
		let welWidth = textWidth(wel);
		text(wel, (width-welWidth)/2+30, height/2);

		fill(255, 255, 250, 250);
		textSize(47);
		textFont("Chathura");
		let inst = 'Hold left mouse button to gather all fireflies around the cursor.';
		let instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+75);
		inst = 'Roll mouse wheel to sprinkle some fairy dusts.';
		instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+110);
		inst = 'Double click the screen to enter the forest.';
		instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+145);
	}
}

// Default behavior
function windowResized() {
	// When window is resized, resize the canvas & pass in the background color
	resizeCanvas(window.innerWidth, window.innerHeight-10);
	background(bgImg);
}

function doubleClicked() {
	enabled = true;
	bgSound.setVolume(1, 2);
}

// Throw some particles when clicked
function mouseWheel() {
	if (enabled){
		let c = color(random(198, 255), random(198, 255), random(193, 250));
		this.p = new particleSys(createVector(f.pX + fImg.width/2, f.pY + fImg.height/2), c);
		parti.push(p);
	}
}

function fSet() {
	// Create image for fairy (square size)
	fImg = createImage(fSize, fSize);
	fImg.loadPixels();
	
	// Fill in the image data
	for (var i = 0; i < fImg.width; i++) {
		for (var j = 0; j < fImg.height; j++) {
			let a = 255/(dist(fImg.width/2, fImg.height/2, i, j)-1)*1.47;
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

		// trail particle
		this.trail = [];
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
	if (this.ia)
		fill(255, 255, 250, 255);
	else
		fill(198, 255, 0, 198);

	ellipse(this.pX+fImg.width/2, this.pY+fImg.height/2,5);
}

// This needs to be called to update position
// For animating fObj
fObj.prototype.update = function() {
	if (enabled) {
		// Interactive fObj always follows the cursor
		if (this.ia) {
			// Temporary vars
			let tempX = this.pX;
			let tempY = this.pY;

			// Repostion
			this.pX += (mouseX - this.pX - fImg.width/2) * e;
			this.pY += (mouseY - this.pY - fImg.height/2) * e;

			if (this.trail.length == 0 || this.trail[this.trail.length-1].lifespan < 198) {
				let p = new particle(createVector(tempX+fImg.width/2, tempY+fImg.height/2), true);
				this.trail.push(p);
			}
			// Run trail particle
			for (let i = 0; i < this.trail.length; i++) {
				this.trail[i].run();
				// Destroy particle done with animation
				if (this.trail[i].isDead())
					this.trail.splice(i, 1);
			}
		}

		// Gather all fObj to cursor
		if (mouseIsPressed) {
			this.pX += (mouseX - this.pX - fImg.width/2) * e/2;
			this.pY += (mouseY - this.pY - fImg.height/2) * e/2;
		}

		// On default state, avoid cursor
		if (!this.ia && !mouseIsPressed &&
			abs(this.pX-f.pX) < 50 && abs(this.pY-f.pY) < 50) {
			this.pX += 50 * e/2;
			this.pY += 50 * e/2;
		}
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
var particle = function(pos, isTrail, c) {
	// Noise variation for positioning
	this.noiseX = random() * 500;
	this.noiseY = random() * 500;
	this.noiseScale = random(0.001, 0.02);
	if (!isTrail) {
		this.colorR = c.levels[0];
		this.colorG = c.levels[1];
		this.colorB = c.levels[2];
	}

	this.position = pos.copy();
	this.lifespan = 255;
	this.isTrail = isTrail;
};

particle.prototype.run = function() {
	this.update();
	this.draw();
}

// Display particles
particle.prototype.draw = function() {
	if (!this.isTrail) {
		fill(this.colorR, this.colorG, this.colorB, this.lifespan);
		ellipse(this.position.x, this.position.y, 2, 2);
		fill(this.colorR, this.colorG, this.colorB, this.lifespan/2);
		ellipse(this.position.x, this.position.y, 5, 5);
		fill(this.colorR, this.colorG, this.colorB, this.lifespan/10);
		ellipse(this.position.x, this.position.y, 12, 12);
	}
	else {
		fill(255, 255, 250, this.lifespan);
		ellipse(this.position.x, this.position.y, 2, 2);
		fill(255, 255, 250, this.lifespan/2);
		ellipse(this.position.x, this.position.y, 5, 5);
		fill(255, 255, 250, this.lifespan/10);
		ellipse(this.position.x, this.position.y, 12, 12);
	}
}

// Update particle pos & lifespan
particle.prototype.update = function() {
	this.position.x += noise(this.noiseX)*4-1.86;
	this.position.y += noise(this.noiseY)*4-1.86;

	if (!this.isTrail) {
		this.colorR += round(noise(this.noiseX)*4-0.93);
		this.colorG += round(noise(this.noiseY)*4-0.93);
		this.colorB += round(noise(this.noiseY)*4-0.93);
	}

	this.noiseX += this.noiseScale;
	this.noiseY += this.noiseScale;
	this.lifespan -= 2;
}

// Check particle's lifespan
particle.prototype.isDead = function () {
	return this.lifespan < 0;
}

// Define single particle system
var particleSys = function (pos, c) {
	this.origin = pos.copy();
	this.color = c;
	this.pCount = 0;
	this.particles = [];
};

// Add particle into the system
particleSys.prototype.addP = function () {
	let p = new particle(this.origin, false, this.color);
	this.particles.push(p);
	this.pCount++;
}

// Run the system
particleSys.prototype.run = function () {
	for (let i = this.particles.length - 1; i >= 0; i--) {
		let p = this.particles[i];
		p.run();
		if (p.isDead())
			this.particles.splice(i, 1);
	}
}