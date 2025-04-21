import ParameteredRocket from '../Parameter/ParameteredRocket.js';
import RocketModuleSpecifications from '../Module/RocketModuleSpecifications.js';
import RocketPhysics from '../Physics/RocketPhysics.js';

export default class RocketMotionBase extends ParameteredRocket {
    static defaultAltitude = 0;
    static defaultOffset = 0;
    static defaultHeight = 40;
    static defaultDiameter = 2;
    static defaultPosition = 'central';

    /**
     *
     * @type {boolean}
     */
    debugLog = false;

    /**
     *
     * @type {string}
     */
    uuid = '';

    /**
     *
     * @type {RocketMotionMethods}
     */
    methods = null;

    /**
     * @type {RocketModule}
     */
    module;

    /**
     *
     * @type {boolean}
     */
    areSharedVariablesLoaded = false;

    /**
     * @type {RocketPhysics}
     */
    physics;

    /**
     *
     * @param {RocketModule} module
     * @param parameters
     */
    constructor(module, parameters = null) {
        super(parameters, '_internals');

        this.uuid = self.crypto.randomUUID();

        this._shares = {};

        this.initPhysics()
            .setModule(module)
            .addInternalVariables()
            .initMethods()
            .addInternalMethods();

        //this.loadSharedVariables();
    }

    /**
     *
     * @returns {RocketMotionBase}
     */
    initPhysics() {
        this.physics = new RocketPhysics('standard');

        return this;
    }

    /**
     *
     * @returns {RocketMotionBase}
     */
    addInternalVariables() {
        // Create variables not present in settings
        /**
         * @var {RocketParameters} self._internals
         */
        this._internals
            .addVariable('v',0)           // Vitesse
            .addVariable('h',0)           // Altitude
            .addVariable('t',0)           // Temps
            .addVariable('m',0)           // Masse Totale
            .addVariable('specifications')
            .addVariable('running')
            .addVariable('representation')
            .addVariable('enginePropellingStartTime', 0)
            .addVariable('enginePropellingDuration', Infinity)
            .addVariable('isLastElementOfModule', false)
            .addVariable('moduleGetters', [])
        ;

        return this;
    }

    /**
     *
     * @returns {RocketMotionBase}
     */
    addInternalMethods() {
        // Create Values Storing Method's values arrays

        this.getMethods().forEach(method => {
            /**
             * @var {RocketMotionMethod} method
             */
            this._internals.addVariable(method.name(), []);
        });

        return this;
    }

    loadSharedVariables() {
        if (this.areSharedVariablesLoaded === true) {
            return;
        }

        this.areSharedVariablesLoaded = true;

        this.doLoadSharedVariables();
        return this;
    }

    doLoadSharedVariables() {
        return this;
    }
    sharedFunction(func) {
        return func.bind(this);
    }

    addSharedFunction(name, func) {
        this._shares[name] = func.bind(this);
    }

    /**
     *
     * @returns {RocketMotionBase}
     */
    initMethods() {
        return this;
    }

    /**
     *
     * @param {string} name
     * @param {Function} sharedGetFunction
     * @param {any} initialValue
     * @returns {this}
     */
    addSharedVariable(name, sharedGetFunction, initialValue) {
        this._internals.addSharedVariable(name, sharedGetFunction.bind(this), 0);

        if (typeof initialValue === 'function') {
            this[name](this[name]() + initialValue.apply(this));
        } else {
            this[name](this[name]() + initialValue);
        }

        return this;
    }
    addSharedVariable2(name, sharedGetFunction) {
        this._internals.addSharedVariable(name, sharedGetFunction.bind(this));

        return this;
    }

    all() {
        return this.getModule().subModules.map(subModule => subModule.motion);
    }

    others() {
        return this.getModule().subModules
                    .filter(subModule =>subModule.motion.uuid !== this.uuid)
                    .map(subModule => subModule.motion);
    }

    /**
     *
     * @returns {RocketMotionMethods}
     */
    getMethods() {
        if (null === this.methods) {
            throw new Error('Methods not defined for RocketMotion object');
        }
        return this.methods;
    }

    /**
     * get stored array with name method
     * @param method
     * @returns {*}
     */
    data(method) {
        //console.log('data', method, this)
        if (!this.hasOwnProperty(method)) {
            throw new Error('Method ' + method + ' not found');
        }
        return this[method]();
    }

    saveLastData(method, data) {
        this.data(method).push(data);
        this.lastData = data;
        return this;
    }

    getLastData() {
        return this.lastData;
    }

    isEnginePropelling() {
        return (this.enginePropellingStartTime() <= this.t())
            && (this.enginePropellingStartTime() + this.enginePropellingDuration() >= this.t())
            && (this.mc()>0);
    }

    hasExposedFrontSection() {
        let position = this.getDimensions().position;
        let altitude = this.getDimensions().altitude;
        return this.all().every(motion => {
            let dimensions = motion.getDimensions();
            return  (dimensions.position !== position) ? true : (dimensions.altitude <= altitude);
        })
    }


    /**
     *
     * @returns {RocketModule}
     */
    getModule() {
        //console.log(this)
        return this.module;
    }

    /**
     *
     * @param {RocketModule} module
     * @returns {this}
     */
    setModule(module) {
        this.module = module;

        return this;
    }

    /**
     *
     * @param {RocketModule} module
     * @param {RocketMotionBase} motionClass
     * @param parameters
     * @returns {RocketMotionBase}
     */
    static getNewMotion(module, motionClass, parameters = null) {
        return new motionClass(module, parameters);
    }

    /**
     *
     * @returns {this}
     */
    initSettings() {
        this.log('initSettings for '+this.name(), this)
        // this.v(0);
        // this.h(0);
        // this.t(0);
        this.m(this.m0() + this.mc());
        if (!(this.specifications() instanceof RocketModuleSpecifications)) {
            this.specifications(new RocketModuleSpecifications(this.getDimensions()));
        }
        this.running(false);

        this.loadSharedVariables();

        return this;
    }

    /**
     * @returns {this}
     */
    initialize() {
        this.initSettings();

        return this;
    }






    /**
     *
     * @returns {*|{altitude: number, offset: number, height: number, diameter: number, position: string}}
     */
    getDimensions() {
        return this.hasOwnProperty('dimensions') && (typeof this.dimensions === 'function') ?
                    this.dimensions()
                :
                    this.dimensions = {
                                        altitude: RocketMotionBase.defaultAltitude,     // altitude du module quand la fusée est au sol
                                        offset: RocketMotionBase.defaultOffset,         // offset par rapport au module central. Valide quand position = left, right, front ou rear
                                        height: RocketMotionBase.defaultHeight,         // hauteur du module
                                        diameter: RocketMotionBase.defaultDiameter,     // diamètre du module
                                        position: RocketMotionBase.defaultPosition      // 5 choix possibles: central, left, right, front, rear
                                    }
    }

    /**
     * Here, you define in your motion class the variation of your variables (example, mass depending on time)
     *
     * @returns {RocketMotionBase}
     */
    updateVariants() {
        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    updateCalculations(isLastElementOfModule = false) {
        this.isLastElementOfModule(isLastElementOfModule);
        return this.processCalculations();
    }

    /**
     * This method should be overridden by each new RocketMotionXxxx Class
     * @returns {boolean}
     */
    processCalculations() {
         return false;
    }

    calculateGravitationForce() {
        return this.calculateGravity()*this.m();
    }

    calculateGravity() {
        return this.physics.gValue(this.h());
    }

    calculateRho() {
        return this.physics.rhoValue(this.h());
    }

}

window.RocketMotionBase = RocketMotionBase;