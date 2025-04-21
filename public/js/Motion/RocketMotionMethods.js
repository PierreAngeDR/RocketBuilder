import RocketMotionMethod from "./RocketMotionMethod.js";

export default class RocketMotionMethods {
    /**
     *
     * @type {RocketMotionBase}
     * @private
     */
    _boundTo = null;
    /**
     *
     * @type {RocketMotionMethod[]}
     * @private
     */
    _methods = [];

    /**
     *
     * @param {RocketMotionBase} binder
     */
    constructor(binder) {
        this.binder = binder;
    }

    /**
     *
     * //@param {RocketMotionMethod|[{string}]} method
     * @param {string} methodName
     * @param {string} color
     * @param {boolean} isMainSource
     */
    //add(method) {
    add(methodName, color, isMainSource = false) {

        let getter = ()=>{
                            return this._boundTo[name].bind(this._boundTo);
                        };

        let method = new RocketMotionMethod(
                                                                methodName,   // method name
                                                                color,  // color
                                                                isMainSource,
                                                                getter  // getter assigned Variable in RocketMotionBase
                                                            )
        this._methods.push(method);

        return this;
    }

    /**
     *
     * @returns {RocketMotionMethod[]}
     */
    methods() {
        return this._methods;
    }

    methodObjects() {
        return this._methods.map(method => {
            return {
                name: method.name(),
                color: method.color(),
                isMainSource: method.isMainSource(),
            }
        });
    }

    /**
     *
     * @param callback
     */
    forEach(callback) {
        this._methods.forEach(method => callback(method));
    }
}

window.RocketMotionMethods = RocketMotionMethods;