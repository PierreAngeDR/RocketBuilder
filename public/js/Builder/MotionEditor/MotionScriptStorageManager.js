import RocketApi from "../../Api/RocketApi.js";
import ModulesManager from "../ModelBuilder/ModulesManager.js";

export default class MotionScriptStorageManager {
    constructor(config = { storage: 'local' }) {
        this.storageKey = {
            scripts: 'motionScripts',
            subModules: 'rocketSubModules'
        };

        this.config = {
            storage: config.storage || 'local',
            api: {
                scripts: config.api?.motionScripts || 'motion_scripts',
                subModules: config.api?.subModules || 'sub_modules'
            }
        };
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
                    //wModulesManager.loadModule(item)
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

}

window.MotionScriptStorageManager = MotionScriptStorageManager;