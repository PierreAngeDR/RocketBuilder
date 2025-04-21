export default class ModelModulesBuilder {
    /**
     *
     * @param {ModelStorageManager} modelStorageManager
     */
    constructor(modelStorageManager = null) {
        console.log('Creating ModelMotionScriptsBuilder', modelStorageManager);
        this.modules = [];
        this.modelStorageManager = modelStorageManager;

    }

    async init() {
        await this.loadModules();
    }

    async loadModules() {
        // Try to loadFromDb saved motionScripts from localStorage
        //alert('Loading Modules')
        //const savedModules = localStorage.getItem('rocketModules');
        const savedModules = await this.modelStorageManager.loadModules();
        if (savedModules) {
            try {
                //this.motionScripts = await this.modelStorageManager.loadMotionScripts();
                this.modules = savedModules;
                console.log('Loaded motionScripts...', this.modules)
                //this.motionScripts = JSON.parse(savedModules);
            } catch (error) {
                console.error('Error loading saved motionScripts:', error);
                this.modules = [];
            }
        }
    }

    async saveModules() {
        console.log('Saving motionScripts', this.modules)
        await this.modelStorageManager.saveModules(this.modules);
    }

    getAllModules() {
        return this.modules;
    }

    getModule(name) {
        return this.modules.find(module => module.name === name);
    }

    addModule(module) {
        return module;
        // Check if a module with this name already exists
        const existingIndex = this.modules.findIndex(m => m.name === module.name);

        if (existingIndex !== -1) {
            // Update existing module
            this.modules[existingIndex] = module;
        } else {
            // Add new module
            this.modules.push(module);
        }

        this.saveModules();
        return module;
    }

    updateModule(module) {
        return true;
        const index = this.modules.findIndex(m => m.name === module.name);

        console.log('Updating module', module, index)

        if (index !== -1) {
            this.modules[index] = module;
            this.saveModules();
            return true;
        }

        return false;
    }

    deleteModule(moduleName) {
        const initialLength = this.modules.length;
        this.modules = this.modules.filter(module => module.name !== moduleName);

        if (this.modules.length !== initialLength) {
            this.saveModules();
            return true;
        }

        return false;
    }

    importModules(modulesData) {
        try {
            if (Array.isArray(modulesData)) {
                // If we're importing an array of motionScripts
                modulesData.forEach(module => this.addModule(module));
            } else if (typeof modulesData === 'object') {
                // If we're importing a single module
                this.addModule(modulesData);
            }

            this.saveModules();
            return true;
        } catch (error) {
            console.error('Error importing motionScripts:', error);
            return false;
        }
    }
}

window.ModelModulesBuilder = ModelModulesBuilder;