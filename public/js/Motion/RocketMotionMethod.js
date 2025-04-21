export default class RocketMotionMethod {
    /**
     *
     * @type {string}
     * @private
     */
    _name = '';
    /**
     *
     * @type {string}
     * @private
     */
    _color = '';
    /**
     *
     * @type {boolean}
     * @private
     */
    _isMainSource = false;
    /**
     *
     * @type {function}
     * @private
     */
    _getter = null;

    /**
     *
     * @param {string} name
     * @param {string} color
     * @param {boolean }isMainSource
     * @param {function} getter
     */
    constructor(name, color, isMainSource, getter) {
        this._name = name;
        this._color = color;
        this._isMainSource = isMainSource;
        this._getter = getter;
    }

    name() {
         return this._name;
    }

    color() {
        return this._color;
    }

    isMainSource() {
        return this._isMainSource;
    }

    getter() {
        return this._getter;
    }
}

window.RocketMotionMethod = RocketMotionMethod;