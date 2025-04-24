import ParameteredRocket from './Parameter/ParameteredRocket.js';
import RocketParameters from './Parameter/RocketParameters.js';
import RocketRepresentation from './Graphics/RocketRepresentation.js';
import RocketChart from './Chart/RocketChart.js';
import RocketDataTable from './DataTable/RocketDataTable.js';
import RocketModule from './Module/RocketModule.js';
import VisualRocket from "./Rocket/VisualRocket.js";
import RocketModulesData from "./Module/RocketModulesData.js";



/**
 * @class
 * @extends {VisualRocket}
 */
export default class Rocket extends VisualRocket {

    /**
     *
     * @type {boolean}
     */
    debugLog = false;

    /**
     *
     * @type {RocketModule[]}
     */
    modules = []
    modelsSettings = {};
    currentModelSettings;
    modulesData = {};

    constructor() {
        super();
        this.reset();
    }

    /**
     *
     * @returns {Rocket}
     */
    reset() {
        /**
         * At first, there is only one module that can be composed of many stages/propellers, etc.
         */
        this.modules = [];
        this.modulesData = new RocketModulesData();

        return this;
    }

    /**
     *
     * @returns {this}
     */
    draw() {
        this.modules.forEach((module, index)=>{
            module.draw(this.view, index===0);
        })

        return this;
    }

    /**
     * @param {RocketModule} module
     */
    addModule(module) {
        this.modules.push(module);

        return this;
    }

    /**
     *
     * @param model
     * @param settings
     * @returns {this}
     */
    addModelSettings(model, settings) {
        this.modelsSettings[model] = settings;

        return this;
    }

    getModelsNames() {
        return Object.keys(this.modelsSettings);
    }

    clearModelSettings() {
        this.modelsSettings = {};

        return this;
    }

    /**
     *
     * @param {string} model
     * @param {string|null} fallbackModel
     * @returns {this}
     */
    useModel(model, fallbackModel = 'basic') {
        this.log('useModel', model, fallbackModel)
        this.reset();
        let isExistingModel = this.modelsSettings.hasOwnProperty(model);
        this.log('isExistingModel', model, isExistingModel, this.modelsSettings)
        this.currentModelSettings = isExistingModel ? this.modelsSettings[model] : this.modelsSettings[fallbackModel];
        this.log('modelSettings', this.currentModelSettings, this.modelsSettings)
        if (typeof this.currentModelSettings === 'undefined') {
            throw new  Error('No Rocket Settings found for model "'+model+'"');
        }

        this.initModule()
            //.initialize();

        return this;
    }

    /**
     *
     * @returns {this}
     */
    initModule() {
        let module = new RocketModule(this, this.getParameters())
        this.log('module', module)
        // Init module from settings
        this.currentModelSettings.modules.forEach((stageSettings)=> {
            module.addSubModule(stageSettings);
        });

        this.modules = [module];

        return this;
    }

    /**
     *
     * @returns {this}
     */
    // initialize() {
    //     this.motionScripts.forEach((module)=>{
    //         module.initialize();
    //     })
    //
    //     this.log('Initialize', this.motionScripts)
    //
    //     return this;
    // }

    /**
     *
     * @returns {this}
     */
    initModuleSettings() {
        this.log('InitModuleSettings')
        this.modules.forEach((module)=>{
            module.initSettings();
        })

        return this;
    }

