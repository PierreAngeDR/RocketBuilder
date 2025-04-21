import RocketModuleMethodData from "./RocketModuleMethodData.js";
import Base from "../Base/Base.js";

export default class RocketModuleData extends Base {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;
    /**
     *
     * @type {{RocketModuleMethodData}}
     */
    data = {}
    /**
     *
     * @type {string[]}
     */
    methods = []

    /**
     *
     * @param {string} methodName
     * @param {string} color
     * @param {boolean} isMainSource
     * @param {any[]} data
     */
    addData(methodName, color, isMainSource, data) {
        this.log('Adding', data)
        if (this.methods.indexOf(methodName) === -1) {
            this.methods.push(methodName);
        }

        this.data[ methodName ] = new RocketModuleMethodData(methodName, color, isMainSource, data);
    }

    /**
     *
     * @returns {string[]}
     */
    getMethods() {
        return this.methods;
    }

    /**
     *
     * @param {string} methodName
     * @returns {RocketModuleMethodData}
     */
    getMethodData(methodName) {
        if (typeof this.data[methodName] === 'undefined') {
            throw new Error('No data for method: ' + methodName);
        }
        return this.data[methodName];
    }
}

window.RocketModuleData = RocketModuleData;