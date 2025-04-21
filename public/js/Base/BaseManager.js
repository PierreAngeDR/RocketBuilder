export default class BaseManager {
    /**
     *
     * @type {ModelStorageManager}
     */
    static modelStorageManager = null;


    static _isLoaded = false;


    static setLoaded() {
        this._isLoaded = true;
    }

    static isLoaded() {
        return this._isLoaded;
    }

    static initModelStorageManager(storageManager = null) {
        this.modelStorageManager = storageManager || null;
    }

    /**
     *
     * @param {string} type
     * @returns {BuilderModule[]|BuilderSubModule[]||motionScript[]}
     */
    static getSearchType(type = 'unknown') {
        /**
         *
         * @type {null|BuilderModule[]||BuilderSubModule[]||motionScript[]}
         */
        let toSearchIn = null;

        switch (type) {
            case 'module' :
                toSearchIn = this.modules;
                break;
            case 'subModule' :
                toSearchIn = this.subModules;
                break;
            case 'motionScript':
                toSearchIn = this.motionScripts;
                break;
        }

        if (null === toSearchIn) {
            throw new Error(`Invalid search type  '${type}'.`);
        }

        return toSearchIn;
    }

    /**
     *
     * @param {string} elementName
     * @param {string} type
     * @returns {boolean}
     */
    static elementWithSameNameExists(elementName, type) {
        console.log('Testing elementName', elementName)
        return this.getSearchType(type).find(element => element.getName() === elementName) || false;
    }

    /**
     *
     * @param {string} type
     * @param {boolean} withSpace
     * @returns {string}
     */
    static findAvailableNewElementName(type, withSpace = true) {
        let newElementName = null;
        switch (type) {
            case 'module' :
                newElementName = this.defaultNewModuleName;
                break;
            case 'subModule' :
                newElementName = this.defaultNewSubModuleName;
                break;
            case 'motionScript' :
                newElementName = this.defaultMotionScriptName;
                break;
        }
        if (null === newElementName) {
            throw new Error(`Invalid newModuleName. Type '${type}' is unknown.`);
        }

        let i = 1;
        let finalNewModuleName = newElementName;
        while (this.elementWithSameNameExists(finalNewModuleName = newElementName+(withSpace ? ' ':'')+i, type)) {
            i++;
        }
        return finalNewModuleName;
    }

}

window.BaseManager = BaseManager;