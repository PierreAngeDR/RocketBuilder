import ModelStorageManager from "./Storage/ModelStorageManager.js";
import ModelBuilderManager from "./ModelBuilderManager.js";
import ScriptMotionManager from "./ScriptMotionManager.js";

export default class ExtensionManager {
    /**
     *
     * @type {ModelBuilderManager}
     */
    modelBuilderManager = null;
    /**
     *
     * @type {ScriptMotionManager}
     */
    scriptMotionManager = null;
    storageConfig = null;
    loggedIn = false;
    /**
     *
     * @type {ModelStorageManager}
     */
    storageManager = null;

    constructor(storageConfig = {storage: 'local'}) {
        this.setStorageConfig(storageConfig);
    }

    setStorageConfig(storageConfig) {
        this.storageConfig = storageConfig;
        this.storageManager = new ModelStorageManager(storageConfig);

        if (null !== this.modelBuilderManager) {
            this.modelBuilderManager.setStorageManager(this.storageManager);
        }
        if (null !== this.scriptMotionManager) {
            this.scriptMotionManager.setStorageManager(this.storageManager);
        }

        return this;
    }

    setLoggedIn(loggedIn) {
        this.loggedIn = loggedIn;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    async init() {
        if (this.isLoggedIn()) {
            this.modelBuilderManager = new ModelBuilderManager(this.storageManager);
            this.scriptMotionManager = new ScriptMotionManager(this.storageManager);

            const initPromises = [];

            initPromises.push(await this.modelBuilderManager.init());
            initPromises.push(await this.scriptMotionManager.init());

            // TODO. we could add a success result from promises.
            const results = await Promise.all(initPromises);
            //console.log('Models and Scripts Initialized')

            return true;
        } else {
            this.modelBuilderManager = null;
            this.scriptMotionManager = null;
        }

        return false;
        // initModelBuilderManager(this.loggedIn, this.storageConfig);
        // initScriptMotionManager(this.loggedIn, this.storageConfig);

    }

    clickModelBuilder() {
        if (this.isLoggedIn()) {
            this.modelBuilderManager&&this.modelBuilderManager.click(this.isLoggedIn());
        }
    }

    clickScriptMotionBuilder() {
        if (this.isLoggedIn()) {
            this.scriptMotionManager&&this.scriptMotionManager.click(this.isLoggedIn());
        }
    }


}

window.extensionManager = new ExtensionManager();