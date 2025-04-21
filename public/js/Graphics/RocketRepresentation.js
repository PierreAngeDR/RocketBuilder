import RocketBase from '../Rocket/RocketBase.js';
import RepresentationCanvas from './RepresentationCanvas.js';
//import RocketMotionBase from '../Motion/RocketMotionBase.js';

export default class RocketRepresentation extends RocketBase {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;

    /**
     * @type {RepresentationCanvas}
     */
    canvas;
    ctx;
    scale;
    scaleId;
    scaleFactor;
    widthHeightScaleFactor = 5;
    autoScaleValue = 1;

    constructor(parameters = null,  scale = 2, scaleFactor = 2) {
        super(parameters);
        this.canvas = new RepresentationCanvas(this.commonParameters, "background-motion-canvas");
        this.log('Creating ', this.canvas)
        this.scaleFactor = scaleFactor;
        this.commonParameters.addStoredVariable('scale', scale, ()=>this.updateScale(this.commonParameters.getScale()));


        
    }

    autoScale() {
        return this.getParameters().getAutoScale();
    }

    clear() {
        let clones = RepresentationCanvas.getClones('motion-canvas');
        for(let i=0; i<clones.length; i++) {
            clones[i].style.display = "none";;
        }
    }

    /**
     *
     * @param {string} id
     * @returns {this}
     */
    configureScale(id) {
        this.scaleId = id;
        this.updateScale(this.commonParameters.getScale())
        return this;
    }

    /**
     *
     * @param {RocketMotionBase} motion
     * @param {boolean} isMainModuleLastModule
     */
    draw(motion, isMainModuleLastModule = true) {
        this.log('draw', motion.name(), motion.specifications());
        this.setMotionRepresentation(motion);

        this.drawRepresentation(motion, isMainModuleLastModule);
        isMainModuleLastModule && this.updateDocumentText([
                                                                {name : 'time', value : motion.t()},
                                                                {name : 'velocity', value : motion.v()},
                                                                {name : 'altitude', value : motion.h()},
                                                                {name : 'mass', value : motion.m()},
                                                            ]);

        return this;
    }

    /**
     *
     * @param {RocketMotionBase} motion
     * @param {boolean} recalculateAutoScale
     */
    drawRepresentation(motion, recalculateAutoScale = false) {
        /**
         * @var {RepresentationCanvas} representation
         */
        let representation = motion.representation();
        /**
         * @var {RocketModuleSpecifications}
         */
        let specifications = motion.specifications();
        let ctx = representation.getContext();
        let canvasWidth = representation.getWidth();
        let canvasHeight = representation.getHeight();
        let color = this.commonParameters.getIntegrationMethod().color ?? 'white';
        let scale = this.commonParameters.getScale();

        this.log('Canvas width/height', canvasWidth, canvasHeight)
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = color;
        //ctx.fillRect(canvasWidth / 2 - 10, canvasHeight - 50 - motion.h() / this.commonParameters.getScale(), 20, 50);
        ctx.fillRect(
            this.getX(canvasWidth, specifications.getDiameter(), specifications.getPosition(), this.widthHeightScaleFactor),
            this.getY(canvasHeight, specifications.getHeight(), specifications.getAltitude(), motion.h(), scale, recalculateAutoScale),
            specifications.getDiameter()*this.widthHeightScaleFactor,
            specifications.getHeight()
        );

    }

    /**
     *
     * @param {number} canvasWidth
     * @param {number} moduleWidth
     * @param {number} offset
     * @param {number} scale
     * @returns {number}
     */
    getX(canvasWidth, moduleWidth, offset, scale=1) {
        let center = (canvasWidth - moduleWidth*scale) / 2 ;
        return center + offset*scale;
    }


    /**
     *
     * @param {number} canvasHeight
     * @param {number} moduleHeight
     * @param {number} offset
     * @param {number} altitude
     * @param {number} scale
     * @param {boolean} recalculateAutoScale
     * @returns {number}
     */
    getY(canvasHeight, moduleHeight, offset, altitude, scale, recalculateAutoScale) {
        if (!this.autoScale()) {
            return canvasHeight - moduleHeight - offset - altitude/scale;
        }

        if (recalculateAutoScale) {
            this.calculateAutoScale(canvasHeight, moduleHeight, offset, altitude);
        }

        return canvasHeight - moduleHeight - offset - altitude/this.autoScaleValue;
    }

    /**
     *
     * @param {number} canvasHeight
     * @param {number} moduleHeight
     * @param {number} offset
     * @param {number} altitude
     * @returns {RocketRepresentation}
     */
    calculateAutoScale(canvasHeight, moduleHeight, offset, altitude) {
        let topModuleAltitude = altitude+offset+moduleHeight;
        this.autoScaleValue = topModuleAltitude / (canvasHeight/1.3);

        // if (this.autoScaleValue > 10000) {
        //     this.autoScaleValue = (Math.floor(this.autoScaleValue/1000)+1) *1000 ;
        // } else {
        //     if (this.autoScaleValue > 1000) {
        //         this.autoScaleValue = (Math.floor(this.autoScaleValue/1000)+1) *1000 ;
        //     } else {
        //         if (this.autoScaleValue > 100) {
        //             this.autoScaleValue = (Math.floor(this.autoScaleValue/100)+1) *100 ;
        //         } else {
        //             if (this.autoScaleValue > 10) {
        //                 this.autoScaleValue = (Math.floor(this.autoScaleValue/10)+1) *10 ;
        //             }
        //         }
        //     }
        // }

        //console.log('autoScaleValue', this.autoScaleValue)

        return this;
    }

    /**
     * @param {RocketMotionBase} motion
     * @returns {this}
     */
    setMotionRepresentation(motion) {
        if (typeof motion.representation() === 'undefined') {
            //alert('cloning')
            motion.representation(this.canvas.clone());
        }

        return this;
    }

    /**
     *
     * @param {{name, value}[]}variables
     * @returns {this}
     */
    updateDocumentText(variables) {
        variables.forEach(function(variable){
            document.getElementById(variable.name).innerText = variable.value.toFixed(1);
        });

        return this;
    }

    /**
     *
     * @param {number} newScale
     * @returns {this}
     */
    updateScale(newScale) {
        if (typeof newScale !== 'undefined') {
            this.commonParameters.setScale(newScale);
        }

        if (this.scaleId) {
            document.getElementById(this.scaleId).innerText = this.commonParameters.getScale();
        }
        return this;
    }

    /**
     *
     * @returns {this}
     */
    zoomIn() {
        return this.updateScale(this.commonParameters.getScale() * this.scaleFactor);
    }

    /**
     *
     * @returns {this}
     */
    zoomOut() {
        return this.updateScale(this.commonParameters.getScale() / this.scaleFactor);
    }
}

window.RocketRepresentation = RocketRepresentation;