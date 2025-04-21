import MotionEditorUserInterfaceHtml from "./MotionEditorUserInterfaceHtml.js";
import AceCodeBlock from "./AceCodeBlock.js";
import MotionScriptsManager from "./MotionScriptsManager.js"
import BuilderMotionScript from "./BuilderMotionScript.js";
import ModelMotionScriptsBuilder from "./ModelMotionScriptsBuilder.js";
import MotionScriptsManager from "./MotionScriptsManager.js"

export default class MotionEditorUserInterface {
    uiInterfaceContainerId = null;
    uiInterfaceContainer = null;
    storageManager = null;

    constructor(containerId, storageManager) {
        this.uiInterfaceContainerId = containerId;
        this.storageManager = storageManager;

        MotionScriptsManager.initModelStorageManager(storageManager);
        this.motionScriptBuilder = new ModelMotionScriptsBuilder(this.storageManager);

        this.scripts = [];
        this.openScripts = {};
        this.activeTabId = null;
        this.editors = {};
    }

    async init() {
        //await this.fetchScripts();
        await this.motionScriptBuilder.init();
        MotionScriptsManager.assignScriptSubModules();

        this.initializeUI();
        this.renderScriptsList();
        this.trigChange();

    }

    trigChange() {
        let event = new Event('onMotionScriptsChanged');
        document.dispatchEvent(event);
    }


    initializeUI() {
        // Create the model builder container if it doesn't exist
        if (!this.uiInterfaceContainer) {
            this.uiInterfaceContainer = document.createElement('div');
            this.uiInterfaceContainer.id = 'motionEditorUserInterfaceContainer';
            //this.uiInterfaceContainer.className = 'model-builder-overlay';
            this.uiInterfaceContainer.innerHTML = MotionEditorUserInterfaceHtml.getModelBuilderContainerHtml();

            console.log('this.uiInterfaceContainerId', this.uiInterfaceContainerId, document.getElementById(this.uiInterfaceContainerId));


            document.getElementById(this.uiInterfaceContainerId).appendChild(this.uiInterfaceContainer);


            this.container = document.getElementById('js-motions-editor');
            this.scriptsList = document.getElementById('scripts-list');
            this.editorTabs = document.getElementById('editor-tabs');
            this.editorsContainer = document.getElementById('editors-container');


            this.initEventListeners();

        }

        this.initialized = true;

    }

    initEventListeners() {
        // Modal open/close
        //document.getElementById('open-modal-btn').addEventListener('click', () => this.openModal());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());

        // Button actions
        document.getElementById('new-script-btn').addEventListener('click', () => this.showNewScriptModal());
        document.getElementById('delete-script-btn').addEventListener('click', () => this.deleteCurrentScript());
        document.getElementById('save-script-btn').addEventListener('click', () => this.saveCurrentScript());
        document.getElementById('save-all-btn').addEventListener('click', () => this.saveAllScripts());

        // New script modal actions
        document.getElementById('cancel-new-script').addEventListener('click', () => this.closeNewScriptModal());
        document.getElementById('confirm-new-script').addEventListener('click', () => this.createNewScript());
    }

    openModal() {
        this.container.classList.remove('hidden');
    }

    closeModal() {
        this.container.classList.add('hidden');
    }

    showNewScriptModal() {
        document.getElementById('new-script-title').value = MotionScriptsManager.findAvailableNewElementName('motionScript', false);
        document.getElementById('new-script-modal').classList.remove('hidden');
    }

    closeNewScriptModal() {
        document.getElementById('new-script-modal').classList.add('hidden');
        document.getElementById('new-script-title').value = '';
    }

    renderScriptsList() {
        this.scriptsList.innerHTML = '';
        //this.scripts.forEach(script => {
        MotionScriptsManager.getMotionScripts().forEach(script => {
            console.log('script', script)
            const scriptEl = document.createElement('div');
            scriptEl.className = 'script-item p-3 border-b cursor-pointer';
            scriptEl.dataset.id = script.getInternalId();
            scriptEl.innerHTML = `
                <div class="font-medium">${script.getName()}</div>
                <div class="text-xs text-gray-500">${script.getSubModulesNames().join(', ')}</div>
            `;
            scriptEl.addEventListener('click', () => this.openScript(script));
            this.scriptsList.appendChild(scriptEl);
        });
    }

