export default class MotionEditorUserInterfaceHtml {
    static getModelBuilderContainerHtml() {
        return `
                <div id="js-motions-editor" class="js-motions-editor hidden">
                    <div class="modal-container">
                             <!-- New Script Modal -->
                        <div id="new-script-modal" class="new-script-modal hidden">
                            <div class="modal-form">
                                <h4 class="modal-form-title">Create New Script</h4>
                                <div class="form-group">
                                    <label class="form-label">Title</label>
                                    <input id="new-script-title" class="form-input" type="text">
                                </div>
<!--                                <div class="form-group">-->
<!--                                    <label class="form-label">SubModules (comma separated)</label>-->
<!--                                    <input id="new-script-submodules" class="form-input" type="text">-->
<!--                                </div>-->
                                <div class="form-actions">
                                    <button id="cancel-new-script" class="danger-btn">Cancel</button>
                                    <button id="confirm-new-script" class="primary-btn">Create</button>
                                </div>
                            </div>
                        </div>
                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h3 class="modal-title">Script Editor</h3>
                            <button id="close-modal-btn" class="close-btn">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Modal Content -->
                        <div class="modal-content">
                            <!-- Scripts List (Left) -->
                            <div class="scripts-sidebar">
                                <div class="sidebar-header">
                                    <h4 class="sidebar-title">Scripts</h4>
                                    <button id="new-script-btn" class="new-script-btn" title="New Script">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div id="scripts-list" class="scripts-list">
                                    <!-- Scripts will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Editor Area (Right) -->
                            <div class="editor-area">
                                <!-- Tabs -->
                                <div id="editor-tabs" class="editor-tabs">
                                    <!-- Tabs will be populated here -->
                                </div>
                                
                                <!-- Editor Container -->
                                <div id="editors-container" class="editors-container">
                                    <!-- Editors will be populated here -->
                                </div>
                                
                                <!-- Editor Controls -->
                                <div class="editor-controls">
                                    <div>
                                        <button id="delete-script-btn" class="danger-btn">
                                            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                    <div>
                                        <button id="save-script-btn" class="primary-btn">
                                            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                            </svg>
                                            Save
                                        </button>
                                        <button id="save-all-btn" class="success-btn">
                                            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                            </svg>
                                            Save All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
           
                </div>
            `;
    }

}

window.MotionEditorUserInterfaceHtml = MotionEditorUserInterfaceHtml;