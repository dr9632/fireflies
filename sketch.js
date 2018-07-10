// Glowing effect:
// https://infosmith.biz/blog/it/p5js-blur-glow
//
// Following behavior:
// https://processing.org/examples/easing.html
//
// Particle system:
// https://p5js.org/examples/simulate-particle-system.html
// https://p5js.org/examples/simulate-multiple-particle-systems.html
//
// Interactive slider:
// http://coursescript.com/notes/interactivecomputing/interactivity/

// Setup ambient
var bgImg, bgSound, bgm;
var enabled = false;
// Setup controls
var menu = false;
var fSlider;
var bgChk = true;
var fsChk = true;
var musChk = false;

var fSize = 800;
var fImg, f, fSound;
var e = 0.03;

var ff = [];
var fCount = 25;
var parti = [];
var maxP = 15;

function preload() {
	bgImg = loadImage('assets/img/bg.jpg');
	bgSound = loadSound('assets/audio/amb.mp3');
	bgm = loadSound('assets/audio/bgm.mp3');
	fSound = loadSound('assets/audio/fs.mp3');
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
	bgSound.playMode('sustain');

	// BGM settings
	bgm.setLoop(true);
	bgm.playMode('sustain');
	
	// Define f
	fSet();	// Create an image
	f = new fObj(true);

	for (let i = 0; i < fCount; i++)
		ff[i] = new fObj(false);

	// Set volume for fSound
	fSound.setVolume(0.3);

	// Slider: ff num control
	fSlider = createSlider(5, 50, fCount);
	fSlider.position(10, 10);
	fSlider.hide();
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
		ff[i].hover();
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

	// If menu is on
	if (menu){
		// Slider label
		fill(255, 255, 250, 200);
		textSize(32);
		textFont("Chathura");
		var label = 'Num. of Fireflies: ' + fCount;
		text(label, 155, 27);
		// If slider val increases create more fObjs
		if (fCount < fSlider.value()) {
			for (let i = fCount; i < fSlider.value(); i++)
				ff[i] = new fObj(false);
		}
		// If slider val decreases destroy fObjs
		if (fCount > fSlider.value())
			ff.splice(fSlider.value(), fCount-fSlider.value());
		// Reset fCount val
		fCount = fSlider.value();
		
		// bgCheckbox
		if (ischkHover(16, 51)){
			fill(255, 255 , 250, 168);
			rect(9, 44, 14, 14);
			fill(255, 255 , 250, 48);
			rect(7, 42, 18, 18);
			fill(255, 255 , 250, 12);
			rect(4, 39, 24, 24);
		}
		if (bgChk) 
			fill(198, 220, 100);
		else
			fill(98, 98, 98);
		rect(10, 45, 12, 12);

		// bgCheckbox label
		fill(255, 255, 250, 200);
		textSize(32);
		textFont("Chathura");
		label = 'Ambient';
		text(label, 32, 58);

		// fsCheckbox
		if (ischkHover(126, 51)){
			fill(255, 255 , 250, 168);
			rect(119, 44, 14, 14);
			fill(255, 255 , 250, 48);
			rect(117, 42, 18, 18);
			fill(255, 255 , 250, 12);
			rect(114, 39, 24, 24);
		}
		if (fsChk) 
			fill(198, 220, 100);
		else
			fill(98, 98, 98);
		rect(120, 45, 12, 12);

		// fsCheckbox label
		fill(255, 255, 250, 200);
		label = 'Chime';
		text(label, 142, 58);

		// musCheckbox
		if (ischkHover(226, 51)){
			fill(255, 255 , 250, 168);
			rect(219, 44, 14, 14);
			fill(255, 255 , 250, 48);
			rect(217, 42, 18, 18);
			fill(255, 255 , 250, 12);
			rect(214, 39, 24, 24);
		}
		if (musChk) 
			fill(198, 220, 100);
		else
			fill(98, 98, 98);
		rect(220, 45, 12, 12);

		// fsCheckbox label
		fill(255, 255, 250, 200);
		textSize(18);
		label = '\u266C';
		text(label, 242, 58);
		
		// menu close btn
		if (isMenuHover(menu)) {
			fill(255, 255 , 250, 48);
			rect(281, 44, 18, 18);
			fill(255, 255 , 250, 12);
			rect(278, 41, 24, 24);
		}
		fill(255, 255, 250,168);
		rect(283, 46, 14, 14);
		fill(98, 98, 98);
		rect(284, 47, 12, 12);

		// menu close label
		fill(255, 255, 250, 200);
		textSize(24);
		label = 'X';
		text(label, 286.5, 58);
	}
	else {	// If menu is off
		if (isMenuHover(menu)){
			fill(255, 255 , 250, 48);
			ellipse(25, 25, 33, 33);
			fill(255, 255 , 250, 12);
			ellipse(25, 25, 41, 41);
		}
		fill(255, 255, 250);
		ellipse(25, 25, 30, 30);
		fill(98, 98, 98);
		ellipse(25, 25, 29, 29);
		fill(255, 255, 250);
		rect(17, 17.5, 7, 7);
		rect(26.5, 17.5, 7, 7);
		rect(17, 27, 7, 7);
		rect(26.5, 27, 7, 7);
		fill(98, 98, 98);
		rect(18, 18, 5, 5);
		rect(27.5, 18, 5, 5);
		rect(18, 28, 5, 5);
		rect(27.5, 28, 5, 5);
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
		let inst = 'Click to sprinkle some fairy dusts.';
		let instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+75);
		inst = 'Roll mouse wheel to gather or spread fireflies.';
		instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+110);
		inst = 'Double click the screen to enter the forest.';
		instWidth = textWidth(inst);
		text(inst, (width-instWidth)/2+30, height/2+145);
	}
}