    /**
     *
     * @returns {this}
     */
    setModulesRunning() {
        this.modules.forEach((module)=>{
            module.setModuleRunning();
        })

        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    areModulesRunning() {
        return this.modules.some((module)=>{
            return module.isModulesRunning();
        });
    }

    /**
     *
     * @returns {boolean}
     */
    updateModule() {

        this.log('################################## Entering UpdateModule', this.modules.length)
        // let continueUpdate = true;
        // this.motionScripts.forEach((module)=>{
        //     continueUpdate &&= module.update();
        // });

        let continueUpdate = false;
        this.modules.forEach((module, index)=>{
            this.log('++++++ Updating module', index);
            let moduleContinueUpdate = module.update();
            continueUpdate ||= moduleContinueUpdate;
        });

        // let continueUpdate = true;
        // continueUpdate = this.motionScripts[0].update();

        this.log('################################## UpdateModule', this.modules.length, continueUpdate)
        return continueUpdate;
    }

    /**
     *
     * @param index
     * @returns {RocketModule}
     */
    getModule(index=0) {
        if (index >= this.modules.length) {
            return null;
        }
        return this.modules[index];
    }



    /**
     *
     * @returns {RocketModule}
     */
    studiedModule() {
        return this.getModule(0);
    }

    studiedModuleData() {
        // TODO : handle other than 0
        return this.modulesData.getData(0);
    }

    /**
     *
     * @returns {this}
     */
    async animate() {
        let idx = this.getParameters().getIdx();
        this.getParameters().setIdx(idx+1);
        //this.log('Animate', this.getParameters().getIdx());
        let continueUpdate = this.updateModule();
        this.updateScreenVariables();
        this.draw();
        if (!continueUpdate) {
            //this.log('Stop')
            //this.initModuleSettings();
            let currentIntegrationMethod = this.getParameters().getIntegrationMethod();
            let currentIntegrationMethodName = currentIntegrationMethod.name;
            let currentIntegrationMethodColor = currentIntegrationMethod.color;
            let currentIntegrationMethodIsMainSource = currentIntegrationMethod.isMainSource;
            this.log('Current Integration Method', currentIntegrationMethod)
            //mook()
            this.log('Current Integration Method', currentIntegrationMethodName)
            this.modules.forEach((module, index)=>{
                this.log('data', module.data(currentIntegrationMethodName))
                this.modulesData.addData(index, currentIntegrationMethodName, currentIntegrationMethodColor, currentIntegrationMethodIsMainSource, module.data(currentIntegrationMethodName));
                // this.modulesData[currentIntegrationMethod] = this.modulesData[currentIntegrationMethod] ?? [];
                // this.modulesData[currentIntegrationMethod].push(module.data(currentIntegrationMethod));
            })
            this.log('this.modulesData', this.modulesData)
            this.log('this.modulesData', this.studiedModuleData())
            //await this.drawCharts(this.studiedModule());
            await this.drawCharts(this.studiedModuleData());
        }
        //if (this.areModulesRunning()) {
        if (continueUpdate){
            requestAnimationFrame(await this.animate.bind(this));
        } else {
            this.log('Modules are not running, stop animation')
            if (this.getParameters().getRunningAllIntegrationMethods()) {
                this.runAll();
                this.log('END')
            }
        }

        return this;
    }

    /**
     * Runs all integration methods entirely, one after one (runs method 1 entirely, then method 2 entirely, etc.)
     *
     * @param {Function} onFinishedCallback
     * @returns {this}
     */
    async runAll(onFinishedCallback) {
        this.log('RunAll', onFinishedCallback)
        if (this.getParameters().getIntegrationMethods().length === this.getParameters().getAllIntegrationMethods().length) {
            //this.initialize();
            this.clearGrids();
        }
        if (this.getParameters().getIntegrationMethods().length > 0) {
            this.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            this.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            this.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            this.getParameters().setIntegrationMethod(this.getParameters().getIntegrationMethods().shift()) ;
            this.log('Switching Method to', this.getParameters().getIntegrationMethod())
            this.getParameters().setRunningAllIntegrationMethods(true);
            this.clearView();
            this.initModule();
            this.setModulesRunning();
            await this.animate();
        } else {
            this.getParameters().setIntegrationMethods([...this.getParameters().getAllIntegrationMethods()]);
            this.getParameters().setRunningAllIntegrationMethods(false);
            //this.clear();
            this.dataTable.prepare(this.studiedModuleData());
            document.getElementById('altitudeButton').click();
            document.getElementById('speedButton').click();

            this.log('RunAll END', this, this.onRunFinshedCallback)
            this.onRunFinshedCallback && this.onRunFinshedCallback();
        }

        return this;
    }

    /**
     *
     * @param {Function} onFinishedCallback
     * @returns {this}
     */
    async runMethods(onFinishedCallback = null) {
        this.log('RunMethods', onFinishedCallback)
        let integrationMethods = this.studiedModule().getMethods().methodObjects();
        this.getParameters().setAllIntegrationMethods(integrationMethods);
        this.getParameters().setIntegrationMethods([...integrationMethods]);
        this.log('UseModel', this.getParameters().getRocketModel())
        this.useModel(this.getParameters().getRocketModel())
        this.onRunFinshedCallback = onFinishedCallback;
        await this.runAll();

        return this;
    }

    getVelocity() {
        return this.studiedModule().getLastData('v');
    }
}

window.Rocket = Rocket;