import RocketModuleData from './RocketModuleData.js';
//import RocketModuleMethodData from './RocketModuleMethodData.js';
import Base from '../Base/Base.js';

export default class RocketModulesData extends Base {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;
    /**
     *
     * @type {{string:RocketModuleData}}
     */
    data = {}

    addData(id, methodName, color, isMainSource, data) {
        this.log('------- addData', id, methodName, color, isMainSource, data, '-------')
        this.data[id] = this.data[id] || new RocketModuleData();
        this.data[id].addData(methodName, color, isMainSource, data);
    }

    /**
     *
     * @param id
     * @returns {RocketModuleData}
     */
    getData(id) {
        if (typeof this.data[id] === 'undefined') {
            this.data[id] = new RocketModuleData();
        }

        return this.data[id]
    }

    /**
     *
     * @param id
     * @param {string} methodName
     * @returns {RocketModuleMethodData}
     */
    getMethodData(id, methodName) {
        if (typeof this.data[id] === 'undefined') {
            throw new Error('No data for id: ' + id);
        }

        return this.data[id].getMethodData(methodName);
    }
}

window.RocketModulesData = RocketModulesData;