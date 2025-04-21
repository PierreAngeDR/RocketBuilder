
import ModelStorageManager from './Storage/ModelStorageManager.js';
import ModelSubModulesBuilder from './ModelBuilder/ModelSubModulesBuilder.js';
import ModelModulesBuilder from './ModelBuilder/ModelModulesBuilder.js';
import ModelBuilderUserInterface from './ModelBuilder/ModelBuilderUserInterface.js';

// Export the model builders and storage manager for use in React components
export const initializeModelBuilder = (targetElementId) => {
    // Initialize the model builders and storage manager
    const storageManager = new ModelStorageManager();
    const subModulesBuilder = new ModelSubModulesBuilder();
    const modulesBuilder = new ModelModulesBuilder();

    // Initialize the UI with the target element ID and the builders
    const modelBuilderUI = new ModelBuilderUserInterface(
        targetElementId,
        modulesBuilder,
        subModulesBuilder,
        storageManager
    );

    return modelBuilderUI;
};

window.initializeModelBuilder = initializeModelBuilder;