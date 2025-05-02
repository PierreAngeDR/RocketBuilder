import RocketMotionStageExtended from "../Motion/RocketMotionStageExtended.js";
import MotionVector from "../Vector/MotionVector.js";
import DegreeUtils from "../Utils/DegreeUtils.js";


/**
 * 2D Class.
 * Added a "elevationAngle" variable to change start 2D
 */

export default class RocketMotion2D extends RocketMotionStageExtended {

    setVectorModel() {
        this.vectorModel = MotionVector.getModelType("2D");
        return this;
    }
    /**
     *
     * @returns {RocketMotion2D}
     */
    addInternalVariables() {
        super.addInternalVariables();
        // Create variables not present in settings
        /**
         * @var {RocketParameters} self._internals
         */
        this._internals
            .addFuncVariable(this,
                            'elevationAngle',               // Elevation Angle variable
                            this.defineElevationAngle(
                                DegreeUtils.degreeToRadian(90),  // Elevation Angle is 90° at beginning
                                DegreeUtils.degreeToRadian(70),  // The rocket will be elevated at a 70° angle
                                20,                      // Elevation will last 20 seconds
                                4000))                     // Elevation will begin when rocket reaches 4000m alttude

        return this;
    }

    defineElevationAngle(initialElevationAngle = Math.PI/2, maxElevationAngle = 0, elevationDuration = 0, altitudeToStart = 0) {
        let locals = this.locals();
        locals.elevationAngleOrigin = initialElevationAngle;
        locals.elevationAngleCurrentValue = initialElevationAngle;
        locals.elevationAngleMax = maxElevationAngle;
        locals.elevationAngleGradient = initialElevationAngle - maxElevationAngle;
        locals.elevationAngleChangeStartAltitude = altitudeToStart;
        locals.elevationAngleLastCalculationTime = this.t();

        let nbSteps = elevationDuration/this.commonParameters.getDt();
        let dElevationAngle = locals.elevationAngleGradient/nbSteps;
        locals.elevationAngleNbSteps = nbSteps;
        this.locals(locals);

        return function(){
            let locals = this.locals();
                    if (locals.elevationAngleLastCalculationTime===this.t()) {
                        return locals.elevationAngleCurrentValue;
                    }
                    locals.elevationAngleLastCalculationTime = this.t();

                    if ((this.h() <= locals.elevationAngleChangeStartAltitude) && (locals.elevationAngleNbSteps>0)) {
                        return locals.elevationAngleCurrentValue;
                    }

                    if (locals.elevationAngleNbSteps>0)  {
                        locals.elevationAngleNbSteps--;
                        locals.elevationAngleCurrentValue = locals.elevationAngleCurrentValue - dElevationAngle;
                        this.locals(locals);
                    }

                    return locals.elevationAngleCurrentValue;
            };
    }

    /**
     * Override the calculateDirectionVector method
     * This method is 'nearly' ready for 3D because the only thing we need to change, is
     * how we handle azimutAngle.
     * This can be done by extending the class and add an internal azimutAngle funcVariable.
     * Then, just replace Math.cos(azimutAngle) and Math.sin(azimutAngle) by
     *                  Math.cos(this.azimutAngle()) and Math.sin(this.azimutAngle())
     *
     * @returns {MotionVector}
     */
    calculateDirectionVector() {
        console.log('calculateDirectionVector', this.elevationAngle());
        let azimutAngle = 0;

        const directionVector = {
            x: Math.cos(this.elevationAngle()) * Math.cos(azimutAngle),
            y: Math.cos(this.elevationAngle()) * Math.sin(azimutAngle),
            z: Math.sin(this.elevationAngle())
        };

        return MotionVector.new(this.getVectorModel(), directionVector.x, directionVector.y, directionVector.z);
    }

}

window.RocketMotion2D = RocketMotion2D;