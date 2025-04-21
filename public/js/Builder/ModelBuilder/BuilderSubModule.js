import HydraBase from "../../Base/HydraBase.js";
//import BuilderModule from "./BuilderModule.js";
import BuilderMotionScript from "../MotionEditor/BuilderMotionScript.js";
import ModulesManager from "./ModulesManager.js";
export default class BuilderSubModule extends HydraBase {
    /**
     *
     * @type {BuilderModule[]}
     */
    modules = [];
    /**
     *
     * @type {BuilderMotionScript[]}
     */
    motionScripts = [];

    /**
     *
     * @param {object} hydraData
     * @param {string} hydraData[\@id]
     * @param {object} hydraData.data
     * @param {number} hydraData.id
     * @param {string[]} hydraData.rocketModules
     * @param {string[]} hydraData.rocketMotionScripts
     * @param {boolean} isNewSubModule
     * @returns {BuilderSubModule}
     */
    constructor(hydraData, isNewSubModule = true) {
        super(hydraData, isNewSubModule);
        this.modules = hydraData.rocketModules;
        this.motionScripts = hydraData.rocketMotionScripts;
    }

    async save() {
        await super.save();
        if (this.wasUpdated) {
            if (await ModulesManager.saveSubModule(this)) {
                this.wasUpdated = false;
            } else {
                console.log('subModule was not updated');
            }
        } else {
            console.log('subModule was not updated');
        }
        return this;
    }

    getDependentData(data) {
        data = super.getDependentData(data);
        let rocketModules = [];
        let rocketMotionScripts = [];
        this.modules.forEach(module => {
            let moduleHydraId = module.getHydraId();
            if (null !== moduleHydraId) {
                rocketModules.push(moduleHydraId);
            }
        })

        if (this.motionScripts.length > 0) {
            console.log('getDependentData', this.motionScripts)
            this.motionScripts.forEach(motionScript => {
                let motionScriptHydraId = motionScript.getHydraId();
                console.log('motionScriptHydraId', motionScriptHydraId);
                if (null !== motionScriptHydraId) {
                    rocketMotionScripts.push(motionScriptHydraId);
                }
            })
        }

        return {data, rocketModules, rocketMotionScripts};
    }

    /**
     *
     * @returns {BuilderModule[]}
     */
    getModules() {
        //return ModulesManager.getSubModuleModules(this);
        return this.modules;
    }

    /**
     *
     * @returns {BuilderMotionScript[]}
     */
    getMotionScripts() {
        //return ModulesManager.getSubModuleModules(this);
        return this.motionScripts;
    }

    /**
     *
     * @param {BuilderModule} newModule
     * @param {boolean} isOrigin
     */
    addModule(newModule, isOrigin = true) {
        let moduleExists = (this.modules.find(module => module.getName() === newModule.getName()) || false);
        if (false === moduleExists) {
            this.modules.push(newModule);
            this.wasUpdated = true;
        }
        if (isOrigin) {
            newModule.addSubModule(this, false);
        }
    }

    /**
     *
     * @param {BuilderMotionScript} newMotionScript
     * @param {boolean} isOrigin
     */
    addMotionScript(newMotionScript, isOrigin = true) {
        let motionScriptExists = (this.motionScripts.find(motionScript => motionScript.getName() === newMotionScript.getName()) || false);
        if (false === motionScriptExists) {
            this.motionScripts = [newMotionScript];
            this.wasUpdated = true;
        }
        if (isOrigin) {
            newMotionScript.addSubModule(this, false);
        }
    }
}

window.BuilderSubModule = BuilderSubModule;