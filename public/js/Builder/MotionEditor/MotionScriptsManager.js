import BaseManager from "../../Base/BaseManager.js";
import BuilderMotionScript from "./BuilderMotionScript.js";

export default class MotionScriptsManager extends BaseManager {
    static defaultMotionScriptName = 'RocketMotion';

    /**
     *
     * @type {BuilderMotionScript[]}
     */
    static motionScripts = [];

    /**
     *
     * @type {BuilderSubModule[]}
     */
    static subModules = [];

    static debug() {
        console.log('MotionScriptsManager: ', this.motionScripts);
    }

    static getMotionScripts() {
        return this.motionScripts;
    }

    static getMotionScriptsNames() {
        return this.motionScripts.map(motionScript => motionScript.getName());
    }

    static getMotionScriptByName(name) {
        return this.motionScripts.find(motionScript => motionScript.getName() === name);
    }

    /**
     *
     * @param {string} internalId
     * @returns {BuilderMotionScript}
     */
    static getMotionScriptByInternalId(internalId) {
        return this.motionScripts.filter(motionScript => motionScript.getInternalId() === internalId)[0];
    }

    static assignScriptSubModules(isOrigin = true) {
        if ((this.motionScripts.length === 0)||(ModulesManager.subModules.length === 0)) {
            return;
        }

        this.subModules = ModulesManager.getSubModules();

        console.log('assignScriptSubModules', this.motionScripts, this.subModules);
        this.motionScripts.forEach(motionScript => {
            motionScript.subModules = this.getMotionScriptSubModules(motionScript);
        })
        this.subModules.forEach(subModule => {
            subModule.motionScripts = this.getSubModuleMotionScripts(subModule);
        })

        // if (isOrigin) {
        //     ModulesManager.assignModulesSubModules(false);
        // }
    }

    /**
     *
     * @param {BuilderMotionScript} motionScript
     * @returns {BuilderSubModule[]}
     */
    static getMotionScriptSubModules(motionScript) {
        console.log('getMotionScriptSubModules', motionScript, ...this.subModules);
        let subModules = this.subModules.filter(subModule => subModule.getMotionScripts().indexOf(motionScript.getHydraId())!==-1);
        //console.log('getMotionScriptSubModules', motionScript, subModules);
        return subModules;
    }

    /**
     *
     * @param {BuilderSubModule} subModule
     * @returns {BuilderMotionScript[]}
     */
    static getSubModuleMotionScripts(subModule) {
        return this.motionScripts.filter(motionScript => subModule.getMotionScripts().indexOf(motionScript.getHydraId())!==-1);
    }

    /**
     *
     * @param {string|null} motionScriptName
     * @returns {BuilderMotionScript}
     */
    static newMotionScript(motionScriptName = null) {
        if (null === motionScriptName) {
            motionScriptName = this.findAvailableNewElementName('motionScript');
        }
        if (this.elementWithSameNameExists(motionScriptName, 'motionScript')) {
            throw new Error('motionScript with same name exists');
        }

        let newMotionScript = new BuilderMotionScript(
            {
                data : {name : motionScriptName},
                "@id" : null,
                id : null,
                rocketSubModules : []
            })
        this.motionScripts.push(newMotionScript);

        return newMotionScript;
    }

    static loadMotionScript(motionScriptData) {
        this.motionScripts.push(new BuilderMotionScript(motionScriptData, false))
    }

    /**
     *
     * @param {BuilderMotionScript} motionScript
     * @returns {boolean}
     */
    static async saveMotionScript(motionScript) {
        return await this.modelStorageManager && this.modelStorageManager.saveMotionScripts([motionScript]);
    }

    /**
     *
     * @param {BuilderMotionScript} motionScript
     * @returns {Promise}
     */
    static async deleteMotionScript(motionScript) {
        let isOk =  await this.modelStorageManager && this.modelStorageManager.deleteMotionScript(motionScript)
        if (isOk) {
            this.motionScripts = this.motionScripts.filter(script => script.getHydraId() !== motionScript.getHydraId());
        }
        return isOk;
    }


}

window.MotionScriptsManager = MotionScriptsManager;