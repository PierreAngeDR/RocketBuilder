import HydraBase from "../../Base/HydraBase.js";
import MotionScriptsManager from "./MotionScriptsManager.js";
import ModulesManager from "../ModelBuilder/ModulesManager.js";
import BuilderSubModule from "../ModelBuilder/BuilderSubModule.js";

export default class BuilderMotionScript extends HydraBase {
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

    getScript() {
        return this.data.script || '// Type your script here';
    }

    setScript(script) {
        this.data.script = script;
        this.wasUpdated = true;
    }

    getInternalId() {
        if (typeof this.data.internalId === 'undefined') {
            this.data.internalId = Math.random().toString(36).substr(2, 9);
            this.wasUpdated = true;
        }
        return this.data.internalId;
    }

    getSubModulesNames() {
        return this.subModules.map(subModule => subModule.getName());
    }

    save() {
        super.save();
        if (this.wasUpdated) {
            if (MotionScriptsManager.saveMotionScript(this)) {
                this.wasUpdated = false;
            } else {
                console.log('MotionScript was not saved');}
        } else {
            console.log('MotionScript was not updated');
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
            newSubModule.addMotionScript(this, false);
        }
    }

}

window.BuilderMotionScript = BuilderMotionScript;