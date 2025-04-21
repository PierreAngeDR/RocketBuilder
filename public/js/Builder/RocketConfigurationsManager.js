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

    getRocketsConfigurations() {
        this.rocket.clearModelSettings();
        let handledMotionClasses = [];

        ModulesManager.getModules().forEach(module => {
            try {
                let rocketConfiguration = {name:module.getName(), modules:[], motions:[]};
                module.getSubModules().forEach(subModule => {
                    rocketConfiguration.modules.push(subModule.getData());
                    let motionClasses = subModule.getMotionScripts();
                    motionClasses.forEach(motionClass => {
                        let motionClassName = motionClass.getName();
                        if (!handledMotionClasses.includes(motionClassName)) {
                            try {
                                let motionScript = motionClass.getScript();
                                console.log('###############################################################')
                                console.log('Evaluating motion script: ' + motionClassName);
                                console.log('###############################################################')
                                eval(motionScript);
                                
                            } catch(err) {
                                throw new Error('Error while evaluating motion script: ' + motionClassName+'. Error was : '+err.message);
                            }

                            // Check if motionClassName is an instance of RocketMotionBase
                            if(window[motionClassName] instanceof RocketMotionBase) {
                                handledMotionClasses.push();
                                rocketConfiguration.motions.push(motionClassName);
                            } else {
                                throw new Error('Error with motion script: ' + motionClassName+'. Class is not an instance of RocketMotionBase.');
                            }
                        }
                    })
                    this.rocket.addModelSettings(rocketConfiguration.name, rocketConfiguration.modules);
                })
            } catch(err) {
                console.log('Dismissed module: ' + module.getName() + '. Error was : '+err.message);
            }
        })

    }


}

window.RocketConfigurationsManager = RocketConfigurationsManager;