function windowResized() {
	// When window is resized, resize the canvas & pass in the background color
	resizeCanvas(window.innerWidth, window.innerHeight-10);
	background(bgImg);
}

// Exit wait screen
function doubleClicked() {
	enabled = true;
	bgSound.setVolume(1, 2);
}

// Throw some particles when wheel roll
function mouseWheel(event) {
	if (enabled){
		// Gather all fObj to cursor
		if (event.delta > 0) {
			for (let i = 0; i < fCount; i++) {
				ff[i].draw();
				ff[i].update(false);
				ff[i].hover();
			}
		}
		// Spread all fObj away from cursor
		if (event.delta < 0){
			for (let i = 0; i < fCount; i++) {
				ff[i].draw();
				ff[i].update(true);
				ff[i].hover();
			}
		}
	}
}

function isMenuHover(open) {
	if (open)
		return dist(mouseX, mouseY, 290, 53) < 12;
	if (!open && enabled)
		return dist(mouseX, mouseY, 25, 25) < 15;
	return false;
}

function ischkHover(pX, pY) {
	return dist(mouseX, mouseY, pX, pY) < 12;
}

// Menu interactivity
function mousePressed() {
	// Menu open/close
	if (isMenuHover(false) && !menu) {
		fSlider.show();
		menu = true;
	}
	else if (isMenuHover(true) && menu) {
		fSlider.hide();
		menu = false;
	}

	// bgCheckbox
	else if (ischkHover(16, 51)){
		bgChk = !bgChk;
		if (bgChk) bgSound.play();
		else bgSound.stop();
	}
	// fsCheckbox
	else if (ischkHover(126, 51))
		fsChk = !fsChk;
	else if(ischkHover(226, 51)) {
		musChk = !musChk;
		if (musChk) bgm.play();
		else bgm.stop();
	}
	else if (enabled){
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

		this.rate = random(0.5,2);
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
fObj.prototype.update = function(pos) {
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
		if (pos) {
			this.pX += (mouseX - this.pX - fImg.width/2) * e/2;
			this.pY += (mouseY - this.pY - fImg.height/2) * e/2;
		}
		if (pos == false) {
			this.pX -= (mouseX - this.pX - fImg.width/2) * e/2;
			this.pY -= (mouseY - this.pY - fImg.height/2) * e/2;
		}

		// On default state, avoid cursor
		if (!this.ia &&	abs(this.pX-f.pX) < 50 && abs(this.pY-f.pY) < 50) {
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

fObj.prototype.hover = function () {
	if (dist(f.pX, f.pY, this.pX, this.pY) < 5 && enabled && fsChk) {
		fSound.rate(this.rate);
		fSound.play();
		this.rate = random(0.5,2);
	}
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