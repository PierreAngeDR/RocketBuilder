import ParameteredRocket from "../Parameter/ParameteredRocket.js";
import RocketParameters from '../Parameter/RocketParameters.js';
import RocketRepresentation from '../Graphics/RocketRepresentation.js';
import RocketChart from '../Chart/RocketChart.js';
import RocketDataTable from '../DataTable/RocketDataTable.js';
import {formatNumbers} from '../Utils/MemUtils.js'

/**
 * @class
 * @extends {ParameteredRocket}
 */
export default class VisualRocket extends ParameteredRocket {
    /**
     * @type {RocketRepresentation}
     */
    view;
    /**
     * @type {RocketChart}
     */
    charts;
    /**
     * @type {RocketDataTable}
     */

    /**
     *
     * @type {{}[]}
     */
    updatableScreenVariables = [];
    dataTable;
    languageInitialized;
    constructor() {
        super(new RocketParameters());

        this.setLanguageInitialized(false);

        this.commonParameters.addVariable('representationCanvasWidth', window.innerWidth);
        this.commonParameters.addVariable('representationCanvasHeight', window.innerHeight);

        this.view = new RocketRepresentation(this.getParameters());

        this.charts = new RocketChart(this.getParameters());

        this.dataTable = new RocketDataTable(this.getParameters());
    }

    /**
     * // was returning {Promise<void>}
     *
     * @param callback
     * @returns {this}
     */
    onLoaded = async (callback) => {
        this.getParameters().isLoaded() ? await callback.apply(this) : setTimeout(async ()=>this.onLoaded(callback), 10)
    }

