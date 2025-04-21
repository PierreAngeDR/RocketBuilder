
// Import all our builder classes
import ModelBuilderUserInterface from './ModelBuilderUserInterface.js';


// Initialize function that will be called from the React component
window.initializeModelBuilder = function() {
    // Create an instance of the Model Builder UI
    const modelBuilderUI = new ModelBuilderUserInterface('root');

    // Make it accessible globally
    window.modelBuilderUI = modelBuilderUI;

    // Link the button to show the model builder
    window.showModelBuilder = function() {
        modelBuilderUI.showModelBuilder();
    };

    // If there's a button with id 'openModelBuilder', add event listener
    const openButton = document.getElementById('openModelBuilder');
    if (openButton) {
        openButton.addEventListener('click', window.showModelBuilder);
    }
};
