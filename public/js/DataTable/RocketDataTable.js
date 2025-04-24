import RocketBase from '../Rocket/RocketBase.js';
import RocketDataTableBase from "./RocketDataTableBase.js";

export default class RocketDataTable extends RocketDataTableBase {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;



    /**
     *
     * @param {RocketModuleData} moduleData
     */
    prepare(moduleData = null) {
        this.log('Preparing RocketDataTable for data', moduleData)
        if (null === moduleData) {
            //throw new Error('No module defined to draw charts');
            this.log('No module defined to render DataTable : no moduleData provided');
            return;
        }

        moduleData.getMethods().forEach(method => {
            let moduleMethodData = moduleData.getMethodData(method);
            let label = moduleMethodData.getMethodName();
            let source = moduleMethodData.getData();
            this.addSource(label, source, moduleMethodData.isMainSource());

        });

        this.configureColumns();

        this.rendered = true;
    }

    /**
     *
     * @param label
     * @param source
     * @param isMainSource
     * @returns {this}
     */
    addSource(label, source, isMainSource = false) {
        this.sources[label] = source;
        if (isMainSource) {
            this.mainSourceLabel = label;
        }

        return this;
    }

    /**
     *
     * @param label
     * @param asFunction
     * @returns {*}
     */
    getSource(label, asFunction = true) {
        //this.log('getSource', label, asFunction)
        let func  = (label==='mainSource') && (false !== this.mainSourceLabel) ? this.sources[this.mainSourceLabel] : this.sources[label] ?? null;

        //this.log('ok', func)
        //let res =  asFunction ? func : ((null === func) ? func : func()) ;
        let res = func;
        //this.log('res', res)
        return res;
    }

    /**
     *
     * @returns {*}
     */
    getMainSource() {
        return this.getSource('mainSource');
    }

    /**
     *
     * @param titleAddOn
     * @returns {*[]}
     */
    getColumns(titleAddOn = '') {
        let formatedColumns = [];
        this.columns.forEach((column)=>{

            //console.log(`column titleAddOn : "${titleAddOn}"`, (typeof column.transformer === 'function') ? column.transformer(column.title)(titleAddOn) : column.title);

            formatedColumns.push({
                title : (typeof column.transformer === 'function') ? column.transformer(column.title)(titleAddOn) : column.title,
                field : column.field
            })
        });

        
        return formatedColumns;
    }

    /**
     *
     * @param stringSource
     * @param precision
     * @returns {(function(*): *)|(function(*, *): (*|null))|*}
     */
    getObjetValue(stringSource, precision = 2) {
        let copiedString = stringSource;
        let parts = copiedString.replace(']', '').split('[');
        if (parts.length !== 2) {
            throw new Error('Invalid RocketDataTable Source definition : '+stringSource);
        }
        let sourceName = parts[0];
        let keyName = parts[1];

        let source = this.getSource(sourceName);
        if (null === source) {
            throw new Error('Unknown Source Name : '+sourceName);
        }

        return (stringSource === 'mainSource[index]') ? 
                        (index)=>index
                    : 
                        (index, paramName)=>{
                            let key = keyName==='param' ? paramName : keyName;
                            // if ((source().length>=index) && (typeof source()[index] !== 'undefined') ) {
                            //     return source()[index][key].toFixed(precision);
                            // }
                            if ((source.length>=index) && (typeof source[index] !== 'undefined') ) {
                                return source[index][key].toFixed(precision);
                            }
                            return null;
                        };
    }

