
/**
 *  Interactive methods
 */

import ExtensionManager from "../Builder/ExtensionManager.js";

window.updateValue = function(id) {
    rocket.getParameters().updateFromScreenId(id);
}

window.initAutoScale = function() {
    let autoScaleValue = rocket.getAutoScale();
    let autoScaleElement = document.getElementById('autoscale');
    let isChecked = autoScaleElement.getAttribute('checked') === 'checked';
    if (isChecked !== autoScaleValue) {
        autoScaleElement.click();
    }
}

window.autoScale = function(id, scaleWrapperId) {
    let element = document.getElementById(id);
    let scaleWrapper = document.getElementById(scaleWrapperId);
    if (element.getAttribute('checked') === 'checked' ) {
        scaleWrapper.classList.remove('hidden');
        element.setAttribute('checked', '')
        rocket.setAutoScale(false);
    } else {
        scaleWrapper.classList.add('hidden');
        element.setAttribute('checked', 'checked')
        rocket.setAutoScale(true);
    }

}

window.zoomIn = function() {
    rocket.zoomIn();
}

window.zoomOut = function() {
    rocket.zoomOut();
}

window.reloadCharts = function() {
    rocket.drawCharts()
}

window.showGrid = function(gridId, gridTitle, paramName, titleAddOn='') {
    let stepElement = document.getElementById('step');
    let stepValue = stepElement.value;
    rocket.showGrid(gridId, gridTitle, paramName, stepValue, titleAddOn);
}

window.printGrid = function(gridId) {
    rocket.printGrid(gridId);
}

window.downloadPdfGrid = function(gridId) {
    rocket.downloadGrid(gridId, 'pdf');
}

window.downloadXlsxGrid = function(gridId) {
    rocket.downloadGrid(gridId, 'xlsx');
}

window.downloadCsvGrid = function(gridId) {
    rocket.downloadGrid(gridId, 'csv');
}

window.downloadJsonGrid = function(gridId) {
    rocket.downloadGrid(gridId, 'json');
}

window.runAll = async function() {
    //await rocket.runMethods([{name:'Euler', color:'red'}, {name:'Heun', color:'blue'}, {name:'RK4', color:'green'}])
    disableControls(true);
    await rocket.runMethods(()=>window.disableControls(false))


}

window.disableControls = function(off = true) {
    let controlIds = ['language-select', 'rocketMass', 'fuel', 'fuelConsumption', 'frontSection', 'thrust', 'step', 'rocket-select', 'rocket-buttons']
    controlIds.forEach(id => {
        console.log('Disabling', id);
        let element = document.getElementById(id);
        if (null !== element) {
            console.log(element)
            element.disabled = off;
        } else {
            console.log(`Could not find element "${id}"`)
        }
    })
}

window.updateLanguage = function(newLanguage, updateRocketLanguage = true) {
    for(const [key, value] of Object.entries(window.RocketLanguages)) {
        let elements = document.querySelectorAll('.'+key);
        for(let i=0;i<elements.length;i++) {
            if ((typeof elements[i] !== 'undefined')&&(null !== elements[i])) {
                elements[i].innerText = value[newLanguage];
            }
        }
    }
    updateRocketLanguage && rocket.updateLanguage(newLanguage);
}

window.onMenuAction = function(action) {
    console.log('onMenuAction', action);
    switch (action) {
        case 'model-builder': window.extensionManager&&window.extensionManager.clickModelBuilder(); break;
        case 'motion-scripts': window.extensionManager&&window.extensionManager.clickScriptMotionBuilder(); break;
        case 'application-login': window.location.href = '/login'; break;
        case 'application-logout': window.location.href = '/logout'; break;
        case 'application-info': window.location.href = '/info'; break;
    }

}

let rocketSelect = document.getElementById('rocket-select');
rocketSelect.addEventListener("change", (event)=>{
    rocket.useModel(event.target.value);
    updateValue('rocket-select')
});

let languageSelect = document.getElementById('language-select');
languageSelect.addEventListener("change", (event)=>{
    updateLanguage(event.target.value);
});
document.addEventListener("init-languages", (event)=>{
    updateLanguage(languageSelect.value, false);
});
addEventListener("resize", (event) => {
    rocket&&rocket.onResize(window.innerWidth, window.innerHeight)
});


/**
 *  End Interactive methods
 */