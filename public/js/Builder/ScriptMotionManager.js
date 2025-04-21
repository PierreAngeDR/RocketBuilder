
import MotionEditorUserInterface from "./MotionEditor/MotionEditorUserInterface.js";
import ExtensionBase from "./ExtensionBase.js";


export default class ScriptMotionManager extends ExtensionBase {
    static defaultId = 'rocket-script-motion-editor-button';
    managerUiId = 'script-motion-ui';

    notLoggedInMessage = "Vous devez d'abord vous connecter pour créer/modifier un modèle de Motion."

    async init() {
        if (this.createInterfaceElement(this.managerUiId)) {

            // Initialize the Model Builder
            const scriptMotionUi = new MotionEditorUserInterface(this.managerUiId, this.storageManager);
            await scriptMotionUi.init();

            // Make it accessible globally
            window.scriptMotionUi = scriptMotionUi;

            // Set up the click handler for the open button
            document.getElementById(this.getCurrentId()).addEventListener('click', () => {
                console.log('Click')
                scriptMotionUi.openModal();
            });
        }
    }
}

window.ScriptMotionManager = ScriptMotionManager;