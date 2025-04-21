import Base from "../Base/Base.js";
export default class ParameteredBase extends Base {

    /**
     *
     * @returns {*}
     */
    getParameters() {
        return this[this._internalParameterName];
    }

}

window.ParameteredBase = ParameteredBase;