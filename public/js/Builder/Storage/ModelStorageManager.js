import RocketApi from "../../Api/RocketApi.js";
import ModulesManager from "../ModelBuilder/ModulesManager.js";
import BuilderSubModule from "../ModelBuilder/BuilderSubModule.js";
import RocketLogin from "../../Api/RocketLogin.js";
import MotionScriptsManager from "../MotionEditor/MotionScriptsManager.js";

export default class ModelStorageManager {
    constructor(config = { storage: 'local' }) {
        this.storageKey = {
            modules: 'rocketModules',
            subModules: 'rocketSubModules',
            motionScripts: 'motionScripts',
        };

        this.config = {
            storage: config.storage || 'local',
            api: {
                modules: config.api?.modules || 'modules',
                subModules: config.api?.subModules || 'sub_modules',
                motionScripts : config.api?.motionScripts || 'motion_scripts',
            }
        };
    }

    async saveAllData(modules, subModules) {
        const modulesResult = await this.saveModules(modules);
        const subModulesResult = await this.saveSubModules(subModules);
        return modulesResult && subModulesResult;
    }

    async saveModules(modules) {
        try {
            let allOk = true;
            if (this.config.storage === 'local') {
                try {
                    localStorage.setItem(this.storageKey.modules, JSON.stringify(modules));
                } catch (error) {
                    console.error('Error saving motionScripts:', error);
                    allOk = false;
                }
            } else if (this.config.storage === 'remote') {
                console.log('--------motionScripts',modules);
                if (await RocketApi.checkIsAuthenticated() === false) {
                    RocketLogin.login(true);
                    return false;
                }

                for(const module of modules) {
                    try {
                        if (null !== module.id) {
                            console.log('Updating db module', module.id)
                            await RocketApi.update(this.config.api.modules, module.id, module.getStructure())
                        } else {
                            console.log('Creating db module')
                            let hydraData = await RocketApi.create(this.config.api.modules, module.getStructure())
                            module.setHydraId(hydraData["@id"]);
                            module.setId(hydraData.id)
                        }
                    } catch (error) {
                        allOk = false;
                        console.log('Error creating db module', error)
                    }
                }
            }

            return allOk;
        } catch (error) {
            console.error('Error saving motionScripts:', error);
            return false;
        }
    }

    /**
     *
     * @param {BuilderSubModule[]} subModules
     * @returns {Promise<boolean>}
     */
    async saveSubModules(subModules) {
        alert('saveSubModules')
        try {
            let allOk = true;
            if (this.config.storage === 'local') {
                try {
                    localStorage.setItem(this.storageKey.subModules, JSON.stringify(subModules));
                } catch (error) {
                    console.error('Error saving subModules:', error);
                    allOk = false;
                }
            } else if (this.config.storage === 'remote') {
                if (await RocketApi.checkIsAuthenticated() === false) {
                    RocketLogin.login(true);
                    return false;
                }

                for (const subModule of subModules) {
                    try {
                        console.log('Saving subModule', subModule, subModule.id, subModule.getStructure())

                        if (subModule.id !== null) {
                            await RocketApi.update(this.config.api.subModules, subModule.getId(), subModule.getStructure())
                        } else {
                            console.log('Creating db subModule')
                            let hydraData = await RocketApi.create(this.config.api.subModules, subModule.getStructure())
                            subModule.setHydraId(hydraData["@id"]);
                            subModule.setId(hydraData.id)
                            console.log('Created db subModule', hydraData)
                        }
                    } catch (error) {
                        allOk = false;
                        console.log('Error creating db subModule', error)
                    }
                }
            }
            return allOk;
        } catch (error) {
            console.error('Error saving subModules:', error);
            return false;
        }
    }

    async saveMotionScripts(motionScripts) {
        try {
            let allOk = true;
            if (this.config.storage === 'local') {
                try {
                    localStorage.setItem(this.storageKey.motionScripts, JSON.stringify(motionScripts));
                } catch (error) {
                    console.error('Error saving motionScripts:', error);
                    allOk = false;
                }
            } else if (this.config.storage === 'remote') {
                console.log('--------motionScripts',motionScripts);
                if (await RocketApi.checkIsAuthenticated() === false) {
                    RocketLogin.login(true);
                    return false;
                }

                for(const motionScript of motionScripts) {
                    try {
                        if (null !== motionScript.id) {
                            console.log('Updating db motionScript', motionScript.id)
                            await RocketApi.update(this.config.api.motionScripts, motionScript.id, motionScript.getStructure())
                        } else {
                            console.log('Creating db motionScript')
                            let hydraData = await RocketApi.create(this.config.api.motionScripts, motionScript.getStructure())
                            motionScript.setHydraId(hydraData["@id"]);
                            motionScript.setId(hydraData.id)
                        }
                    } catch (error) {
                        allOk = false;
                        console.log('Error creating db motionScript', error)
                    }
                }
            }

            return allOk;
        } catch (error) {
            console.error('Error saving motionScripts:', error);
            return false;
        }
    }

