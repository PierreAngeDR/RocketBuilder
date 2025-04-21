export default class ModelMotionScriptsBuilder {
    /**
     *
     * @param {ModelStorageManager} modelStorageManager
     */
    constructor(modelStorageManager = null) {
        console.log('Creating ModelMotionScriptsBuilder', modelStorageManager);
        this.motionScripts = [];
        this.modelStorageManager = modelStorageManager;

    }

    async init() {
        await this.loadMotionScripts();
    }

    async loadMotionScripts() {
        // Try to loadFromDb saved motionScripts from localStorage
        //alert('Loading Modules')
        //const savedMotionScripts = localStorage.getItem('rocketModules');
        const savedMotionScripts = await this.modelStorageManager.loadMotionScripts();
        if (savedMotionScripts) {
            try {
                //this.motionScripts = await this.modelStorageManager.loadMotionScripts();
                this.motionScripts = savedMotionScripts;
                console.log('Loaded motion scripts...', this.motionScripts)
                //this.motionScripts = JSON.parse(savedMotionScripts);
            } catch (error) {
                console.error('Error loading saved motion scripts:', error);
                this.motionScripts = [];
            }
        }
    }

    async saveMotionScripts() {
        console.log('Saving motion scripts', this.motionScripts)
        await this.modelStorageManager.saveMotionScripts(this.motionScripts);
    }

    getAllMotionScripts() {
        return this.motionScripts;
    }

    getMotionScript(name) {
        return this.motionScripts.find(motionScript => motionScript.name === name);
    }

    addMotionScript(motionScript) {
        return motionScript;
        // Check if a motionScript with this name already exists
        const existingIndex = this.motionScripts.findIndex(m => m.name === motionScript.name);

        if (existingIndex !== -1) {
            // Update existing motionScript
            this.motionScripts[existingIndex] = motionScript;
        } else {
            // Add new motionScript
            this.motionScripts.push(motionScript);
        }

        this.saveModules();
        return motionScript;
    }

    updateMotionScript(motionScript) {
        return true;
        const index = this.motionScripts.findIndex(m => m.name === motionScript.name);

        console.log('Updating motionScript', motionScript, index)

        if (index !== -1) {
            this.motionScripts[index] = motionScript;
            this.saveMotionScripts();
            return true;
        }

        return false;
    }

    deleteMotionScript(motionScriptName) {
        const initialLength = this.motionScripts.length;
        this.motionScripts = this.motionScripts.filter(motionScript => motionScript.name !== motionScriptName);

        if (this.motionScripts.length !== initialLength) {
            this.saveMotionScripts();
            return true;
        }

        return false;
    }

    importMotionScripts(motionScriptsData) {
        try {
            if (Array.isArray(motionScriptsData)) {
                // If we're importing an array of motionScripts
                motionScriptsData.forEach(module => this.addMotionScript(module));
            } else if (typeof motionScriptsData === 'object') {
                // If we're importing a single module
                this.addMotionScript(motionScriptsData);
            }

            this.saveMotionScripts();
            return true;
        } catch (error) {
            console.error('Error importing motionScripts:', error);
            return false;
        }
    }
}

window.ModelModulesBuilder = ModelMotionScriptsBuilder;