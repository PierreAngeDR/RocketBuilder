import ParameteredBase from "../Parameter/ParameteredBase.js";
/**
 * @class
 */
export default class RocketBase extends ParameteredBase {
    commonParameters;

    /**
     * @var RocketParameters parameters
     */
    constructor(parameters = null) {
        super()
        this.commonParameters = parameters;
        this._internalParameterName = 'commonParameters';
    }

    isLocalFileLocation() {
        return window.location.href.indexOf('file:') === 0;
    }

    showToastMessage(message) {
        Toastify({

            text: message,

            duration: 3000

        }).showToast();
    }
}

window.RocketBase = RocketBase;