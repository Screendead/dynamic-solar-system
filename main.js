let planets = [];
let zoomManager;
let planetData;

function preload() {
    planetData = loadJSON('planets.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(RADIANS);
    zoomManager = new ZoomManager();
    initializeSolarSystem();
}

function draw() {
    background(0);

    push();
    zoomManager.update();
    zoomManager.applyTransformations();
    updateAndDisplayPlanets();
    pop();
    
    showInfo();
}

function initializeSolarSystem() {
    for (let name in planetData) {
        const data = planetData[name];
        planets.push(new Planet(name, data.radius, data.distance, data.orbitSpeed, color(...data.color), data.info));
    }
}

function updateAndDisplayPlanets() {
    push();
    for (let p of planets) {
        push();
        p.displayOrbit();
        p.orbit();
        p.show(0, 0);
        pop();
    }
    pop();
}

function showInfo() {
    const TEXT_SIZE = 24;
    if (zoomManager.settings.target) {
        // Show box on the right side of the screen
        fill(51);
        stroke(255);
        let boxX = width * 0.75;
        let boxY = 4;
        let boxWidth = width * 0.25;
        let boxHeight = height - 4;
        rect(boxX, boxY, boxWidth, boxHeight);

        textSize(TEXT_SIZE);
        fill(255);
        noStroke();
        let target = zoomManager.settings.target;
        let screenCoords = target.getScreenCoords(0, 0);
        let info = target.info;
        // Wrap text
        let words = info.split(' ');
        let lines = [];
        let currentLine = '';
        for (let word of words) {
            if (textWidth(currentLine + word) < boxWidth - TEXT_SIZE) {
                currentLine += word + ' ';
            } else {
                lines.push(currentLine);
                currentLine = word + ' ';
            }
        }
        lines.push(currentLine);

        // Show text
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], boxX + TEXT_SIZE / 2, boxY + 30 + i * TEXT_SIZE);
        }
    }
}

function mousePressed() {
    let planetClicked = planets.find(p => p.clicked(mouseX, mouseY));
    zoomManager.handlePlanetClick(planetClicked);
}

function mouseWheel(event) {
    // Define a constant zoom factor. 
    // Values greater than 1 will zoom in faster, smaller values will zoom in slower.
    const zoomFactor = 1.02;
    
    if (event.delta > 0) {
        zoomManager.settings.globalLevel /= zoomFactor; // Zoom out
    } else {
        zoomManager.settings.globalLevel *= zoomFactor; // Zoom in
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