    /**
     *
     * @param newColumnsConf
     * @returns {this}
     */
    configureColumns() {
        if (this.columnsConf.length === 0) {
            return this;
        }
        let dataObject = {};
        let languages = this.commonParameters.getLanguages();
        let language = this.commonParameters.getLanguage();
        this.columns = [];

        this.columnsConf.forEach((column) => {
            let title = (languages['lg-'+column.field]&&languages['lg-'+column.field][language]) ?? column.title;
            this.columns.push({
                title: title, 
                transformer : column.transformer,
                field: column.field,
                precision: (typeof column.precision !== 'undefined') ? column.precision : this.defaultPrecision
            });

            this.log('this.columns : ', this.columns);
            let name = column.field;
            if (column.hasOwnProperty('source')) {
                this.dataObject[name] = this.getObjetValue(column.source, column.precision);
            } else {
                if (column.hasOwnProperty('callback')) {
                    this.dataObject[name] = {
                        callable : column.callback.callable.bind(this),
                    };
                }
            }
        });

        return this;
    }

    /**
     *
     * @returns {this}
     */
    updateLanguage() {
        this.configureColumns();
        this.clear();
        for (const[id, params] of Object.entries(this.gridParams)) {
            this.showGrid(id, params.gridTitle, params.paramName, params.titleAddOn);
        }
        return this;
    }

    /**
     *
     * @param paramName
     * @param {string} gridTitle
     * @returns {Promise<*[]>}
     */
    async getGridData(paramName, gridTitle) {
        let data = [];
        let mainSource = this.getMainSource();

        this.log('mainSource : ', mainSource);

        if (null === mainSource) {
            throw new Error('No mainSource found');
        }

        let increment = 1;
        if (this.getParameters().getDt()<RocketDataTableBase.MinStepToShowAllData) {
            this.printEnabled = false;
            if (this.isLocalFileLocation()) {
                increment = 10;
            }
        }

        if (increment !==1) {
            this.showToastMessage(window.Languages.get('lg-no-full-dataset'));
            this.warn('Not Showing all data. Restricting step to 0.1')
        }

        //console.log('getGridData Length', mainSource.length);

        for(let i=0;i<mainSource.length;i+=increment) {
            let newValue = {};
            for (const [key, value] of Object.entries(this.dataObject)) {
                if(typeof value === 'function') {
                    //this.log('getGridData value function : ', paramName, value);
                    newValue[key] = value(i, paramName);
                } else {
                    //this.log('getGridData value callable : ', paramName, value);
                    newValue[key] = await value.callable(i, paramName);
                }
            }
            data.push(newValue);
        }

        this.log('Processed data for '+gridTitle);

        return data;
    }

    /**
     *
     * @param gridId
     * @param gridTitle
     * @param paramName
     * @param step
     * @param titleAddOn
     * @returns {Promise<void>}
     */
    async showGrid(gridId, gridTitle, paramName, step, titleAddOn='') {
        //console.log('showGrid', gridId, gridTitle, paramName, titleAddOn);
        this.gridParams[gridId] = {
                                    title : gridTitle,
                                    paramName : paramName,
                                    step : step,
                                    titleAddOn : titleAddOn
                                }

        //this.log('this.gridParams : ', this.gridParams);
        //console.log('this.gridParams : ', this.gridParams);
        this.gridInfo[gridId] = {
                                    data: await this.getGridData(paramName, gridTitle),
                                    columns: this.getColumns(titleAddOn),
                                }
        let table  = new Tabulator('#'+gridId, {
                                                            // data: await this.getGridData(paramName, gridTitle),
                                                            // columns: this.getColumns(titleAddOn),
                                                            data : this.gridInfo[gridId].data,
                                                            columns : this.gridInfo[gridId].columns,
                                                            pagination : this.paginationEnabled,
                                                            paginationSize : this.paginationSize,
                                                        });

        this.grids[gridId] = table;
    }


    /**
     *
     */
    clear() {
        this.rendered = false;
        for(const[id, grid] of Object.entries(this.grids)) {
            let toDelete = [];
            let element = document.getElementById(id);
            for (const child of element.childNodes) {
                toDelete.push(child);
            }
            toDelete.forEach(elem=>elem.remove())
        }
    }
}

window.RocketDataTable = RocketDataTable;