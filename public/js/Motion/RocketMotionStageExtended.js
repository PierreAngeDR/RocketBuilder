import RocketMotionBase from './RocketMotionBase.js';
import RocketMotionMethods from "./RocketMotionMethods.js";
import RocketMotionSharedVariable from "./RocketMotionSharedVariable.js";
import Constraints from "../Constraint/Constraints.js";
import RocketPhysics from "../Physics/RocketPhysics.js";

export default class RocketMotionStageExtended extends RocketMotionBase {
    debugLog = false;

    initPhysics() {
        super.initPhysics();
        this.physics = new RocketPhysics('realistic');

        return this;
    }

    /**
     * Define your methods here. They will be used to configure arrays to store their values
     * @returns {this}
     */
    initMethods() {
        super.initMethods();

        this.methods = new RocketMotionMethods(this)
                            .add('Euler', 'red')
                            .add('Heun', 'blue')
                            .add('RK4', 'green', true);

        return this;
    }

    // TODO : redo the explanation

    /**
     * Create new Shared Variables for the current module motion belongs to.
     * For instance :
     *      this.addSharedVariable('F', this.sharedF())
     *
     * Where sharedF() returns the shared function that will give Cumulated F for all submodules of the module
     *      sharedF = () => this.sharedFunction(
     *                         ()=>{
     *                             return this.all().reduce((acc, motion)=> {
     *                                 return acc + (motion.isEnginePropelling() ? motion._F() : 0)
     *                             }, 0);
     *                         });
     *
     * You can now call :
     *      this.F() => will get the cumulated F for all submodules of the module
     *      this._F() => will get the F for the current submodule
     *      this.F(<some value>) will set the value for the current submodule
     *
     * There is no setter for all submodules of the module at the same time (each submodule has to set its own _F value
     *
     * @returns {RocketMotionStage2}
     */
    doLoadSharedVariables() {
        super.doLoadSharedVariables();
        RocketMotionSharedVariable.add(this, 'F', this.F, this.sharedF);                                    // Poussée moteur Totale du module
        RocketMotionSharedVariable.add(this, 'A', this.A, this.sharedA);                                    // Surface Frontale Totale du module
        RocketMotionSharedVariable.add(this, 'm0', this.m0, this.sharedM0);                                 // Masse Totale à vide du module
        RocketMotionSharedVariable.add(this, 'mc', this.mc, this.sharedMc);                                 // Masse Totale de carburant
        RocketMotionSharedVariable.add(this, 'm', ()=>this.localM0()+this.localMc(), this.sharedM);   // Masse Totale du module
        RocketMotionSharedVariable.add(this, 'dm', this.dm, this.sharedDm);                                 // Masse Totale à vide du module

        return this;
    }

    /**
     * Calculates the total Thrust force for all submodules of the module this submodule belongs to
     */
    sharedF() {
        return this.all().reduce((acc, motion)=> {
            return acc + (motion.isEnginePropelling() ? motion.localF() : 0)
        }, 0);
    }

    /**
     * Calculates the total Front Section for all submodules of the module this submodule belongs to
     */
    sharedA() {
        return this.all().reduce((acc, motion)=> {
            return acc + (motion.hasExposedFrontSection() ? motion.localA() : 0)
        }, 0);
    }

    /**
     * Calculates the total Mass for all submodules of the module this submodule belongs to
     */
    sharedM() {
        return this.all().reduce((acc, motion)=> {
            return acc + motion.localM();
        }, 0);
    }

    /**
     * Calculates the total Mass for all submodules of the module this submodule belongs to when empty
     */
    sharedM0() {
        return this.all().reduce((acc, motion)=> {
            return acc + motion.localM0();
        }, 0);
    }

    /**
     * Calculates the total Mass for all submodules of the module this submodule belongs to when empty
     */
    sharedDm() {
        return this.all().reduce((acc, motion)=> {
            return acc + (motion.isEnginePropelling() ?  motion.localDm() : 0);
        }, 0);
    }

    sharedMc() {
        return this.all().reduce((acc, motion)=> {
            return acc + motion.localMc();
        }, 0);
    }

    /**
     * Calculates the Drag Force
     *  This is given by the following formula : Fdrag = 0.5 * rho * v^2 * Cd
     *      Where :
     *              rho is the air density depending on the altitude
     *              v is the speed
     *              Cd is the rocket drag coefficient. It depends on each Rocket
     *
     *
     * @param {number} speed
     * @returns {number}
     */
    calculateDrag(speed) {
        this.log('Calculate drag for speed', speed, 'and A', this.A())
        // TODO : shouldn't it depend on the speed sign ?
        return 0.5 * this.Cd() * this.calculateRho() * this.A() * speed * speed * Math.sign(speed);
    }

