export default class ModelBuilderUserInterfaceHtml {
    static getModelBuilderContainerHtml() {
        return `
        <div class="model-builder-modal">
          <div class="model-builder-header">
            <h2 class="model-builder-title">Rocket Module Builder</h2>
            <button class="close-button" id="closeModelBuilder">&times;</button>
          </div>
          
          <div class="model-builder-content">
            <div class="model-builder-sidebars">
                <div class="model-builder-sidebar modules active">
                    <h3>Modules</h3>
                    <div id="modulesList"></div>
                    <div class="action-buttons">
                        <button class="button-primary" id="newModuleBtn">New Module</button>
                        <button class="button-secondary" id="importModuleBtn">Import</button>
                    </div>
                </div>
                <div class="model-builder-sidebar submodules">
                    <h3>SubModules</h3>
                    <div id="subModulesList2" class="subModulesList"></div>
                    <button type="button" class="button-primary newSubModuleBtn" id="newSubModuleBtn2">Add SubModule</button>
<!--                    <div class="action-buttons">-->
<!--                        <button class="button-primary" id="newSubModuleBtn2">New Module</button>-->
<!--                        <button class="button-secondary" id="importSubModuleBtn2">Import</button>-->
<!--                    </div>-->
                </div>

            </div>
            
            <div class="model-builder-main">
              <div class="tab-container">
                <button class="tab-button active" data-tab="module">Module Details</button>
                <button class="tab-button" data-tab="submodule">SubModule Details</button>
                <button class="tab-button" data-tab="visualization">Visualization</button>
                <button class="tab-button" data-tab="export">Export</button>
              </div>
              
              <div class="tab-content active" id="moduleTab">
                <h3>Module Configuration</h3>
                <form id="moduleForm">
                  <div class="form-group">
                    <label for="moduleName">Module Name</label>
                    <input type="text" id="moduleName" name="moduleName" required>
                  </div>
                  
                  <h4>SubModules</h4>
                  <div id="subModulesList" class="subModulesList"></div>
                  <div class="action-buttons">
                    <button type="button" class="button-primary newSubModuleBtn" id="newSubModuleBtn">Add SubModule</button>
                    <button type="button" class="button-secondary" id="reuseSubModuleBtn">Reuse Existing</button>
                  </div>
                  
                  <div class="form-group action-buttons" style="margin-top: 20px;">
                    <button type="submit" class="button-primary">Save Module</button>
                    <button type="button" class="button-secondary" id="cancelModuleBtn">Cancel</button>
                    <button type="button" class="button-danger" id="deleteModuleBtn">Delete</button>
                  </div>
                </form>
              </div>
              
              <div class="tab-content" id="submoduleTab">
                <h3>SubModule Configuration</h3>
                <form id="subModuleForm">
                  <div class="form-group">
                    <label for="subModuleName">SubModule Name</label>
                    <input type="text" id="subModuleName" name="subModuleName" value="default" required>
                  </div>
                  
                  <h4>Dimensions</h4>
                  <div class="form-group">
                    <label for="altitude">Altitude (m)</label>
                    <input type="number" id="altitude" name="altitude" step="0.01" value="0"  required>
                  </div>
                  <div class="form-group">
                    <label for="height">Height (m)</label>
                    <input type="number" id="height" name="height" step="0.01" value="10"  required>
                  </div>
                  <div class="form-group">
                    <label for="diameter">Diameter (m)</label>
                    <input type="number" id="diameter" name="diameter" step="0.01" value="2"  required>
                  </div>
                  <div class="form-group">
                    <label for="position">Position</label>
                    <select id="position" name="position" required>
                      <option value="central" selected>Central</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="front">Front</option>
                      <option value="rear">Rear</option>
                    </select>
                  </div>
                  
                  <h4>Physical Properties</h4>
                  <div class="form-group">
                    <label for="m0">Empty Mass (kg)</label>
                    <input type="number" id="m0" name="m0" step="0.01" value="100"  required>
                  </div>
                  <div class="form-group">
                    <label for="mc">Fuel Mass (kg)</label>
                    <input type="number" id="mc" name="mc" step="0.01" value="100"  required>
                  </div>
                  <div class="form-group">
                    <label for="dm">Fuel Consumption (kg/s)</label>
                    <input type="number" id="dm" name="dm" step="0.01" value="10"  required>
                  </div>
                  <div class="form-group">
                    <label for="A">Front Section (m²)</label>
                    <input type="number" id="A" name="A" step="0.01" value="3"  required>
                  </div>
                  <div class="form-group">
                    <label for="F">Thrust (N)</label>
                    <input type="number" id="F" name="F" step="0.01" value="5000"  required>
                  </div>
                  <div class="form-group">
                    <label for="Cd">Drag Coefficient</label>
                    <input type="number" id="Cd" name="Cd" step="0.01" value="0.5"  required>
                  </div>
<!--                  <div class="form-group">-->
<!--                    <label for="motion">Motion Class</label>-->
<!--                    <input type="text" id="motionClass" name="motion" value="BaseMotionClass"  required>-->
<!--                  </div>-->
                  
                  <div class="form-group">
                    <label for="position">Motion Class</label>
                    <select id="motionClass" name="motion" required>
<!--                      <option value="central" selected>Central</option>-->
<!--                      <option value="left">Left</option>-->
<!--                      <option value="right">Right</option>-->
<!--                      <option value="front">Front</option>-->
<!--                      <option value="rear">Rear</option>-->
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="engineStartTime">Engine Start Time (s)</label>
                    <input type="number" id="engineStartTime" name="enginePropellingStartTime" step="0.1" value="0"  required>
                  </div>
                  <div class="form-group">
                    <label for="engineDuration">Engine Duration (s)</label>
                    <input type="number" id="engineDuration" name="enginePropellingDuration" step="0.1" value="100"  required>
                  </div>
                  
                  <div class="form-group action-buttons">
                    <button type="submit" class="button-primary">Save SubModule</button>
                    <button type="button" class="button-secondary" id="cancelSubModuleBtn">Cancel</button>
                    <button type="button" class="button-danger" id="deleteSubModuleBtn">Delete</button>
                  </div>
                </form>
              </div>
              
              <div class="tab-content" id="visualizationTab">
                <h3>Rocket Visualization</h3>
                <div class="visual-preview">
                  <div id="rocketVisualization" class="rocket-visualization"></div>
                </div>
              </div>
              
              <div class="tab-content" id="exportTab">
                <h3>Export Module Configuration</h3>
                <div class="form-group">
                  <label for="exportSelect">Select Module to Export</label>
                  <select id="exportSelect"></select>
                </div>
                <div class="export-options">
                  <button class="button-primary" id="exportJsonBtn">Export as JSON</button>
                  <button class="button-secondary" id="exportTextBtn">Export as Text</button>
                  <button class="button-secondary" id="copyToClipboardBtn">Copy to Clipboard</button>
                </div>
                <div class="form-group" style="margin-top: 20px;">
                  <label for="exportResult">Result</label>
                  <textarea id="exportResult" rows="10" readonly></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div class="model-builder-footer">
            <button class="button-secondary" id="closeBuilderBtn">Close</button>
            <button class="button-primary" id="saveAllBtn">Save All Changes</button>
          </div>
        </div>
      `;
    }

    static getReuseSubModuleHtml(options) {
        return `
      <h3>Select a SubModule to Reuse</h3>
      <div class="form-group">
        <label for="reuseSubModuleSelect">SubModule</label>
        <select id="reuseSubModuleSelect">${options}</select>
      </div>
      <div class="confirmation-actions">
        <button class="button-secondary" id="cancelReuseBtn">Cancel</button>
        <button class="button-primary" id="confirmReuseBtn">Add to Module</button>
      </div>
    `;
    }
}

window.ModelBuilderUserInterfaceHtml = ModelBuilderUserInterfaceHtml;