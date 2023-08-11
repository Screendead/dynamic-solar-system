const RADIUS_SCALE = 1 / 100000;
const DISTANCE_SCALE = 1 / 1000000;

class Planet {
    constructor(name, radius, distance, orbitSpeed, col) {
        this.name = name;
        this.radius = radius;
        this.angle = random(TWO_PI);
        this.distance = distance;
        this.orbitSpeed = orbitSpeed; 
        this.col = col;
    }
    
    orbit() {
        this.angle += this.orbitSpeed;
    }

    show(x = 0, y = 0) {
        noStroke();
        fill(this.col);
        let screenCoords = this.getScreenCoords(x, y);
        ellipse(screenCoords.x, screenCoords.y, this.radius * 2 * RADIUS_SCALE);

        // Display click area
        stroke(255);
        noFill();
        ellipse(screenCoords.x, screenCoords.y, this.radius * 2 * RADIUS_SCALE + 20);
        
        // Display planet name
        fill(255);
        noStroke();
        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.name, screenCoords.x, screenCoords.y + 16 + this.radius * RADIUS_SCALE);
    }

    displayOrbit() {
        noFill();
        stroke(100, 100, 150); 
        strokeWeight(1 / zoomManager.settings.level / zoomManager.settings.globalLevel);
        ellipse(0, 0, this.distance * DISTANCE_SCALE * 2);
    }

    clicked(mx, my) {
        let worldX = (mx - width / 2) / (zoomManager.settings.level * zoomManager.settings.globalLevel) + zoomManager.settings.cameraX;
        let worldY = (my - height / 2) / (zoomManager.settings.level * zoomManager.settings.globalLevel) + zoomManager.settings.cameraY;

        let planetCoords = this.getScreenCoords(0, 0);

        return dist(worldX, worldY, planetCoords.x, planetCoords.y) < this.radius * RADIUS_SCALE + 10;
    }

    getScreenCoords(x, y) {
        const result = {
            x: x + this.distance * DISTANCE_SCALE * cos(this.angle),
            y: y + this.distance * DISTANCE_SCALE * sin(this.angle)
        };
        return result;
    }
}
