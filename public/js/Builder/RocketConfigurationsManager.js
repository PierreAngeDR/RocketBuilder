import ModulesManager from "./ModelBuilder/ModulesManager.js";
import MotionScriptsManager from "./MotionEditor/MotionScriptsManager.js";
import Rocket from "../Rocket.js";
export default class RocketConfigurationsManager {

    //rocketConfigurations = [];

    /**
     * @type {ModulesManager}
     */
    modulesManager;

    /**
     *
     * @param {Rocket} rocket
     */
    constructor(rocket) {
        this.rocket = rocket;
    }

    async getRocketsConfigurations() {
        this.rocket.clearModelSettings();
        let handledMotionClasses = [];

        let modules = ModulesManager.getModules();
        for(let module of modules) {
            try {
                let rocketConfiguration = {name:module.getName(), modules:[], motions:[]};
                let subModules = module.getSubModules();
                for(let subModule of subModules) {
                    rocketConfiguration.modules.push(subModule.getData());
                    let motionClasses = subModule.getMotionScripts();
                    for(let motionClass of motionClasses) {
                        let motionClassName = motionClass.getName();
                        if (!handledMotionClasses.includes(motionClassName)) {
                            try {
                                let motionScript = motionClass.getScript();
                                console.log('###############################################################')
                                console.log('Evaluating motion script: ' + motionClassName);
                                console.log('###############################################################')
                                await this.evaluateMotionScript(motionScript, motionClassName);
                                console.log(`Evaluation done for ${motionClassName} !`)
                                //console.log(window[motionClassName])

                            } catch(err) {
                                throw new Error('Error while evaluating motion script: ' + motionClassName+'. Error was : '+err.message);
                            }

                            // Check if motionClassName is an instance of RocketMotionBase
                            if(window[motionClassName].prototype instanceof RocketMotionBase) {
                                handledMotionClasses.push(motionClassName);
                                rocketConfiguration.motions.push(motionClassName);
                                console.log('Adding motion script: ' + motionClassName);
                            } else {
                                throw new Error('Error with motion script: ' + motionClassName+'. Class is not an instance of RocketMotionBase.');
                            }
                        }
                    }
                }
                console.log('Adding module: ',rocketConfiguration.name, rocketConfiguration.modules);
                //this.rocket.addModelSettings(rocketConfiguration.name, rocketConfiguration.modules);
                rocketConfiguration.modules.forEach(module => {
                    console.log('Changing motion from ', module.motion, ' to ', window[module.motion].prototype);
                    //module.motion = window[module.motion].prototype;
                    module.motion = window[module.motion];
                });

                this.rocket.addModelSettings(rocketConfiguration.name, {modules:rocketConfiguration.modules});
            } catch(err) {
                console.log('Dismissed module: ' + module.getName() + '. Error was : '+err.message);
            }
        }
    }

    async evaluateMotionScript(motionScript, motionClassName) {
        //eval(motionScript);
        //console.log('Evaluating script:', motionScript)
        const encodedJs = encodeURIComponent(motionScript);
        const dataUri = 'data:text/javascript;charset=utf-8,'
            + encodedJs;
        try {
            await import(dataUri);
        } catch(err) {
            throw new Error('Error while evaluating motion script: ' + motionClassName+'. Error was : '+err.message);
        }
    }


}

window.RocketConfigurationsManager = RocketConfigurationsManager;