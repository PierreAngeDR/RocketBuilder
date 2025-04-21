export default class RocketModuleMethodData {
    /**
     * @type {string}
     */
    methodName;
    /**
     * @type {string}
     */
    color;
    /**
     * @type {boolean}
     */
    _isMainSource;
    /**
     * @type {*[]}
     */
    data;
    constructor(methodName, color, isMainSource, data) {
        this.methodName = methodName;
        this.color = color;
        this._isMainSource = isMainSource;
        this.data = data;
    }

    getMethodName() {
        return this.methodName;
    }

    getColor() {
        return this.color;
    }

    isMainSource() {
        return this._isMainSource;
    }

    getData() {
        return this.data;
    }

}

window.RocketModuleMethodData = RocketModuleMethodData;