    /**
     *
     * @param width
     * @param height
     * @returns {this}
     */
    onResize = (width, height) => {
        this.commonParameters.setRepresentationCanvasWidth(width);
        this.commonParameters.setRepresentationCanvasHeight(height);

        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    configureViewScale(...args) {
        //console.log(this, this.view);
        this.view.configureScale.apply(this.view, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addLinearChart(...args) {
        args.unshift('linear');
        this.charts.addChart.apply(this.charts, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addLogarithmicChart(...args) {
        args.unshift('logarithmic');
        this.charts.addChart.apply(this.charts, args);
        return this;
    }

    /**
     *
     * @param label
     * @param source
     * @param color
     * @param isMainSource
     * @returns {this}
     */
    addSource(label, source, color, isMainSource=false) {
        source = source.bind(this.getParameters());
        this.charts.addSource(source, label, color);
        this.dataTable.addSource(label, source, isMainSource);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addChartSource(...args) {
        this.charts.addSource.apply(this.charts, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addDataTableSource(...args) {
        this.dataTable.addSource.apply(this.dataTable, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    setDataTableColumnsConfiguration(...args) {
        this.dataTable.setColumnsConfiguration.apply(this.dataTable, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    showGrid(...args) {
        console.log('showGrid', args);
        this.dataTable.showGrid.apply(this.dataTable, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    printGrid(...args) {
        this.dataTable.printGrid.apply(this.dataTable, args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    downloadGrid(...args) {
        this.dataTable.downloadGrid.apply(this.dataTable, args);
        return this;
    }

    /**
     * @param {RocketModuleData} moduleData
     * @returns {this}
     */
    drawCharts(moduleData = null) {
        if (null === moduleData) {
            //throw new Error('No module provided to drawCharts');
            moduleData = this.studiedModuleData();

            if (null === moduleData) {
                this.warn('No module data provided to drawCharts');
                return this;
            }
        }

        this.charts.drawCharts(moduleData);
        return this;
    }

    /**
     *
     * @returns {this}
     */
    zoomIn() {
        this.view.zoomIn();
        return this;
    }

    /**
     *
     * @returns {this}
     */
    zoomOut() {
        this.view.zoomOut();
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addConstant(...args) {
        this.getParameters().addConstant.apply(this.getParameters(), args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addScreenVariable(...args) {
        this.getParameters().addScreenVariable.apply(this.getParameters(), args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addStoredVariable(...args) {
        this.getParameters().addStoredVariable.apply(this.getParameters(), args);
        return this;
    }

    /**
     * When Adding an updatable screen variable, you need to add a function to your Class that returns the result.
     * @param id
     * @param {string} varName
     * @returns {VisualRocket}
     */
    addUpdatableScreenVariable(id, varName = null) {
        const ucFirst = function(word) {
            return word.charAt(0).toUpperCase() + word.replaceAll('-', '').slice(1);
        }

        let callback = 'get'+ucFirst(id);
        if (null !== varName) {
            callback = function() {
                return this.studiedModule().getLastData(varName);
            }.bind(this);
        }

        this.updatableScreenVariables.push({
                                                id,
                                                callback,
                                                varName
                                            });
        return this;
    }

    setInputValue(id, value) {
        let input = document.getElementById(id);
        if (null !== input) {
            if (input.tagName === 'INPUT') {
                //input.setAttribute('value', value.toFixed(2));
                input.setAttribute('value', formatNumbers(value));
            } else {
                //input.innerHTML = value.toFixed(2);
                input.innerHTML = formatNumbers(value);
            }

        } else {
            this.warn('No input with id "'+id+'"');
        }
    }

    /**
     *
     * @returns {VisualRocket}
     */
    updateScreenVariables() {
        this.updatableScreenVariables.forEach((screenVariable)=>{
            if (typeof screenVariable.callback === 'function') {
                let value = screenVariable.callback.apply(this);
                this.setInputValue(screenVariable.id, value);
                return this;
            }

            let callbackName = screenVariable.callback;
            if (this.hasOwnProperty(callbackName)) {
                let callback = this[callbackName];
                if (typeof callback === 'function') {
                    let value = callback.apply(this);
                    this.setInputValue(screenVariable.id, value);
                } else {
                    this.warn('Callback "'+callbackName+'" is not a function');
                }
            }
        })
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addStoredScreenVariable(...args) {
        let onChange = (args.length>1) ? args.pop() : null;
        let varName = args[0];
        if ((null !== onChange)&&(typeof onChange === 'function')) {
            onChange = onChange.bind(this);
            if (args.length === 1) {
                args.push(varName);
            }
            args.push(onChange);
        } else {
            if (null !== onChange) {
                args.push(onChange);
            }
        }
        //console.log('Pushing, ', args)
        this.getParameters().addStoredScreenVariable.apply(this.getParameters(), args);
        return this;
    }

    /**
     *
     * @returns {this}
     */
    clearGrids() {
        this.dataTable.clear();
        return this;
    }

    clearView() {
        this.view.clear();
        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    isLanguageInitialized() {
        return (this.languageInitialized === true);
    }

    /**
     *
     * @param status
     * @returns {this}
     */
    setLanguageInitialized(status = true) {
        this.languageInitialized = status;

        return this;
    }

    studiedModule() {
        return null;
    }

    /**
     *
     * @param newLanguage
     * @returns {this}
     */
    async updateLanguage(newLanguage) {
        this.getParameters().setLanguage(newLanguage);
        await this.drawCharts(this.studiedModuleData());
        this.dataTable.isRendered() && this.dataTable.prepare(this.studiedModuleData());
        //this.dataTable.updateLanguage();
        return this;
    }

    /**
     *
     * @returns {this}
     */
    onLanguageChange() {
        this.dataTable.isRendered() && this.dataTable.updateLanguage(this.studiedModule());
        this.charts.onSettingsChanged();
        if (this.isLanguageInitialized() === false) {
            const event = new Event("init-languages");
            document.dispatchEvent(event);
        }
        this.setLanguageInitialized();
        return this;
    }

    /**
     *
     * @param newColor
     * @returns {this}
     */
    updateChartBackgroundColor(newColor) {
        this.getParameters().setChartBackgroundColor(newColor);
        this.charts.onSettingsChanged();
        return this;
    }


    /**
     *
     * @param {boolean} on
     */
    setAutoScale(on) {
        this.getParameters().setAutoScale(on);
    }


    /**
     *
     */
    getAutoScale() {
        return this.getParameters().getAutoScale();
    }
}

window.VisualRocket = VisualRocket;