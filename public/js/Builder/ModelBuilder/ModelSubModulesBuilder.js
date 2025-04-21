import ModulesManager from "./ModulesManager.js";

export default class ModelSubModulesBuilder {
    /**
     *
     * @param {ModelStorageManager} modelStorageManager
     */
    constructor(modelStorageManager = null) {
        this.modelStorageManager = modelStorageManager;
        this.subModules = [];
    }

    async init() {
        await this.loadSubModules();
    }

    async loadSubModules() {
        // Try to loadFromDb saved submodules from localStorage
        //alert('Loading SubModules')

        //const savedSubModules = localStorage.getItem('rocketSubModules');
        const savedSubModules = await this.modelStorageManager.loadSubModules();
        if (savedSubModules) {
            try {
                //this.subModules = JSON.parse(savedSubModules);

                this.subModules = savedSubModules;
                console.log('Loaded sub motionScripts...', this.subModules)
            } catch (error) {
                console.error('Error loading saved submodules:', error);
                this.subModules = [];
            }
        }
    }

    async saveSubModules() {
        // Save submodules to localStorage
        try {
            //localStorage.setItem('rocketSubModules', JSON.stringify(this.subModules));
            console.log('Saving submodules', this.subModules)
            await this.modelStorageManager.saveSubModules(this.subModules);
        } catch (error) {
            console.error('Error saving submodules:', error);
        }
    }

    getAllSubModules() {
        return this.subModules;
    }

    getSubModule(name) {
        return this.subModules.find(subModule => subModule.name === name);
    }

    deleteSubModule(subModuleName) {
        const initialLength = this.subModules.length;
        this.subModules = this.subModules.filter(sm => sm.name !== subModuleName);

        if (this.subModules.length !== initialLength) {
            this.saveSubModules();
            return true;
        }

        return false;
    }

    createDefaultSubModule() {
        return {
            name: ModulesManager.findAvailableNewElementName('subModule'),
            dimensions: {
                altitude: 0,
                height: 1,
                diameter: 1,
                position: 'central'
            },
            m0: 0, // Empty mass
            mc: 0, // Fuel mass
            dm: 0, // Fuel consumption per second
            A: 1,  // Front section
            F: 0,  // Thrust
            Cd: 0.5, // Drag coefficient
            motion: 'DefaultMotion',
            enginePropellingStartTime: 0,
            enginePropellingDuration: 0
        };
    }

    validateSubModule(subModule) {
        // Basic validation to ensure all required properties exist
        const requiredProps = [
            'name',
            'dimensions',
            'm0',
            'mc',
            'dm',
            'A',
            'F',
            'Cd',
            'motion',
            'enginePropellingStartTime',
            'enginePropellingDuration'
        ];

        const dimensionProps = ['altitude', 'height', 'diameter', 'position'];

        // Check for required top-level properties
        for (const prop of requiredProps) {
            if (!(prop in subModule)) {
                return { valid: false, error: `Missing required property: ${prop}` };
            }
        }

        // Check for required dimension properties
        for (const prop of dimensionProps) {
            if (!(prop in subModule.dimensions)) {
                return { valid: false, error: `Missing required dimensions property: ${prop}` };
            }
        }

        // Check that numeric values are actually numbers
        const numericProps = ['m0', 'mc', 'dm', 'A', 'Cd', 'enginePropellingStartTime', 'enginePropellingDuration'];
        for (const prop of numericProps) {
            if (typeof subModule[prop] !== 'number') {
                return { valid: false, error: `Property ${prop} must be a number` };
            }
        }

        // Check that F is either a number or a function
        if (typeof subModule.F !== 'number' && typeof subModule.F !== 'function') {
            return { valid: false, error: 'Property F must be a number or a function' };
        }

        // Check dimension values
        const numericDimensionProps = ['altitude', 'height', 'diameter'];
        for (const prop of numericDimensionProps) {
            if (typeof subModule.dimensions[prop] !== 'number') {
                return { valid: false, error: `Dimension ${prop} must be a number` };
            }
        }

        // Check that position is valid
        const validPositions = ['central', 'left', 'right', 'front', 'rear'];
        if (!validPositions.includes(subModule.dimensions.position)) {
            return { valid: false, error: `Invalid position: ${subModule.dimensions.position}. Must be one of: ${validPositions.join(', ')}` };
        }

        return { valid: true };
    }
}

window.ModelSubModulesBuilder = ModelSubModulesBuilder;