    /**
     *
     * @param {BuilderSubModule}subModule
     */
    saveSubModule(subModule) {

    }

    async loadModules() {
        console.log('Loading motionScripts')
        try {
            if (this.config.storage === 'local') {
                const data = localStorage.getItem(this.storageKey.modules);
                return data ? JSON.parse(data) : [];
            } else if (this.config.storage === 'remote') {
                const content =  await RocketApi.fetchCollection(this.config.api.modules);
                //console.log('content loadMotionScripts',content);

                content.items.forEach(item => {
                    ModulesManager.loadModule(item)
                })

                //console.log('Result loadMotionScripts',motionScripts)

                return ModulesManager.getModules();

            }
            return [];
        } catch (error) {
            console.error('Error loading motionScripts:', error);
            return [];
        }
    }

    async loadSubModules() {
        console.log('Loading subModules', this.config.storage)
        try {
            if (this.config.storage === 'local') {
                const data = localStorage.getItem(this.storageKey.subModules);
                return data ? JSON.parse(data) : [];
            } else if (this.config.storage === 'remote') {
                const content =  await RocketApi.fetchCollection(this.config.api.subModules);
                //console.log('content loadSubModules',content);
                let subModules = [];
                content.items.forEach(item => {
                    ModulesManager.loadSubModule(item)
                })
                ModulesManager.setLoaded()

                //console.log('Result loadSubModules',subModules)

                return ModulesManager.getSubModules();
            }
            return [];
        } catch (error) {
            console.error('Error loading subModules:', error);
            return [];
        }
    }

    async loadMotionScripts() {
        console.log('Loading motion scripts')
        try {
            if (this.config.storage === 'local') {
                const data = localStorage.getItem(this.storageKey.motionScripts);
                return data ? JSON.parse(data) : [];
            } else if (this.config.storage === 'remote') {
                const content =  await RocketApi.fetchCollection(this.config.api.motionScripts);
                //console.log('content loadMotionScripts',content);

                content.items.forEach(item => {
                    MotionScriptsManager.loadMotionScript(item)
                })
                MotionScriptsManager.setLoaded()

                //console.log('Result loadMotionScripts',motionScripts)

                return MotionScriptsManager.getMotionScripts();

            }
            return [];
        } catch (error) {
            console.error('Error loading motion scripts:', error);
            return [];
        }
    }

    exportAsJson(module) {
        return JSON.stringify(module, null, 2);
    }

    async exportAll() {
        const data = {
            modules: await this.loadModules(),
            subModules: await this.loadSubModules()
        };

        return JSON.stringify(data, null, 2);
    }

    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            // If the import contains both motionScripts and subModules
            if (data.modules && data.subModules) {
                await this.saveModules(data.modules);
                await this.saveSubModules(data.subModules);
                return { success: true, message: 'All data imported successfully' };
            }

            // If the import is just a module
            if (data.name && data.modules) {
                const currentModules = await this.loadModules();
                const moduleIndex = currentModules.findIndex(m => m.name === data.name);

                if (moduleIndex !== -1) {
                    currentModules[moduleIndex] = data;
                } else {
                    currentModules.push(data);
                }

                await this.saveModules(currentModules);
                return { success: true, message: `Module "${data.name}" imported successfully` };
            }

            // If the import is an array of motionScripts
            if (Array.isArray(data) && data.length > 0 && data[0].name) {
                await this.saveModules(data);
                return { success: true, message: `${data.length} modules imported successfully` };
            }

            return { success: false, message: 'Invalid import data format' };
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, message: `Import failed: ${error.message}` };
        }
    }

    async clearAllData() {
        try {
            if (this.config.storage === 'local') {
                localStorage.removeItem(this.storageKey.modules);
                localStorage.removeItem(this.storageKey.subModules);
                return true;
            } else if (this.config.storage === 'remote') {
                const modulesResponse = await fetch(this.config.api.modules, {
                    method: 'DELETE'
                });

                const subModulesResponse = await fetch(this.config.api.subModules, {
                    method: 'DELETE'
                });

                return modulesResponse.ok && subModulesResponse.ok;
            }
            return false;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    /**
     *
     * @param {BuilderMotionScript} motionScript
     * @returns boolean
     */
    async deleteMotionScript(motionScript) {

        console.log('Loading motion scripts')
        try {
            if (this.config.storage === 'local') {
                const data = localStorage.removeItem(this.storageKey.motionScripts);
                //return data ? JSON.parse(data) : [];
            } else if (this.config.storage === 'remote') {
                if (motionScript.id !== null) {
                    await RocketApi.delete(this.config.api.motionScripts, motionScript.id);
                    console.log('Deleted motionScript', motionScript)
                } else {
                    console.log('No need to delete motionScript because it was not in DB', motionScript)
                }
            }
            return true;
        } catch (error) {
            console.error('Error deleting motion scripts:', error);
            return false;
        }
    }

    downloadAsFile(data, filename) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'rocket-module-export.json';
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }
}

window.ModelStorageManager = ModelStorageManager;