    /**
     *
     * @param {BuilderMotionScript} script
     * @returns {Promise<void>}
     */
    async openScript(script) {
        // Mark script as active in the list
        let scriptId = script.getInternalId();
        console.log('openScript', script, scriptId)

        this.updateActiveScriptInList(scriptId);

        // Check if script is already open in a tab
        if (this.openScripts[scriptId]) {
            this.activateTab(scriptId);
            return;
        }

        // Fetch script content and open in new tab
        //const content = await this.getScriptContent(script.id);

        // Create new tab
        this.createTab(script);

        // Create editor for this script
        //this.createEditor(script.id, content);
        this.createEditor(scriptId, script.getScript());

        // Track open script
        this.openScripts[scriptId] = script;

        // Activate the tab
        this.activateTab(scriptId);
    }

    /**
     *
     * @param {BuilderMotionScript} script
     */
    createTab(script) {
        let scriptId = script.getInternalId();
        const tab = document.createElement('div');
        tab.className = 'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100';
        tab.dataset.id = scriptId;
        tab.innerHTML = `
            <span class="mr-2">${script.getName()}</span>
            <button class="tab-close ml-2 rounded-full p-1 hover:bg-gray-200" data-id="${scriptId}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        // Add click event to activate tab
        tab.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.activateTab(scriptId);
            }
        });

        // Add click event for close button
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(scriptId);
        });

        this.editorTabs.appendChild(tab);
    }

    async createEditor(scriptId, content = '// Type your script here...') {
        // Create container for this editor
        const editorContainer = document.createElement('div');
        editorContainer.className = 'h-full';
        editorContainer.id = `editor-${scriptId}`;
        editorContainer.style.display = 'none'; // Hide initially

        this.editorsContainer.appendChild(editorContainer);

        // Initialize Editor.js
        let editorId = `editor-${scriptId}`;

        this.editors[scriptId] = new EditorJS({
            holder: editorId,
            autofocus: true,
            tools: {
                code: AceCodeBlock
            },
            data: {
                blocks: [
                    {
                        type: 'code',
                        data: {
                            //code: "// Tape ton JavaScript ici\nfunction hello() {\n  console.log('Salut !');\n}"
                            code: content
                        }
                    }
                ]
            }
        });

        //console.log(this.editors[scriptId])
        await this.editors[scriptId].isReady.then(editor => {
            console.log('Editor.js instance created for script', scriptId);
            console.log(editor)
            // document.getElementById(editorId).classList.add('h-full');
            // document.getElementById(editorId).querySelector('.codex-editor').classList.add('h-full');
            // document.getElementById(editorId).querySelector('.codex-editor__redactor').classList.add('h-full');
            // document.getElementById(editorId).querySelector('.ce-block').classList.add('h-full');
            // document.getElementById(editorId).querySelector('.ce-block__content').classList.add('h-full');
            // document.getElementById(editorId).querySelector('.cdx-block.ce-code').classList.add('h-full');
            // document.getElementById(editorId).querySelector('textarea').classList.add('h-full');
            //document.getElementById(editorId).querySelector('.cdx-block.ce-code > textarea').setAttribute('onInput', "this.parentNode.dataset.replicatedValue = this.value")
        })
        console.log(this.editors[scriptId])

        // let editor = this.editors[scriptId];
        // console.log('editor', editor);
        //document.getElementById(editorId).querySelector('.cdx-block.ce-code').setAttribute('onInput', "this.parentNode.dataset.replicatedValue = this.value")
    }

    activateTab(scriptId) {
        // Deactivate current active tab
        if (this.activeTabId) {
            const currentActiveTab = this.editorTabs.querySelector(`[data-id="${this.activeTabId}"]`);
            const currentActiveEditor = document.getElementById(`editor-${this.activeTabId}`);

            if (currentActiveTab) {
                currentActiveTab.classList.remove('tab-active');
            }

            if (currentActiveEditor) {
                currentActiveEditor.style.display = 'none';
            }
        }

        // Activate new tab
        const newActiveTab = this.editorTabs.querySelector(`[data-id="${scriptId}"]`);
        const newActiveEditor = document.getElementById(`editor-${scriptId}`);

        if (newActiveTab) {
            newActiveTab.classList.add('tab-active');
        }

        if (newActiveEditor) {
            newActiveEditor.style.display = 'block';
        }

        this.activeTabId = scriptId;

        // Also update the active script in the list
        this.updateActiveScriptInList(scriptId);
    }

    updateActiveScriptInList(scriptId) {
        // Remove active class from all script items
        const items = this.scriptsList.querySelectorAll('.script-item');
        items.forEach(item => item.classList.remove('active'));

        // Add active class to the clicked script
        const activeItem = this.scriptsList.querySelector(`.script-item[data-id="${scriptId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    closeTab(scriptId) {
        // Remove tab
        const tab = this.editorTabs.querySelector(`[data-id="${scriptId}"]`);
        if (tab) {
            tab.remove();
        }

        // Remove editor
        const editorContainer = document.getElementById(`editor-${scriptId}`);
        if (editorContainer) {
            editorContainer.remove();
        }

        // Clean up editor instance
        if (this.editors[scriptId]) {
            this.editors[scriptId].destroy();
            delete this.editors[scriptId];
        }

        // Remove from open scripts
        delete this.openScripts[scriptId];

        // If this was the active tab, activate another tab if available
        if (this.activeTabId === scriptId) {
            const openScriptIds = Object.keys(this.openScripts);
            if (openScriptIds.length > 0) {
                this.activateTab(openScriptIds[0]);
            } else {
                this.activeTabId = null;
            }
        }
    }

    // TODO
    async createNewScript() {
        const title = document.getElementById('new-script-title').value.trim();

        if (!title) {
            alert('Please enter a title for the script');
            return;
        }

        let newScript = MotionScriptsManager.newMotionScript(title);

        // Update scripts list
        this.renderScriptsList();

        // Close the modal
        this.closeNewScriptModal();

        // Open the new script
        this.openScript(newScript);
    }

    async saveCurrentScript() {
        if (!this.activeTabId || !this.editors[this.activeTabId]) {
            alert('No active script to save');
            return;
        }

        try {
            let currentScript = MotionScriptsManager.getMotionScriptByInternalId(this.activeTabId);
            console.log('saveCurrentScript', this, this.activeTabId, currentScript)
            const editorData = await this.editors[this.activeTabId].save();
            const scriptContent = editorData.blocks[0].data.code;
            currentScript.setScript(scriptContent);
            const savePromise = await currentScript.save();


            // Warn Document
            this.trigChange();

            // Show success message
            this.showToast('Script saved successfully!');
        } catch (error) {
            console.error('Error saving script:', error);
            alert('Failed to save script');
        }
    }

    async saveAllScripts() {
        const openScriptIds = Object.keys(this.openScripts);

        if (openScriptIds.length === 0) {
            alert('No scripts open to save');
            return;
        }

        const savePromises = openScriptIds.map(async (scriptId) => {
            try {
                const editorData = await this.editors[scriptId].save();
                const scriptContent = editorData.blocks[0].data.code;
                let script = MotionScriptsManager.getMotionScriptByInternalId(scriptId);
                script.setScript(scriptContent);
                await script.save();

                return { success: true, id: scriptId };
            } catch (error) {
                console.error(`Error saving script ${scriptId}:`, error);
                return { success: false, id: scriptId };
            }
        });

        const results = await Promise.all(savePromises);
        const allSuccessful = results.every(result => result.success);

        if (allSuccessful) {
            this.showToast('All scripts saved successfully!');

            // Warn Document
            this.trigChange();
        } else {
            const failedScripts = results.filter(result => !result.success).length;
            alert(`Failed to save ${failedScripts} script(s)`);
        }
    }

    async deleteCurrentScript() {
        if (!this.activeTabId) {
            alert('No active script to delete');
            return;
        }
        let scriptId = this.activeTabId;

        const scriptToDelete = this.openScripts[scriptId];
        if (!scriptToDelete) return;


        let script = MotionScriptsManager.getMotionScriptByInternalId(scriptId);
        let scriptName = script.getName();

        if (confirm(`Are you sure you want to delete "${scriptName}"?`)) {
            // Close the tab
            this.closeTab(scriptId);

            let isOk = await MotionScriptsManager.deleteMotionScript(script);

            console.log('Delete script', isOk)


            // Update scripts list
            this.renderScriptsList();

            // Warn document
            this.trigChange();

            this.showToast(`Script "${scriptName}" deleted`);
        }
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'js-motions-editor fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded shadow-lg';
        toast.innerHTML = message;

        // Add to body
        document.body.appendChild(toast);

        // Remove after delay
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => toast.remove(), 500);
        }, 1500);
    }

}

window.MotionEditorUserInterface = MotionEditorUserInterface;