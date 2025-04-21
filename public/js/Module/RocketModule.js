// import RocketBase from "../Rocket/RocketBase.js";
// import RocketMotionBase from "../Motion/RocketMotionBase.js";
import ParameteredRocket from "../Parameter/ParameteredRocket.js";
import RocketSubModule from "../SubModule/RocketSubModule.js";
// import Rocket from "../Rocket.js";
// import RocketRepresentation from "../Graphics/RocketRepresentation.js";
import RocketParameters from "../Parameter/RocketParameters.js";

/**
 * A BuilderModule is an association of Rocket Sub Modules.
 * A Sub BuilderModule can be a stage, a propeller, etc.
 * A Sub BuilderModule has a RocketMotion and dimensions
 * A Sub BuilderModule also has an indicator that can vary depending on parameters that says if it is active/inactive/detached.
 * When detached, the Sub BuilderModule is then reaffected to a new standalone RocketModule
 */
export default class RocketModule extends ParameteredRocket {

    /**
     *
     * @type {boolean}
     */
    debugLog = false;

    /**
     * @type {Rocket}
     */
    rocket;
    /**
     *
     * @type {RocketSubModule[]}
     */
    subModules = [];

    internalCounter = 0

    sourceParameters = null;

    /**
     *
     * @param {Rocket} rocket
     * @param parameters
     */
    constructor(rocket, parameters = null) {
        super(parameters);
        this.sourceParameters = parameters;

        // TODO : rollback to this._internals = new RocketParameters().attachTo(this, true); and test
        this._internals = new RocketParameters().attachTo(this, true);
        //this._internals = new RocketParameters().attachTo(this, false);
        this.rocket = rocket;

        this.log('RocketModule created')
    }

    addSubModule(settings) {
        this.subModules.push(new RocketSubModule(this, this.getParameters(), settings));

        return this;
    }

    // initialize() {
    //      this.subModules.forEach(subModule => {
    //          subModule.initialize();
    //      });
    //
    //     return this;
    // }

    initSettings() {
        this.subModules.forEach(subModule => {
            subModule.initSettings();
        });

        return this;
    }

    setModuleRunning() {
        this.subModules.forEach(subModule => {
            subModule.setModuleRunning();
        });

        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    isModulesRunning() {
        return this.subModules.some(subModule=>subModule.isRunning())
    }

    lastModule() {
        return this.subModules[this.subModules.length-1];
    }

    isLastModule(subModuleIndex) {
        return (subModuleIndex === this.subModules.length-1);
    }

    /**
     *
     * @returns {boolean}
     */
    update() {
        this.internalCounter++;
        let continueUpdate = true;
        this.log('---------------------------------------------------------------', this.subModules.length)
        // First, update each module's parameters
        this.subModules.forEach((subModule, index) => {
            this.log('--- Update SubModule', index)
            subModule.updateVariants();
        });

        // Then rocket calculations for the last submodule. The calculations will be affected to all submodules. This saves time.
        continueUpdate = this.lastModule().updateCalculations(true);

        // Then check if subModules can be separated

        let subModulesToDetach = []
        this.subModules.forEach((subModule, index) => {
            if (!this.isLastModule(index)&&!subModule.isEnginePropelling()) {
                subModulesToDetach.push(subModule);
            }
        });
        subModulesToDetach.forEach(subModule => {
            this.separateModule(subModule.name());
        })

        //return (this.internalCounter<20);

        return continueUpdate;
    }

    getLastData(varName = null) {
        if (null !== varName) {
            let lastData = this.lastModule().getLastData();
            if (lastData.hasOwnProperty(varName)) {
                return lastData[varName];
            }
            this.warn(`Variable "${varName}" not found in last module data. Last module data: ${JSON.stringify(lastData, null, 2)}`)
            return null;
        }

        return this.lastModule().getLastData();
    }

    /**
     *
     * @param {RocketRepresentation} view
     * @param {boolean} isMainModule
     * @returns {this}
     */
    draw(view, isMainModule) {
        // First Draw Last SubModule (important for autoScale)
        this.subModules.forEach((subModule, index) => {
            this.isLastModule(index) && subModule.draw(view, isMainModule );
        });
        // Then draw other SubModules
        this.subModules.forEach((subModule, index) => {
            !this.isLastModule(index) && subModule.draw(view, false );
        });

        return this;
    }

    /**
     *
     * @returns {RocketSubModule}
     */
    getUpperModule() {
        let upperSubModule = null;
        this.subModules.forEach((subModule, index) => {
            if (index+1 === this.subModules.length) {
                upperSubModule = subModule;
            }
        })

        if (null === upperSubModule) {
            throw new Error('No upper module found');
        }

        return upperSubModule;
    }

    /**
     *
     * @param {string} method
     * @returns {[]}
     */
    data(method) {
        return this.getUpperModule().data(method);
    }

    /**
     *
     * @returns {RocketMotionMethods}
     */
    getMethods() {
        return this.getUpperModule().getMethods();
    }

    /**
     *
     * @param {string} name
     * @returns {number}
     */
    findSubModuleIndex(name) {
        let moduleIndex = -1;
        this.subModules.forEach((subModule, index) => {
            if (subModule.name() === name) {
                moduleIndex = index;
            }
        });

        return moduleIndex;
    }

    /**
     *
     * @param {string} subModuleName
     * @returns {this}
     */
    separateModule(subModuleName) {

        if (subModuleName==='Falcon 9 Stage 1') {
            //mook()
        }

        let moduleIndex = this.findSubModuleIndex(subModuleName);
        let subModule = this.subModules.splice(moduleIndex, 1)[0];
        //let newMotionScript = new RocketModule(this.rocket, this.getParameters());
        let newModule = new RocketModule(this.rocket, this.sourceParameters);

        this.log('separateModule', subModule, subModule.name())
        subModule.changeModule(newModule);
        newModule.subModules = [subModule];
        this.rocket.addModule(newModule);

        return this;
    }
}

window.RocketModule = RocketModule;