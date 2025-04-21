import HydraBase from "../../Base/HydraBase.js";
//import BuilderSubModule from "./BuilderSubModule.js";
import ModulesManager from "./ModulesManager.js";

export default class BuilderModule extends HydraBase {
    /**
     *
     * @type {BuilderSubModule[]}
     */
    subModules = [];


    /**
     @param {object} hydraData
     @param {string} hydraData[\@id]
     @param {object} hydraData.data
     @param {number} hydraData.id
     @param {string[]} hydraData.rocketSubModules
     @param {boolean} isNewModule
     @returns {BuilderModule}
     */
    constructor(hydraData, isNewModule = true) {
        super(hydraData, isNewModule);
        this.subModules = hydraData.rocketSubModules;
    }

    save() {
        super.save();
        if (this.wasUpdated) {
            if (ModulesManager.saveModule(this)) {
                this.wasUpdated = false;
            } else {
                console.log('module was not saved');}
        } else {
            console.log('module was not updated');
        }
        return this;
    }

    /**
     *
     * @returns {BuilderSubModule[]}
     */
    getSubModules() {
        //return ModulesManager.getMotionScriptSubModules(this);
        return this.subModules;
    }

    getDependentData(data) {
        data = super.getDependentData(data);
        let rocketSubModules = [];
        this.subModules.forEach(subModule => {
            let subModuleHydraId = subModule.getHydraId();
            if (null !== subModuleHydraId) {
                rocketSubModules.push(subModuleHydraId);
            }
        })
        return {data, rocketSubModules};
    }

    /**
     *
     * @param {string} name
     * @returns {BuilderSubModule|null}
     */
    getSubModuleByName(name) {
        return ModulesManager.getModuleSubModules(this).find(subModule => subModule.name === name) || null;
    }

    /**
     *
     * @param {BuilderSubModule} newSubModule
     * @param {boolean} isOrigin
     */
    addSubModule(newSubModule, isOrigin = true) {
        let subModuleExists = (this.subModules.find(subModule => subModule.getName() === newSubModule.getName()) || false);
        if (false === subModuleExists) {
            this.subModules.push(newSubModule);
            this.wasUpdated = true;
        }
        if (isOrigin) {
            newSubModule.addModule(this, false);
        }
    }

    deleteSubModule(subModule) {
        this.subModules = this.subModules.filter(module => module.getName() !== subModule.getName());
        this.wasUpdated = true;
    }
}

window.BuilderModule = BuilderModule;