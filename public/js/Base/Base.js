export default class Base {

    /**
     * Enable logging.
     * @type {boolean}
     */
    debugLog = true;


    /**
     * Enable warnings.
     * @type {boolean}
     */
    debugWarn = true;

    /**
     *
     * @param args
     * @returns {Base}
     */
    log(...args) {
        if (this.debugLog !== true) {
            return this;
        }
        console.log.apply(console, [...args]);

        return this;
    }

    /**
     *
     * @param args
     * @returns {Base}
     */
    warn(...args) {
        if (this.debugWarn !== true) {
            return this;
        }
        console.warn.apply(console, [...args]);

        return this;
    }

}

window.Base = Base;