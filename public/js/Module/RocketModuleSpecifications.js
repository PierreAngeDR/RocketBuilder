import RocketMotionBase from "../Motion/RocketMotionBase.js";

export default class RocketModuleSpecifications {
    dimensions;
    constructor(dimensions) {
        this.dimensions = dimensions;
    }

    testAndWarnUnknownValue(key, defaultValue) {
        if (this.dimensions[key] === undefined) {
            console.warn(`Unknown value for ${key} : ${this.dimensions[key]}. Using default value : ${defaultValue}`);
            return defaultValue;
        }

        return this.dimensions[key];
    }

    getAltitude() {
        return this.testAndWarnUnknownValue('altitude', RocketMotionBase.defaultAltitude);
    }

    getDiameter() {
        return this.testAndWarnUnknownValue('diameter', RocketMotionBase.defaultDiameter);
    }

    /**
     * Get front section of rocket. We assume this is half a sphere.
     *
     * TODO : update the way it works because here. This doesn't take account of a top level module front section.
     * @returns {number}
     */
    getFrontSection() {
        return this.getDiameter()*Math.PI;
    }

    getHeight() {
        return this.testAndWarnUnknownValue('height', RocketMotionBase.defaultHeight);
        return this.dimensions.height;
    }

    getOffset() {
        return Math.abs(this.dimensions.offset??RocketMotionBase.defaultOffset);
    }

    /**
     * TODO = implement solution for position front & rear
     * @returns {number}
     */
    getPosition() {
        switch (this.testAndWarnUnknownValue('position', RocketMotionBase.defaultHeight)) {
            case 'central': return 0;
            case 'left': return -this.getOffset()*2;
            case 'right': return this.getOffset()*2;
            default: return 0;
        }
    }
}

window.RocketModuleSpecifications = RocketModuleSpecifications;