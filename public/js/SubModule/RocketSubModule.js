import ParameteredRocket from "../Parameter/ParameteredRocket.js";
import RocketMotionBase from "../Motion/RocketMotionBase.js";
// import RocketRepresentation from "../Graphics/RocketRepresentation.js";
// import RocketParameters from "../Parameter/RocketParameters.js";

export default class RocketSubModule extends ParameteredRocket {

    /**
     *
     * @type {boolean}
     */
    debugLog = false;

    settings = {};
    /**
     * @type {RocketMotionBase}
     */
    motion;

    /**
     *
     * @param {RocketModule} module
     * @param parameters
     * @param {*} settings
     */
    constructor(module, parameters = null, settings = null) {
        super(parameters);

        this.settings = settings;
        this.module = module;
        this.initSubModule(module);
        this.initialize();
    }

    /**
     *
     * @param {RocketModule} module
     * @returns {this}
     */
    changeModule(module) {
        this.module = module;
        this.motion.setModule(module);

        return this;
    }

    /**
     *
     * @param {RocketModule} module
     * @returns {this}
     */
    initSubModule(module) {
        this.log('initSubModule', module)
        let motionClass = this.settings.motion;
            this.log('motionClass', motionClass)
        this.motion = RocketMotionBase.getNewMotion(module, motionClass, this.getParameters());


        this.log('--------- Init --------');
        this.log(this.settings)

        for(const [setting, value] of Object.entries(this.settings)) {
            // ignore 'motions' settings
            if (setting === 'motion') {
                continue;
            }

            if (!this.motion.hasOwnProperty(setting)) {
                if (typeof value === 'function') {
                    this.motion.addFuncVariable(setting, value);
                } else {
                    this.motion.addVariable(setting);
                }
            }

            this.log('setting', setting, value)
            //this.motion[setting](value);
            if (typeof value !== 'function') {
                this.motion[setting](value);
            }

        }

        //this.motion.initialize();
        this.initSettings();
        this.log('-------------------------------------');

        return this;
    }

    getLastData() {
        return this.motion.getLastData();
    }

    initialize() {
        this.motion.initialize();

        return this;
    }

    /**
     *
     * @returns {this}
     */
    initSettings() {
        this.motion.initSettings();

        return this;
    }

    /**
     *
     * @returns {this}
     */
    setModuleRunning() {
        this.motion.running(true);

        return this;
    }

    /**
     *
     * @returns boolean
     */
    isRunning() {
        return this.motion.running();
    }

    isEnginePropelling() {
        return this.motion.isEnginePropelling();
    }

    /**
     *
     * @returns {RocketSubModule}
     */
    updateVariants() {
        this.motion.updateVariants();

        return this;
    }

    /**
     *
     * @returns boolean
     */
    updateCalculations(isLastElementOfModule = false) {
        let continueUpdate = this.motion.updateCalculations(isLastElementOfModule);
        if (!continueUpdate) {
            this.log('stopping motion', this.name())
            this.motion.running(false);
        }
        return continueUpdate;
    }

    /**
     *
     * @returns {string}
     */
    name() {
        return this.motion.name();
    }

    /**
     *
     * @param {RocketRepresentation} view
     * @param {boolean} isMainModuleLastModule
     * @returns {this}
     */
    draw(view, isMainModuleLastModule = true) {
        view.draw(this.motion, isMainModuleLastModule);

        return this;
    }

    /**
     *
     * @param {string} method
     * @returns []
     */
    data(method) {
        return this.motion.data(method);
    }

    /**
     *
     * @returns {RocketMotionMethods}
     */
    getMethods() {
        return this.motion.getMethods();
    }

}

window.RocketSubModule = RocketSubModule;