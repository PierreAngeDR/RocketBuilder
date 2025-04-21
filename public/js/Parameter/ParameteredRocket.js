import RocketBase from '../Rocket/RocketBase.js';
import RocketParameters from './RocketParameters.js';

/**
 * @class
 * @extends {RocketBase}
 */
export default class ParameteredRocket extends RocketBase {

    /**
     * Enable logging.
     * @type {boolean}
     */
    debugLog = false;
    
    constructor(parameters = null, internalParameterName = 'commonParameters') {
        super(parameters);
        this._internalParameterName = internalParameterName;
        this.log('Creating ', internalParameterName)
        if (internalParameterName !== 'commonParameters') {
            this[internalParameterName] = new RocketParameters()
                // TODO : rollback to .attachTo(this, true); and test
                                                .attachTo(this, true);
                                                //.attachTo(this);
        }
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addVariable(...args) {
        let onChange = (args.length>2) ? args.pop() : null;
        if (null !== onChange) {
            onChange = onChange.bind(this);
            args.push(onChange);
        }
        this.getParameters().addVariable.apply(this.getParameters(), args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {this}
     */
    addFuncVariable(...args) {
        args.unshift(this);
        this.getParameters().addFuncVariable.apply(this.getParameters(), args);
        return this;
    }
}

window.ParameteredRocket = ParameteredRocket;