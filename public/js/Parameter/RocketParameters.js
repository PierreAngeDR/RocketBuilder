import Base from "../Base/Base.js";

export default class RocketParameters extends Base {

    /**
     * Enable logging.
     * @type {boolean}
     */
    debugLog = false;


    _variables = {};
    _ids = {};
    _attachedObjects = [];
    _attachedVariables = {};
    _loadCount = 0;

    /**
     *
     * @returns {boolean}
     */
    isLoaded() {
        this._loadCount++;
        let isLoaded = true;
        for(const[key, value] of Object.entries(this._variables)) {
            isLoaded &&= value.initialized;
            if (!value.initialized && (this._loadCount>10)) {
                console.log('Not initialized', key)
            }
        }
        return isLoaded;
    }

    /**
     *
     * @param word
     * @returns {string}
     */
    ucFirst(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /**
     *
     * @param cname
     * @param cvalue
     * @param exdays
     * @returns {Promise<void>}
     */
    async storeValue(cname, cvalue) {
        await localforage.setItem(cname, cvalue);
    }

    /**
     *
     * @param cname
     * @returns {Promise<undefined|*>}
     */
    async getStoredValue(cname) {
        const result = await localforage.getItem(cname);
        if (null === result) {
            console.log('Returning undefined')
            return undefined;
        }
        return result;
    }

    /**
     *
     * @param value
     * @returns {number|string|boolean}
     */
    toRawType(value) {
        if (typeof value === 'string') {
            let val = parseFloat(value);
            if (!isNaN(val)) {
                return val;
            }
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
        }

        return value;
    }

    /**
     *
     * @param object
     * @param initObject
     * @returns {this}
     */
    attachTo(object, initObject = false) {
        this._attachedObjects.push(object);
        initObject && this.initAttachedObject(object);
        return this;
    }

    /**
     *
     * @param {string} variableName
     * @param {string} getter
     * @param {string} setter
     */
    addVariableGetterSetter(variableName, getter, setter = null) {
        let getterSetter = {getter};
        if (typeof setter !== null) {
            //console.log('Setting setter for ', variableName, setter)
            getterSetter.setter = setter;
        }

        if (typeof this._attachedVariables[variableName] == 'undefined') {
            //console.log('Adding getterSetter for ', variableName, getterSetter)
            this._attachedVariables[variableName] = getterSetter;
        }
    }

    /**
     *
     * @param object
     * @param {string} variableName
     * @param {string} getter
     * @param {string} setter
     */
    addObjectGetterSetter(object, variableName, getter, setter = null) {
        object[variableName] = (value = undefined) => {
            if (typeof value === 'undefined') {
                // Getter mode
                //console.log('object', object, object._internalParameterName, getter)
                return object[object._internalParameterName][getter](value);
            } else {
                // Setter mode
                //console.log('object', object, object._internalParameterName, setter, value)
                if (null !== setter) {
                    return object[object._internalParameterName][setter](value);
                }
                throw new Error(`Trying to set value for ${variableName} on ${typeof object} but no setter is defined as it is certainly a Shared Variable. Please check your code.`)
            }
        }
    }

    /**
     *
     * @param {string} variableName
     * @param {string} prefix
     * @param {string} getter
     * @param {string} setter
     */
    attachGetterSetter(variableName, prefix = '', getter, setter = null) {
        this.addVariableGetterSetter(variableName, getter, setter);
        this._attachedObjects.forEach((object)=>{
            this.addObjectGetterSetter(object, variableName, getter, setter);
        });
    }

    /**
     *
     * @param {object} object
     * @returns {this}
     */
    initAttachedObject(object) {
        for(const[variableName, getterSetter] of Object.entries(this._attachedVariables)) {
            this.addObjectGetterSetter(object, variableName, getterSetter.getter, getterSetter.setter);
        }

        return this;
    }

    /**
     *
     * @returns {this}
     */
    initAttachedObjects() {
        this._attachedObjects.forEach((object)=>{
            this.initAttachedObject(object);
        });

        return this;
    }

    /**
     *
     * @param variableName
     * @param id
     */
    createVariable(variableName, id=false) {
        this._variables[variableName] = {};
        this._variables[variableName].initialized = false;
        if (false !== id) {
            this._variables[variableName].id = id;
        }
    }

    /**
     *
     * @param variableName
     * @returns {this}
     */
    setInitialized(variableName) {
        this._variables[variableName].initialized = true;

        return this;
    }

    /**
     *
     * @param {string} variableName
     * @param {string} prefix
     * @returns {{getter: string, setter: string, _getter: string}}
     */
    getGetterSetter(variableName, prefix = '') {
        let ucFirst = this.ucFirst(variableName);
        let getter = 'get'+prefix+ucFirst;
        let setter = 'set'+prefix+ucFirst;
        let _getter = '_get'+prefix+ucFirst;

        return {getter, setter, _getter};
    }

    /**
     *
     * @param variableName
     * @param value
     * @returns {this}
     */
    addConstant(variableName, value = undefined) {
        let prefix = '';
        let {getter, setter} = this.getGetterSetter(variableName, prefix);
        this.createVariable(variableName);

        this[setter] = (value) => {
            this._variables[variableName].value = value;
        };

        this[getter] = () => {
            return this.toRawType(this._variables[variableName].value);
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        this[setter](value);
        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param variableName
     * @param value
     * @param onChange
     * @returns {this}
     */
    addVariable(variableName, value = undefined, onChange = null) {
        let prefix = '';
        let {getter, setter} = this.getGetterSetter(variableName, prefix);
        this.createVariable(variableName);

        this[setter] = (value) => {
            //console.log('Setter for ', this)
            this._variables[variableName].value = value;
            if (typeof onChange === 'function') {
                onChange();
            }
        };

        this[getter] = () => {
            //console.log('Getter for ',getter,  this)
            return this.toRawType(this._variables[variableName].value);
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        this[setter](value);
        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param variableName
     * @param {object} owner
     * @param {Function} func
     * @returns {this}
     */
    addFuncVariable(owner, variableName, func) {
        this.log('addFuncVariable', owner, variableName, func)
        if (typeof func !== 'function') {
            throw new Error(`Error while adding Func Variable "${variableName}". "func" argument must be a function. Got ${typeof func} instead.`);
        }

        let prefix = '';
        let {getter, setter} = this.getGetterSetter(variableName, prefix);
        this.createVariable(variableName);

        this[setter] = () => {
        };

        this[getter] = () => {
            //console.log('Getter for ',getter,  owner, owner.t())
            return this.toRawType(func.apply(owner));
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param variableName
     * @param {Function} sharedFunction
     * @param value
     * @param onChange
     * @returns {this}
     */
    addSharedVariable(variableName, sharedFunction, value = undefined, onChange = null) {
        if (typeof sharedFunction !== 'function') {
            throw new Error(`Error while adding Shared Variable "${variableName}". "sharedFunction" argument must be a function. Got ${typeof owner} instead.`);
        }

        let prefix = 'SharedVariable';
        let {getter, _getter, setter} = this.getGetterSetter(variableName, prefix);
        this.createVariable(variableName);

        this[setter] = (value) => {
            //console.log('Setter for ', this)
            this._variables[variableName].value = value;
            if (typeof onChange === 'function') {
                onChange();
            }
        };

        this[getter] = () => {
            //console.log('Getter for ',getter,  this)
            return this.toRawType(sharedFunction());
        };

        /**
         * allows to get the own value. This can be used by the getter function.
         * @returns {number|string|boolean}
         */
        this[_getter] = () => {
            //console.log('Getter for ',_getter,  this)
            return this.toRawType(this._variables[variableName].value);
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);
        // Add an extra variable preceded by underscore that accesses the own value.
        this.attachGetterSetter('_'+variableName, prefix, _getter);

        this[setter](value);
        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param variableName
     * @param id
     * @param value
     * @returns {this}
     */
    addScreenVariable(variableName, id = null, value = undefined) {
        id = (null === id) ? variableName : id;
        let prefix = '';
        let {getter, setter} = this.getGetterSetter(variableName, prefix);;
        this.createVariable(variableName, id);

        this[setter] = (value) => {
            this._variables[variableName].value = value;
            let id = this._variables[variableName].id;
            document.getElementById(id).setAttribute('value', value);
        };

        this[getter] = () => {
            let id = this._variables[variableName].id;
            return this.toRawType(this._variables[variableName].value??document.getElementById(id).value);
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        this[setter](value);
        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param variableName
     * @param defaultValue
     * @param afterInitialization
     * @param onUpdate
     * @returns {Promise<RocketParameters>}
     */
    async addStoredVariable(variableName, defaultValue, afterInitialization, onUpdate) {
        // _getter is only used when variable is loaded at init. Once loaded, variable is updated without async
        let prefix = '';
        let {getter, _getter, setter} = this.getGetterSetter(variableName, prefix);

        this.createVariable(variableName);

        this[setter] = async (value) => {
            this._variables[variableName].value = value;
            onUpdate&&onUpdate();
            await this.storeValue(variableName, value);
        };
        this[getter] = () => {
            let value = this._variables[variableName].value;
            return this.toRawType(value);
        };
        this[_getter] = async() => {
            let value = this._variables[variableName].value;
            if (typeof value !== 'undefined') {
                return this.toRawType(value);
            }

            value = await  this.getStoredValue(variableName);
            if (typeof value !== 'undefined') {
                return this.toRawType(value);
            }

            value = this.toRawType(defaultValue)

            return value;
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        const initialValue = await this[_getter](false);
        await this[setter](initialValue);
        this.setInitialized(variableName);
        afterInitialization&&afterInitialization();

        return this;
    }

    /**
     *
     * @param variableName
     * @param id
     * @param onChange
     * @returns {this}
     */
    async addStoredScreenVariable(variableName, id = null, onChange = null) {
        id = (null === id) ? variableName : id;

        // _getter is only used when variable is loaded at init. Once loaded, variable is updated without async
        let prefix = '';
        let {getter, _getter, setter} = this.getGetterSetter(variableName, prefix);

        this._ids[id] = {
            variable : variableName,
            getter,
            setter
        };
        this.createVariable(variableName, id);

        this[setter] = async (value) => {
            this._variables[variableName].value = value;
            let id = this._variables[variableName].id;
            let element = document.getElementById(id);
            if (element.tagName === 'INPUT') {
                element.setAttribute('value', value);
            } else {
                if (element.tagName === 'SELECT') {
                    let options = element.querySelectorAll('option');
                    for(let i=0;i<options.length;i++) {
                        if (options[i].value === value) {
                            options[i].setAttribute('selected', 'selected');
                        }
                    }
                } else {
                    throw new Error('Non handled HTML Element for setting value', value);
                }

            }
            await this.storeValue(id, value);
            if (typeof onChange === 'function') {
                onChange();
            }
        };
        this[getter] = () => {
            let value = this._variables[variableName].value;
            return this.toRawType(value);
        };
        this[_getter] = async() => {
            let id = this._variables[variableName].id;
            //console.log('Getting Value for '+id);
            let value = this._variables[variableName].value;
            //console.log('Value for '+id, value)
            if (typeof value !== 'undefined') {
                return this.toRawType(value);
            }

            value = await  this.getStoredValue(id);
            //console.log('Stored Value for '+id, value)
            if (typeof value !== 'undefined') {
                return this.toRawType(value);
            }

            //console.log('Getting value for ', id)
            value = this.toRawType(document.getElementById(id).value)

            //console.log('Value from html for '+id, value)

            return value;
        };

        this.attachGetterSetter(variableName, prefix, getter, setter);

        const initialValue = await this[_getter]();
        await this[setter](initialValue);
        this.setInitialized(variableName);

        return this;
    }

    /**
     *
     * @param id
     * @returns {this}
     */
    updateFromScreenId(id) {
        let relatedVariable = this._ids[id] || null;
        if (null === relatedVariable) {
            throw new Error('Unknown variable associated to id "'+id+'"');
        }

        let updatedValue = this.toRawType(document.getElementById(id).value)
        this[relatedVariable.setter](updatedValue);
        return this;
    }

    /**
     *
     * @param variableName
     * @returns {*}
     */
    getValue(variableName) {
        return this._variables[variableName];
    }
}

window.RocketParameters = RocketParameters;