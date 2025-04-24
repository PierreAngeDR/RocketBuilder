import Base from '../Base/Base.js';

export default class RocketPhysics extends Base {

    /**
     * Enable logging.
     * @type {boolean}
     */
    debugLog = false;

    /**
     * Used calculation model. Can be 'standard' or 'realistic'
     * 'standard' will use a simplified version for calculations
     * 'realistic' will use real calculations based on height, speed, etc.
     * @type {string}
     */
    model = 'standard';

    defaultModel = 'standard';

    /**
     * Gravitational Constant
     * @type {number}
     */
    gravitationalConstant= 6.67408e-11;

    /**
     * Earth Mass (Kg)
     * @type {number}
     */
    earthMass = 5.972e24;
    /**
     * Earth Radius (m)
     * @type {number}
     */
    earthRadius = 6.371e6;

    /**
     * @type {number}
     */
    GM = this.gravitationalConstant * this.earthMass;

    /**
     * simplified version of g, Gravitation (N/kg)
     * @type {number}
     */
    simplifiedG = 9.81;

    /**
     * simplified version of rho (Air density) kg/m^3
     * @type {number}
     */
    rho0 = 1.225;

    constructor(model = 'standard') {
        super();
        this.changeModel(model);
    }

    /**
     * Changes the current physics model to the specified model if it is supported.
     * If the specified model is not supported, it defaults to the predefined model.
     *
     * @param {string} model The desired physics model to be applied. Accepted values are 'standard' and 'realistic'.
     * @return {this} The current instance with the updated physics model.
     */
    changeModel(model) {
        if (model !== 'standard' && model !== 'realistic') {
            model = this.defaultModel;
            this.log('New Physiscs model is not supported. Using default :')
        }
        this.model = model;

        return this;
    }

    /**
     * Calculates the gravitational value based on the selected model and the given height.
     *
     * @param {number} height The height above the Earth's surface in meters.
     * @return {number} The gravitational value computed based on the model.
     */
    gValue(height) {
        switch (this.model) {
            case 'standard': return this.simplifiedG;
            case 'realistic': return this.GM/((this.earthRadius + height) ** 2);
        }
    }

    /**
     *
     * @param height
     * @returns {number}
     *
     * TODO : explore more on Rho calculation : https://www.deleze.name/marcel/sec2/applmaths/pression-altitude/masse_volumique.pdf
     */
    rhoValue(height) {
        switch (this.model) {
            case 'standard': return this.rho0;
            case 'realistic':
                let H = 8500; // Scale Height (m)
                return this.rho0 * Math.exp(-height / H);
        }
    }

}

window.RocketPhysics = RocketPhysics;