import ModelModulesBuilder from './ModelModulesBuilder.js';
import ModelSubModulesBuilder from './ModelSubModulesBuilder.js';
import ModelStorageManager from '../Storage/ModelStorageManager.js';
import ModelBuilderUserInterfaceHtml from "./ModelBuilderUserInterfaceHtml.js";
import ModulesManager from "./ModulesManager.js";
import MotionScriptsManager from "../MotionEditor/MotionScriptsManager.js";

export default class ModelBuilderUserInterface {
    defaultSubModuleValues = {
        name: ModulesManager.findAvailableNewElementName('subModule'),
        dimensions: {
            altitude: 0,
            height: 1,
            diameter: 1,
            position: 'central'
        },
        m0: 0,
        mc: 0,
        dm: 0,
        A: 1,
        F: 0,
        Cd: 0.5,
        motion: 'DefaultMotion',
        enginePropellingStartTime: 0,
        enginePropellingDuration: 0
    };

    /**
     *
     * @type {BuilderModule}
     */
    activeModule = null;
    /**
     *
     * @type {BuilderSubModule}
     */
    activeSubModule = null;

    /**
     *
     * @type {HTMLElement}
     */
    uiInterfaceContainer = undefined;

    constructor(containerId, storageManager) {
        console.log('Creating ModelBuilderUserInterface', storageManager);
        this.containerId = containerId;
        this.storageManager = storageManager;
        ModulesManager.initModelStorageManager(this.storageManager);
        this.moduleBuilder = new ModelModulesBuilder(this.storageManager);
        this.subModuleBuilder = new ModelSubModulesBuilder(this.storageManager);

        this.activeModule = null;
        this.activeSubModule = null;
        this.activeTab = 'module';

        this.initialized = false;

        document.addEventListener('onMotionScriptsChanged', () => this.onMotionScriptsChanged());
    }

    async init() {
        await this.moduleBuilder.init();
        await this.subModuleBuilder.init();
        ModulesManager.assignModulesSubModules();
        this.initializeUI();
    }

    onMotionScriptsChanged() {
        let existingMotionClasses = MotionScriptsManager.getMotionScriptsNames();
        let motionClassOptionElements = this.querySelectorAll('.motionClassItem');

        // First, remove elements if not in existingMotionClasses
        let availableMotionClasses = [];
        for(const motionClassOptionElement of motionClassOptionElements) {
            let value = motionClassOptionElement.value;
            if (!existingMotionClasses.includes(value)) {
                motionClassOptionElement.remove();
            } else {
                !availableMotionClasses.includes(value)&&availableMotionClasses.push(value);
            }
        }

        // Then, create new one if some missing
        existingMotionClasses.forEach(motionClass => {
            console.log('onMotionScriptsChanged', motionClass, availableMotionClasses)
            if (!availableMotionClasses.some(availableMotionClass => availableMotionClass === motionClass)) {
                console.log('create new motionClassItem', motionClass)
                let newOptionElement = document.createElement('option');
                newOptionElement.textContent = motionClass;
                newOptionElement.className = 'motionClassItem';
                newOptionElement.value = motionClass;
                this.getElementById('motionClass').appendChild(newOptionElement);
            }
        });
    }

    initializeUI() {
        // Create the model builder container if it doesn't exist
        if (!this.uiInterfaceContainer) {
            this.uiInterfaceContainer = document.createElement('div');
            this.uiInterfaceContainer.id = 'modelBuilderContainer';
            this.uiInterfaceContainer.className = 'model-builder-overlay';

            this.uiInterfaceContainer.innerHTML = ModelBuilderUserInterfaceHtml.getModelBuilderContainerHtml();

            document.getElementById(this.containerId).appendChild(this.uiInterfaceContainer);

            // Add event listeners
            this.addEventListeners();
        }

        this.initialized = true;
    }
    getElementById(id) {
        if (!this.initialized) {
            this.initializeUI();
        }
        if (id === 'modelBuilderContainer') {
            return this.uiInterfaceContainer;
        }
        return this.uiInterfaceContainer.querySelector('#' + id);
    }
    querySelectorAll(selector) {
        if (!this.initialized) {
            this.initializeUI();
        }
        return this.uiInterfaceContainer.querySelectorAll(selector);
    }

