import RocketBase from "../Rocket/RocketBase.js";

export default class RepresentationCanvas extends RocketBase {

    /**
     * Enable logging.
     * @type {boolean}
     */
    debugLog = false;

    canvas;
    ctx;
    cloneCounter = 0;
    constructor(parameters, id) {
        super(parameters);
        this.canvas = document.getElementById(id);
        this.canvas.width = this.getWidth();
        this.canvas.height = this.getHeight();
        this.ctx = this.canvas.getContext("2d");
    }

    getContext() {
        return this.ctx;
    }

    getCanvas() {
        return this.canvas;
    }

    getWidth() {
        return this.commonParameters.getRepresentationCanvasWidth();
    }

    getHeight() {
        return this.commonParameters.getRepresentationCanvasHeight();
    }

    clone() {
        let newCanvas = this.canvas.cloneNode(true);
        newCanvas.id = this.canvas.id + '-clone-'+(this.cloneCounter++);
        newCanvas.classList.add('clone');
        this.canvas.after(newCanvas);
        this.log('Cloning Canvas')

        //return new RepresentationCanvas(this.commonParameters, this.canvas.id, this.getWidth(), this.getHeight());
        return new RepresentationCanvas(this.commonParameters, newCanvas.id, this.getWidth(), this.getHeight());
    }

    static getClones(mainClass = '') {
        return document.getElementsByClassName(mainClass + ' clone');
    }

}

window.RepresentationCanvas = RepresentationCanvas;