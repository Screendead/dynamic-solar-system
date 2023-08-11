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
    zoomManager.update();
    zoomManager.applyTransformations();
    updateAndDisplayPlanets();
}

function initializeSolarSystem() {
    for (let name in planetData) {
        const data = planetData[name];
        planets.push(new Planet(name, data.radius, data.distance, data.orbitSpeed, color(...data.color)));
    }
}

function updateAndDisplayPlanets() {
    for (let p of planets) {
        p.displayOrbit();
        p.orbit();
        p.show(0, 0);
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
