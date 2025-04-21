import Base from "../Base/Base.js";
export default class RocketMotionSharedVariable extends Base {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;
    
    /**
     * @type {Function|any}
     */
    localValue;

    /**
     * @type {Function}
     */
    localValueFunction;

    /**
     * @type {RocketMotionBase}
     */
    owner;

    constructor(owner, name, value, sharedFunction) {
        super();
        this.owner = owner;
        if (typeof value === 'function') {
            this.localValueFunction = value.bind(owner);
            this.localValue = this.localValueFunction()
        } else {
            this.localValueFunction = (val)=>val;
            this.localValue = value;
        }

        this.log('Setting localValue of '+name+' to : ', this.localValue);
        let ucFirst = function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        let localName = 'local' + ucFirst(name);
        owner._shares = owner._shares || {};
        owner._shares[name] = {
            func : value.bind(owner),
            sharedFunction: sharedFunction.bind(owner),
        };
        owner[name] = function(value) {
            if (value !== undefined) {
                return owner[localName](value);
            } else {
                return owner._shares[name].sharedFunction();
            }
        };
        owner[localName] = function(value) {
            if (value !== undefined) {
                //this.log('Setting localValue of '+name+' to : ', value);
                this.localValue = this.localValueFunction.apply(this.owner, [value]);
                return owner;
            } else {
                //this.log(this.localValue)
                this.localValue = this.localValueFunction.apply(this.owner);
                return this.localValue;
            }
        }.bind(this);

        owner[name].bind(owner);
    }

    static add(owner, name, value, sharedFunction) {
        return new RocketMotionSharedVariable(owner, name, value, sharedFunction);
    }
}

window.RocketMotionSharedVariable = RocketMotionSharedVariable;