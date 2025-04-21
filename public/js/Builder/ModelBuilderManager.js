
import ModelBuilderUserInterface from "./ModelBuilder/ModelBuilderUserInterface.js";
import ExtensionBase from "./ExtensionBase.js";


export default class ModelBuilderManager extends ExtensionBase {
    static defaultId = 'rocket-designer-button';
    managerUiId = 'model-builder-ui';

    notLoggedInMessage = "Vous devez d'abord vous connecter pour créer/modifier un modèle de fusée."


    async init() {
        if (this.createInterfaceElement(this.managerUiId)) {

            // Initialize the Model Builder
            const modelBuilderUI = new ModelBuilderUserInterface(this.managerUiId, this.storageManager);
            await modelBuilderUI.init();

            // Make it accessible globally
            window.modelBuilderUI = modelBuilderUI;

            // Set up the click handler for the open button
            document.getElementById(this.getCurrentId()).addEventListener('click', () => {
                modelBuilderUI.showModelBuilder();
            });

        }
    }
}


window.ModelBuilderManager = ModelBuilderManager;