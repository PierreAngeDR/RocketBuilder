import BuilderModule from "./BuilderModule.js";
import BuilderSubModule from "./BuilderSubModule.js";
import BaseManager from "../../Base/BaseManager.js";
import MotionScriptsManager from "../MotionEditor/MotionScriptsManager.js";

export default class ModulesManager extends BaseManager {
    static defaultNewModuleName = 'New Module';
    static defaultNewSubModuleName = 'New SubModule';

    /**
     *
     * @type {BuilderModule[]}
     */
    static modules = [];
    /**
     *
     * @type {BuilderSubModule[]}
     */
    static subModules = [];

    static debug() {
        console.log('ModulesManager: ', this.modules, ' ', this.subModules);
    }

    static getModules() {
        return this.modules;
    }

    /**
     *
     * @returns {BuilderSubModule[]}
     */
    static getSubModules() {
        return this.subModules;
    }

    /**
     *
     * @param {BuilderModule} module
     */
    static addModule(module) {
        this.modules.push(module);
    }

    /**
     *
     * @param {string|null} moduleName
     * @returns {BuilderModule}
     */
    static newModule(moduleName = null) {
        if (null === moduleName) {
            moduleName = this.findAvailableNewElementName('module');
        }
        if (this.elementWithSameNameExists(moduleName, 'module')) {
            throw new Error('module with same name exists');
        }

        let newModule = new BuilderModule(
            {
                data : {name : moduleName},
                "@id" : null,
                id : null,
                rocketSubModules : []
            })
        this.modules.push(newModule);

        return newModule;
    }

    static loadModule(moduleData) {
        this.modules.push(new BuilderModule(moduleData, false))
    }

    static saveModule(module) {
        return this.modelStorageManager && this.modelStorageManager.saveModules([module])
    }

    /**
     *
     * @param {BuilderSubModule} subModule
     */
    static addSubModule(subModule) {
        this.subModules.push(subModule);
    }

    /**
     *
     * @param {string|null} moduleName
     * @param data
     * @returns {BuilderSubModule}
     */
    static newSubModule(moduleName = null, data = {}) {
        if (null === moduleName) {
            moduleName = this.findAvailableNewElementName('subModule');
        }
        if (this.elementWithSameNameExists(moduleName, 'subModule')) {
            throw new Error('module with same name exists');
        }

        //console.log('----> subModule name', moduleName);

        let newSubModule = new BuilderSubModule({
            name : moduleName,
            data : data,
            "@id" : null,
            id : null,
            rocketModules : [],
            rocketMotionScripts : []
        })
        this.subModules.push(newSubModule);
        return newSubModule;
    }

    static loadSubModule(subModuleData) {
        this.subModules.push(new BuilderSubModule(subModuleData, false))
    }

    static saveSubModule(subModule) {
        return this.modelStorageManager && this.modelStorageManager.saveSubModules([subModule])
    }

    static assignModulesSubModules(isOrigin = true) {
        console.log('assignModulesSubModules');
         this.modules.forEach(module => {
             module.subModules = this.getModuleSubModules(module);
         })
        this.subModules.forEach(subModule => {
            subModule.modules = this.getSubModuleModules(subModule);
        })

        if (isOrigin) {
            MotionScriptsManager.assignScriptSubModules(false);
        }
    }

    /**
     *
     * @param module
     * @returns {BuilderSubModule[]}
     */
    static getModuleSubModules(module) {
        let subModules = this.subModules.filter(subModule => subModule.getModules().indexOf(module.getHydraId())!==-1);
        console.log('getModuleSubModules', module, subModules);
        return subModules;
    }

    /**
     *
     * @param subModule
     * @returns {BuilderModule[]}
     */
    static getSubModuleModules(subModule) {
        return this.modules.filter(module => subModule.getModules().indexOf(module.getHydraId())!==-1);
        return subModule.getModules().map(moduleHydraId => this.modules.find(module => module.getHydraId() === moduleHydraId));
    }
}

window.ModulesManager = ModulesManager;