    /**
     *
     * @param {number} speed
     * @param {number} drag
     * @returns {number}
     */
    calculateAcceleration(speed, drag) {
        return (this.F() - this.calculateGravitationForce() - drag) / this.m();
    }

    shareData(methodName, acceleration, drag) {
        let data = {
            t: this.t(),
            h: this.h(),
            v: this.v(),
            a:acceleration,
            d:drag,
            m : this.m(),
            mc : this.mc(),
            m0 : this.m0(),
            th : this.F(),
            A : this.A(),
            dm : this.dm(),
            g: this.calculateGravity()
        };
        this.saveLastData(methodName, data);


        // Set all submodules infos
        this.others().map(motion => {
            motion.v(this.v());
            motion.h(this.h());
            motion.saveLastData(methodName, data);
        })

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {number} acceleration
     * @param {number} drag
     */
    updateEuler(methodName, acceleration, drag) {
        let dt = this.commonParameters.getDt();
        let newSpeed = this.v() + acceleration * dt;
        let newAltitude = this.h() + newSpeed * dt;

        this.v(newSpeed);
        this.h(Constraints.alwaysPositive(newAltitude));

        this.shareData(methodName, acceleration, drag);

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {number} acceleration
     * @param {number} drag
     *
     * TODO : need to apply Heun twice. First time on Speed, then on Altitude
     */
    updateHeun(methodName, acceleration, drag) {
        let dt = this.commonParameters.getDt();
        let d_n = this.calculateDrag(this.v())
        let a_n = this.calculateAcceleration(this.v(), d_n);
        let v_pred = this.v() + dt * a_n;
        let h_pred = this.h() + dt * this.v();
        let d_pred = this.calculateDrag(v_pred);
        let a_pred = this.calculateAcceleration(v_pred, d_pred);
        acceleration  = (a_n + a_pred)/2;

        let newSpeed = this.v() + dt * acceleration;
        let newAltitude = this.h() + (dt / 2) * (newSpeed + v_pred);

        this.v(newSpeed);
        this.h(Constraints.alwaysPositive(newAltitude));

        this.shareData(methodName, acceleration, drag);

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {number} acceleration
     * @param {number} drag
     *
     * TODO : need to apply RK4 twice. First time on Speed, then on Altitude
     *
     */
    updateRK4(methodName, acceleration, drag) {
        let dt = this.commonParameters.getDt();
        let k1 = acceleration;
        let k2 = acceleration + (dt/2) * k1;
        let k3 = acceleration + (dt/2) * k2;
        let k4 = acceleration + dt * k3;
        acceleration = (k1 + 2 * k2 + 2 * k3 + k4)/6;

        let newSpeed = this.v() + dt * acceleration;
        let newAltitude = this.h() + newSpeed * dt;
        this.v(newSpeed);
        this.h(Constraints.alwaysPositive(newAltitude));

        this.shareData(methodName, acceleration, drag);

        return this;
    }

    /**
     * update variables that are calculation method independent
     *
     * @returns {RocketMotionStageExtended}
     */
    updateVariants() {
        //console.clear();
        this.log('####################################################################################')
        let dt = this.commonParameters.getDt();
        this.t(this.t() + dt);


        if (this.running()) {
            if (this.localM() > this.localM0()) {
                // TODO : use Math.min so that it's not < to m0
                let deltaM = (this.localF() === 0) ? 0 : this.localDm() * dt;
                let initialMc = this.mc();
                let initialTotalMass = this.m();
                let initialM = this.localM();

                this.mc(Constraints.alwaysPositive(this.localMc() - deltaM));

                if (this.t()>190) {
                    this.log('-----> '+this.name(), deltaM, this.t())
                    this.log('-----> '+this.name()+' Carburant', initialMc,'->',  this.mc(), '=>', initialMc-this.mc())
                    this.log('-----> '+this.name()+' Mass Local', initialM, '->',  this.localM())
                    this.log('-----> '+this.name()+' Mass Total', initialTotalMass, '->',  this.m())
                    //this.log(this)
                }
            }
        }

        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    processCalculations() {

        this.log('processCalculations for ', this.name(), this.t(), this.isEnginePropelling(), this.localF())

        let isLastElementOfStage = this.isLastElementOfModule();
        let methodName = this.commonParameters.getIntegrationMethod().name;

        let continueUpdate = false;

        if (this.running()) {

            const drag = this.calculateDrag(this.v());
            let acceleration = this.calculateAcceleration(this.v(), drag);

            switch(methodName) {
                case "Euler" : this.updateEuler(methodName, acceleration, drag); break;
                case "Heun" : this.updateHeun(methodName, acceleration, drag); break;
                case "RK4" : this.updateRK4(methodName, acceleration, drag); break;
            }

            continueUpdate = (this.h() > 0);
        }

        return continueUpdate;
    }
}

window.RocketMotionStageExtended = RocketMotionStageExtended;