    addEventListeners() {
        // Close buttons
        this.getElementById('closeModelBuilder').addEventListener('click', () => this.hideModelBuilder());
        this.getElementById('closeBuilderBtn').addEventListener('click', () => this.hideModelBuilder());

        // Tab switching
        const tabButtons = this.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // BuilderModule form
        this.getElementById('moduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveModule();
        });

        // SubModule form
        this.getElementById('subModuleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSubModule();
        });

        // BuilderModule actions
        this.getElementById('newModuleBtn').addEventListener('click', () => this.createNewModule());
        this.getElementById('importModuleBtn').addEventListener('click', () => this.importModule());
        this.getElementById('deleteModuleBtn').addEventListener('click', () => this.deleteModule());
        this.getElementById('cancelModuleBtn').addEventListener('click', () => this.cancelModuleEdit());

        // SubModule actions
        //this.getElementById('newSubModuleBtn').addEventListener('click', () => this.createNewSubModule());
        this.querySelectorAll('.newSubModuleBtn').forEach(newSubModuleBtn => newSubModuleBtn.addEventListener('click', () => this.createNewSubModule()) );
        this.getElementById('reuseSubModuleBtn').addEventListener('click', () => this.reuseSubModule());
        this.getElementById('deleteSubModuleBtn').addEventListener('click', () => this.deleteSubModule());
        this.getElementById('cancelSubModuleBtn').addEventListener('click', () => this.cancelSubModuleEdit());

        // Export actions
        this.getElementById('exportJsonBtn').addEventListener('click', () => this.exportAsJson());
        this.getElementById('exportTextBtn').addEventListener('click', () => this.exportAsText());
        this.getElementById('copyToClipboardBtn').addEventListener('click', () => this.copyToClipboard());

        // Save all changes
        this.getElementById('saveAllBtn').addEventListener('click', () => this.saveAllChanges());
    }

    showModelBuilder() {
        const container = this.getElementById('modelBuilderContainer');
        container.classList.add('active');
        this.refreshModulesList();
    }

    hideModelBuilder() {
        const container = this.getElementById('modelBuilderContainer');
        container.classList.remove('active');
    }

    switchTab(tab) {
        // Update active tab button
        this.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
                // Handle sidebar
                this.querySelectorAll('.model-builder-sidebar').forEach(sidebar => sidebar.classList.remove('active'));
                switch(btn.dataset.tab) {
                    case 'submodule':
                        console.log(this.querySelectorAll('.model-builder-sidebar.submodules'))
                        this.querySelectorAll('.model-builder-sidebar.submodules')[0].classList.add('active');
                        break;
                    default:
                        console.log(this.querySelectorAll('.model-builder-sidebar.motionScripts'))
                        //this.querySelectorAll('.model-builder-sidebar.motionScripts')[0].classList.add('active');
                        this.querySelectorAll('.model-builder-sidebar.modules')[0].classList.add('active');
                        break;
                }
                if (btn.dataset.tab === 'submodule') {

                }
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active tab content
        this.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `${tab}Tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.activeTab = tab;

        // If switching to visualization, update the preview
        if (tab === 'visualization') {
            this.updateVisualization();
        }

        // If switching to export, update the export select options
        if (tab === 'export') {
            this.updateExportOptions();
        }
    }

    refreshModulesList() {
        const modulesList = this.getElementById('modulesList');
        modulesList.innerHTML = '';

        const modules = this.moduleBuilder.getAllModules();

        if (modules.length === 0) {
            modulesList.innerHTML = '<p>No motionScripts created yet.</p>';
            return;
        }

        modules.forEach(module => {
            const moduleItem = document.createElement('div');
            moduleItem.className = 'module-item';
            if (this.activeModule && this.activeModule.getName() === module.getName()) {
                moduleItem.classList.add('active');
            }

            moduleItem.textContent = module.getName();
            moduleItem.addEventListener('click', () => this.selectModule(module));

            modulesList.appendChild(moduleItem);
        });
    }

    selectModule(module) {
        this.activeModule = module;
        this.activeSubModule = null;

        // Update UI
        this.querySelectorAll('.module-item').forEach(item => {
            if (item.textContent === module.getName()) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Fill module form
        this.getElementById('moduleName').value = module.getName();

        // Refresh submodules list
        this.refreshSubModulesList();

        // Switch to module tab
        this.switchTab('module');
    }

    refreshSubModulesList() {
        //const subModulesList = this.getElementById('subModulesList');
        const subModulesLists = this.querySelectorAll('.subModulesList');
        //subModulesList.innerHTML = '';
        subModulesLists.forEach(subModulesList => subModulesList.innerHTML = '');

        if (!this.activeModule || this.activeModule.getSubModules().length === 0) {
            //subModulesList.innerHTML = '<p>No submodules added to this module.</p>';
            subModulesLists.forEach(subModulesList => subModulesList.innerHTML = '<p>No submodules added to this module.</p>');
            return;
        }

        console.log('refreshSubModulesList', this.activeModule);

        this.activeModule.getSubModules().forEach((subModule, index) => {
            console.log('refreshSubModulesList', subModule);
            const subModuleItem = document.createElement('div');
            subModuleItem.className = 'module-item';
            if (this.activeSubModule && this.activeSubModule.getName() === subModule.getName()) {
                subModuleItem.classList.add('active');
            }

            subModuleItem.textContent = subModule.getName();
            subModuleItem.addEventListener('click', () => this.selectSubModule(subModule));

            //subModulesList.appendChild(subModuleItem);
            subModulesLists.forEach(subModulesList => {
                let clonedSubModuleItem = subModuleItem.cloneNode(true);
                clonedSubModuleItem.addEventListener('click', () => subModuleItem.click());
                subModulesList.appendChild(clonedSubModuleItem)
            });
        });
    }

    /**
     *
     * @param {BuilderSubModule} subModule
     */
    selectSubModule(subModule) {
        this.activeSubModule = subModule;

        // Update UI
        this.querySelectorAll('#subModulesList .module-item').forEach(item => {
            if (item.textContent === subModule.getName()) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        let subModuleData = subModule.getData();
        // Fill submodule form
        this.getElementById('subModuleName').value = subModule.getName();
        this.getElementById('altitude').value = subModuleData.dimensions.altitude;
        this.getElementById('height').value = subModuleData.dimensions.height;
        this.getElementById('diameter').value = subModuleData.dimensions.diameter;
        this.getElementById('position').value = subModuleData.dimensions.position;
        this.getElementById('m0').value = subModuleData.m0;
        this.getElementById('mc').value = subModuleData.mc;
        this.getElementById('dm').value = subModuleData.dm;
        this.getElementById('A').value = subModuleData.A;
        this.getElementById('F').value = typeof subModuleData.F === 'function' ? 'custom function' : subModuleData.F;
        this.getElementById('Cd').value = subModuleData.Cd;

        //this.getElementById('motionClass').value = subModuleData.motion;
        let motionScripts = subModule.getMotionScripts();
        console.log('motionScripts',motionScripts)
        this.getElementById('motionClass').value = (motionScripts.length > 0) ? motionScripts[0].getName() : '';
        this.getElementById('engineStartTime').value = subModuleData.enginePropellingStartTime;
        this.getElementById('engineDuration').value = subModuleData.enginePropellingDuration;

        // Switch to submodule tab
        this.switchTab('submodule');
    }

    createNewModule() {
        //this.activeModule = { name: 'New BuilderModule', motionScripts: [] };
        this.activeModule = ModulesManager.newModule();
        this.activeSubModule = null;
        console.log('createNewModule', this.activeModule);

        // Clear form
        this.getElementById('moduleName').value = this.activeModule.getName();

        // Refresh submodules list
        this.refreshSubModulesList();

        // Switch to module tab
        this.switchTab('module');
    }

    createNewSubModule() {
        if (!this.activeModule) {
            alert('Please create or select a module first.');
            return;
        }

        //this.activeSubModule = ModulesManager.newSubModule(this.defaultSubModuleValues.name, this.defaultSubModuleValues);
        this.activeSubModule = ModulesManager.newSubModule(null, this.defaultSubModuleValues);

        console.log('Got new subModule', this.activeModule, this.activeModule.getName());

        // Fill submodule form with default values
        this.getElementById('subModuleName').value = this.activeSubModule.getName();
        this.getElementById('altitude').value = this.defaultSubModuleValues.dimensions.altitude;
        this.getElementById('height').value = this.defaultSubModuleValues.dimensions.height;
        this.getElementById('diameter').value = this.defaultSubModuleValues.dimensions.diameter;
        this.getElementById('position').value = this.defaultSubModuleValues.dimensions.position;
        this.getElementById('m0').value = this.defaultSubModuleValues.m0;
        this.getElementById('mc').value = this.defaultSubModuleValues.mc;
        this.getElementById('dm').value = this.defaultSubModuleValues.dm;
        this.getElementById('A').value = this.defaultSubModuleValues.A;
        this.getElementById('F').value = this.defaultSubModuleValues.F;
        this.getElementById('Cd').value = this.defaultSubModuleValues.Cd;
        //this.getElementById('motionClass').value = this.defaultSubModuleValues.motion;
        this.getElementById('motionClass').value = '';
        this.getElementById('engineStartTime').value = this.defaultSubModuleValues.enginePropellingStartTime;
        this.getElementById('engineDuration').value = this.defaultSubModuleValues.enginePropellingDuration;

        // Switch to submodule tab
        this.switchTab('submodule');
    }

    saveModule() {
        console.log('saveModule');
        const moduleName = this.getElementById('moduleName').value;

        if (!moduleName) {
            alert('BuilderModule name is required.');
            return;
        }

        if (this.activeModule) {
            // Update existing module
            console.log('ModelBuilder.updateMotionScript')
            // this.activeModule.name = moduleName;
            // this.moduleBuilder.updateMotionScript(this.activeModule);
            this.activeModule.setName(moduleName);
            // TODO : refactor with ModulesManager
            this.moduleBuilder.addModule(this.activeModule);
        } else {
            // Create new module
            console.log('ModelBuilder.addMotionScript')
            try {
                this.activeModule = ModulesManager.newModule(moduleName);
            }
            catch (error) {
                alert(`Error creating module: ${error.message}`);
                return;
            }
            // TODO : refactor with ModulesManager
            this.moduleBuilder.addModule(this.activeModule);
        }
        this.activeModule.save();

        this.refreshModulesList();
    }

    async saveSubModule() {
        let uiInterfaceContainer = this.getElementById('modelBuilderContainer');
        const subModuleName = uiInterfaceContainer.querySelector('#subModuleName').value.trim();

        if (!subModuleName) {
            alert('SubModule name is required.');
            return;
        }

        if (!this.activeModule) {
            alert('Please create or select a module first.');
            return;
        }

        // TODO = assign motionScritp to subModule
        let motionScriptClass = this.getElementById('motionClass').value;
        const subModuleData = {
            dimensions: {
                altitude: parseFloat(this.getElementById('altitude').value),
                height: parseFloat(this.getElementById('height').value),
                diameter: parseFloat(this.getElementById('diameter').value),
                position: this.getElementById('position').value
            },
            m0: parseFloat(this.getElementById('m0').value),
            mc: parseFloat(this.getElementById('mc').value),
            dm: parseFloat(this.getElementById('dm').value),
            A: parseFloat(this.getElementById('A').value),
            F: parseFloat(this.getElementById('F').value),
            Cd: parseFloat(this.getElementById('Cd').value),
            motion: motionScriptClass,
            enginePropellingStartTime: parseFloat(this.getElementById('engineStartTime').value),
            enginePropellingDuration: parseFloat(this.getElementById('engineDuration').value)
        };

        // console.log('saveSubModule', this.activeModule, this.activeSubModule, subModuleName, subModuleData, this.getElementById('altitude').value);
        // console.log('--')

        if (this.activeSubModule) {
            // Update existing submodule
            this.activeSubModule.setData(subModuleData);
            this.activeSubModule.setName(subModuleName);
            this.activeModule.addSubModule(this.activeSubModule);
        } else {
            this.activeSubModule = ModulesManager.newSubModule(subModuleName, subModuleData);
            this.activeModule.addSubModule(this.activeSubModule);
        }

        if (motionScriptClass && motionScriptClass !== '') {
            console.log('---->', this.activeSubModule)
            this.activeSubModule.addMotionScript(MotionScriptsManager.getMotionScriptByName(motionScriptClass));
        }

        console.log('saveSubModule', this.activeModule, this.activeSubModule, this.activeSubModule.id, subModuleName, subModuleData);
        await this.activeSubModule.save();

        this.moduleBuilder.updateModule(this.activeModule);
        this.refreshSubModulesList();
    }

    deleteModule() {
        if (!this.activeModule) {
            alert('Please select a module to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete module "${this.activeModule.getName()}"?`)) {
            this.moduleBuilder.deleteModule(this.activeModule.getName());
            this.activeModule = null;
            this.activeSubModule = null;
            this.refreshModulesList();
            this.refreshSubModulesList();
            alert('BuilderModule deleted.');
        }
    }

    deleteSubModule() {
        if (!this.activeModule || !this.activeSubModule) {
            alert('Please select a submodule to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete submodule "${this.activeSubModule.getName()}"?`)) {
            const index = this.activeModule.getSubModules().findIndex(sm => sm.getName() === this.activeSubModule.getName());
            if (index !== -1) {
                //this.activeModule.modules.splice(index, 1);
                this.activeModule.deleteSubModule(this.activeSubModule);
                this.moduleBuilder.updateModule(this.activeModule);
            }

            this.subModuleBuilder.deleteSubModule(this.activeSubModule.getName());
            this.activeSubModule = null;
            this.refreshSubModulesList();
            alert('SubModule deleted.');
            this.switchTab('module');
        }
    }

    cancelModuleEdit() {
        this.activeModule = null;
        this.getElementById('moduleForm').reset();
        this.refreshModulesList();
        this.refreshSubModulesList();
    }

    cancelSubModuleEdit() {
        this.activeSubModule = null;
        this.getElementById('subModuleForm').reset();
        this.refreshSubModulesList();
        this.switchTab('module');
    }

    importModule() {
        alert('Not implemented yet.');
        return;
        // TODO : refactor with ModulesManager
        const importData = prompt('Paste JSON module configuration:');
        if (!importData) return;

        try {
            const moduleData = JSON.parse(importData);
            this.moduleBuilder.addModule(moduleData);
            this.refreshModulesList();
            alert('BuilderModule imported successfully.');

        } catch (error) {
            alert(`Import failed: ${error.message}`);
        }
    }

    reuseSubModule() {
        alert('Not implemented yet.');
        return;
        if (!this.activeModule) {
            alert('Please create or select a module first.');
            return;
        }

        const allSubModules = this.activeModule.getSubModules();

        if (allSubModules.length === 0) {
            alert('No submodules available to reuse. Create a submodule first.');
            return;
        }

        // Create select options for all available submodules
        let options = '';
        allSubModules.forEach(subModule => {
            options += `<option value="${subModule.getName()}">${subModule.getName()}</option>`;
        });

        // Create a dialog to select a submodule
        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = ModelBuilderUserInterfaceHtml.getReuseSubModuleHtml(options);

        document.body.appendChild(dialog);
        dialog.style.display = 'block';

        // Add event listeners
        this.getElementById('cancelReuseBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        this.getElementById('confirmReuseBtn').addEventListener('click', () => {
            const selectedSubModuleName = this.getElementById('reuseSubModuleSelect').value;
            const selectedSubModule = allSubModules.find(sm => sm.getName() === selectedSubModuleName);

            if (selectedSubModule) {
                // Check if this submodule is already in the module
                const exists = this.activeModule.modules.some(sm => sm.getName() === selectedSubModule.getName());

                if (exists) {
                    alert(`SubModule "${selectedSubModule.getName()}" is already in this module.`);
                } else {
                    // Add the submodule to the current module
                    this.activeModule.addSubModule(selectedSubModule);
                    this.moduleBuilder.updateModule(this.activeModule);
                    this.refreshSubModulesList();
                    alert(`SubModule "${selectedSubModule.getName()}" added to module.`);
                }
            }

            document.body.removeChild(dialog);
        });
    }

    updateVisualization() {
        //alert('updateVisualization');
        const visualizationContainer = this.getElementById('rocketVisualization');
        visualizationContainer.innerHTML = '';

        if (!this.activeModule) {
            visualizationContainer.innerHTML = '<p>Select a module to visualize</p>';
            return;
        }

        if (this.activeModule.getSubModules().length === 0) {
            visualizationContainer.innerHTML = '<p>No submodules in this module</p>';
            return;
        }

        // Sort submodules by altitude (lowest to highest)
        //alert('updateVisualization');
        const sortedSubModules = [...this.activeModule.getSubModules()].sort((a, b) => a.data.dimensions.altitude - b.data.dimensions.altitude);

        // Calculate total height and max diameter for scaling
        let maxHeight = 0;
        let maxDiameter = 0;

        sortedSubModules.forEach(sm => {
            const topPosition = sm.data.dimensions.altitude + sm.data.dimensions.height;
            if (topPosition > maxHeight) {
                maxHeight = topPosition;
            }
            if (sm.data.dimensions.diameter > maxDiameter) {
                maxDiameter = sm.data.dimensions.diameter;
            }
        });

        // Scale factor (px per meter)
        const containerHeight = 350;
        const scale = containerHeight / maxHeight;

        // Create submodule visuals
        sortedSubModules.forEach(sm => {
            const subModuleElement = document.createElement('div');
            subModuleElement.className = 'submodule-visual';

            // Set dimensions and position
            const height = sm.data.dimensions.height * scale;
            const diameter = sm.data.dimensions.diameter * scale;
            const top = (maxHeight - (sm.data.dimensions.altitude + sm.data.dimensions.height)) * scale;

            subModuleElement.style.height = `${height}px`;
            subModuleElement.style.width = `${diameter}px`;
            subModuleElement.style.borderRadius = '5px';
            subModuleElement.style.position = 'absolute';
            subModuleElement.style.bottom = `${top}px`;

            // Position horizontally based on the 'position' property
            switch(sm.data.dimensions.position) {
                case 'central':
                    subModuleElement.style.left = '50%';
                    subModuleElement.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    subModuleElement.style.left = '30%';
                    subModuleElement.style.transform = 'translateX(-50%)';
                    break;
                case 'right':
                    subModuleElement.style.left = '70%';
                    subModuleElement.style.transform = 'translateX(-50%)';
                    break;
                case 'front':
                    subModuleElement.style.left = '40%';
                    subModuleElement.style.transform = 'translateX(-50%)';
                    break;
                case 'rear':
                    subModuleElement.style.left = '60%';
                    subModuleElement.style.transform = 'translateX(-50%)';
                    break;
            }

            // Add tooltip with info
            subModuleElement.title = `${sm.getName()}\nHeight: ${sm.data.dimensions.height}m\nDiameter: ${sm.data.dimensions.diameter}m\nPosition: ${sm.data.dimensions.position}`;

            // Add click handler to select this submodule
            subModuleElement.addEventListener('click', () => {
                console.log('selectSubModule', sm);
                this.selectSubModule(sm);
            });

            visualizationContainer.appendChild(subModuleElement);
        });
    }

    updateExportOptions() {
        const exportSelect = this.getElementById('exportSelect');
        exportSelect.innerHTML = '';

        const modules = this.moduleBuilder.getAllModules();

        modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.getName();
            option.textContent = module.getName();
            exportSelect.appendChild(option);
        });
    }

    exportAsJson() {
        const selectedModuleName = this.getElementById('exportSelect').value;

        if (!selectedModuleName) {
            alert('Please select a module to export.');
            return;
        }

        const module = this.moduleBuilder.getModule(selectedModuleName);

        if (module) {
            const exportResult = this.getElementById('exportResult');
            exportResult.value = JSON.stringify(module, null, 2);
        }
    }

    exportAsText() {
        const selectedModuleName = this.getElementById('exportSelect').value;

        if (!selectedModuleName) {
            alert('Please select a module to export.');
            return;
        }

        const module = this.moduleBuilder.getModule(selectedModuleName);

        if (module) {
            let text = `Module: ${module.getName()}\n\nSubModules:\n`;

            module.modules.forEach((sm, index) => {
                text += `\n${index + 1}. ${sm.getName()}\n`;
                text += `   Dimensions: altitude=${sm.dimensions.altitude}m, height=${sm.dimensions.height}m, diameter=${sm.dimensions.diameter}m, position=${sm.dimensions.position}\n`;
                text += `   Empty Mass: ${sm.m0}kg\n`;
                text += `   Fuel Mass: ${sm.mc}kg\n`;
                text += `   Fuel Consumption: ${sm.dm}kg/s\n`;
                text += `   Front Section: ${sm.A}m²\n`;
                text += `   Thrust: ${typeof sm.F === 'function' ? 'Custom function' : sm.F + 'N'}\n`;
                text += `   Drag Coefficient: ${sm.Cd}\n`;
                text += `   Motion Class: ${sm.motion}\n`;
                text += `   Engine Start: ${sm.enginePropellingStartTime}s\n`;
                text += `   Engine Duration: ${sm.enginePropellingDuration}s\n`;
            });

            const exportResult = this.getElementById('exportResult');
            exportResult.value = text;
        }
    }

    copyToClipboard() {
        const exportResult = this.getElementById('exportResult');

        if (!exportResult.value) {
            alert('Nothing to copy. Export a module first.');
            return;
        }

        exportResult.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    }

    saveAllChanges() {
        this.storageManager.saveAllData(
            this.moduleBuilder.getAllModules(),
            this.subModuleBuilder.getAllSubModules()
        );
        alert('All changes saved.');
    }
}
window.ModelBuilderUserInterface = ModelBuilderUserInterface;