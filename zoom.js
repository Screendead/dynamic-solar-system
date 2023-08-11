const ZOOM_SPEED = 0.001;

class ZoomManager {
    constructor() {
        this.settings = {
            target: null,
            targetLevel: 1,  // <-- New property for storing target zoom level
            level: 1,
            globalLevel: 1,
            cameraX: 0,
            cameraY: 0,
            lerpProgress: 0
        };
    }

    update() {
        this.settings.lerpProgress = constrain(this.settings.lerpProgress + ZOOM_SPEED, 0, 1);
        
        let targetCoords = this.settings.target 
            ? this.getPlanetScreenCoords(this.settings.target)
            : { x: 0, y: 0 };
        
        this.settings.cameraX = lerp(this.settings.cameraX, targetCoords.x, easeOutExpo(this.settings.lerpProgress));
        this.settings.cameraY = lerp(this.settings.cameraY, targetCoords.y, easeOutExpo(this.settings.lerpProgress));
        
        let targetZoom = this.settings.target ? this.settings.targetLevel : 1;  // <-- Use targetLevel here
        this.settings.level = lerp(this.settings.level, targetZoom, easeOutExpo(this.settings.lerpProgress));
    }

    applyTransformations() {
        translate(
            width / 2 - this.settings.cameraX * this.settings.level * this.settings.globalLevel,
            height / 2 - this.settings.cameraY * this.settings.level * this.settings.globalLevel
        );
        scale(this.settings.level * this.settings.globalLevel);
    }

    getPlanetScreenCoords(planet) {
        return {
            x: planet.distance * DISTANCE_SCALE * cos(planet.angle),
            y: planet.distance * DISTANCE_SCALE * sin(planet.angle)
        };
    }

    handlePlanetClick(planet) {
        this.settings.lerpProgress = 0;

        if (planet && this.settings.target !== planet) {
            this.settings.targetLevel = 8; // set to a constant zoom level when clicking on a planet
            this.settings.target = planet;
        } else {
            this.settings.target = null;
            this.settings.targetLevel = 1; // set to default zoom level when clicking outside
        }
    }
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
