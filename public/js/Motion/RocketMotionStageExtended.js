import RocketMotionBase from './RocketMotionBase.js';
import RocketMotionMethods from "./RocketMotionMethods.js";
import RocketMotionSharedVariable from "./RocketMotionSharedVariable.js";
import Constraints from "../Constraint/Constraints.js";
import RocketPhysics from "../Physics/RocketPhysics.js";
import MotionVector from "../Vector/MotionVector.js";

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
     * @returns {RocketMotionStageExtended}
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
     * @param {MotionVector} speedVector
     * @returns {MotionVector}
     */
    calculateDragVector(speedVector) {
        this.log('Calculate drag for speed', speedVector.clone(), speedVector.getNorm(), 'and A', this.A())
        let speedNorm = speedVector.getNorm();
        //return 0.5 * this.Cd() * this.calculateRho() * this.A() * speedNorm * speedNorm * speed.verticalSign();
        let coefficient = -0.5 * this.Cd() * this.calculateRho() * this.A() * speedNorm;
        this.log('Drag coefficient', coefficient)
        return MotionVector.multiply(speedVector, coefficient);
    }

    /**
     *
     * @param {MotionVector}dragVector
     * @param {number}thrustNorm
     * @returns {MotionVector}
     */
    calculateThrustForceVector(thrustNorm) {
        // let unitaryVector = dragVector.scale(-1/dragVector.getNorm());
        // unitaryVector = unitaryVector.isNull() ? unitaryVector.unitaryVector() : unitaryVector;

        //let unitaryVector = (dragVector.getNorm()===0) ? dragVector.unitaryVector() : dragVector.scale(-1/dragVector.getNorm());


        this.log('Unitary Vector', this.directionVector().clone())
        return this.directionVector().clone().scale(thrustNorm);
    }

    /**
     *
     * @param {MotionVector} dragVector
     * @returns {MotionVector}
     */
    calculateAccelerationVector(dragVector) {
        //return (this.F() - this.calculateGravitationForce() - dragVector) / this.m();
        this.log('calculateAccelerationVector', dragVector.clone())
        let thrustForceVector = this.calculateThrustForceVector(this.F());
        this.log('thrustForceVector', thrustForceVector.clone())

        thrustForceVector
                    .add(this.calculateGravitationForceVector())
                    .add(dragVector)
                    .scale(1/this.m());
        this.log('Thrust Force Vector', thrustForceVector, this.F())
        return thrustForceVector;
    }

    /**
     *
     * @param {*} data
     * @return {RocketMotionStageExtended}
     */
    addExtraData(data) {
        return this;
    }

    /**
     *
     * @param {RocketMotionBase}motion
     * @param {*}data
     * @return {RocketMotionStageExtended}
     */
    addExtraMotionData(motion, data) {
        return this;
    }

    shareData(methodName, accelerationVector, dragVector) {
        let data = {
            t: this.t(),
            //h: this.h(),
            h: this.coordsVector().z(),
            //v: this.v(),
            v: this.speedVector().getNorm(),
            a: accelerationVector.getNorm(),
            d: dragVector.getNorm(),
            m : this.m(),
            mc : this.mc(),
            m0 : this.m0(),
            th : this.F(),
            A : this.A(),
            dm : this.dm(),
            g: this.calculateGravity()
        };
        this.addExtraData(data);
        this.saveLastData(methodName, data);


        // Set all submodules infos
        this.others().map(motion => {
            motion.v(this.v());
            motion.h(this.h());
            motion.directionVector().set(this.directionVector());
            motion.speedVector().set(this.speedVector());
            motion.coordsVector().set(this.coordsVector());
            this.addExtraMotionData(motion, data);
            motion.saveLastData(methodName, data);
        })

        return this;
    }

    /**
     *
     * @param {MotionVector}newSpeedVector
     * @returns {RocketMotionStageExtended}
     */
    updateSpeed(newSpeedVector) {
        this.speedVector().set(newSpeedVector);
        this.v(newSpeedVector.getNorm());

        return this;
    }


    /**
     *
     * @param {MotionVector}newCoordsVector
     * @returns {RocketMotionStageExtended}
     */
    updateCoords(newCoordsVector) {
        let newDirectionVector = newCoordsVector.clone().substract(this.coordsVector()).toUnitary();
        this.directionVector().set(newDirectionVector);
        this.coordsVector().set(newCoordsVector.x(), newCoordsVector.y(), Constraints.alwaysPositive(newCoordsVector.z()));
        this.h(this.coordsVector().z());

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {MotionVector} accelerationVector
     * @param {MotionVector} dragVector
     */
    updateEuler(methodName, accelerationVector, dragVector) {
        let dt = this.commonParameters.getDt();
        //let newSpeed = this.v() + acceleration * dt;
        let newSpeedVector = MotionVector.sum(this.speedVector(),
                                                        MotionVector.multiply(accelerationVector, dt));
        //let newAltitude = this.h() + newSpeed * dt;
        let newAltitudeVector = MotionVector.sum(this.coordsVector(),
                                                        MotionVector.multiply(newSpeedVector, dt));


        this.updateSpeed(newSpeedVector).updateCoords(newAltitudeVector);

        this.shareData(methodName, accelerationVector, dragVector);

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {MotionVector} accelerationVector
     * @param {MotionVector} dragVector
     *
     * TODO : need to apply Heun twice. First time on Speed, then on Altitude
     */
    updateHeun(methodName, accelerationVector, dragVector) {
        let dt = this.commonParameters.getDt();
        //let d_n = this.calculateDragNorm(this.v())
        let d_nVector = this.calculateDragVector(this.speedVector())
        let a_nVector = this.calculateAccelerationVector(d_nVector);
        let v_predVector = MotionVector.sum(this.speedVector(),
                                            MotionVector.multiply( a_nVector, dt));
        //let h_pred = this.h() + dt * this.v();
        let h_pred = MotionVector.sum(this.coordsVector(),
                                    MotionVector.multiply(this.speedVector(), dt));
        let d_predVector = this.calculateDragVector(v_predVector);
        let a_predVector = this.calculateAccelerationVector(d_predVector);
        accelerationVector  = MotionVector.sum(a_nVector, a_predVector).scale(0.5);

        let newSpeedVector = MotionVector.sum(this.speedVector(),
                                MotionVector.multiply(accelerationVector, dt));
        //let newAltitude = this.h() + (dt / 2) * (newSpeed + v_pred);
        let newAltitudeVector = MotionVector.sum(this.coordsVector(),
                        MotionVector.multiply(MotionVector.sum(newSpeedVector, v_predVector),  dt / 2));


        this.updateSpeed(newSpeedVector).updateCoords(newAltitudeVector);

        this.shareData(methodName, accelerationVector, dragVector);

        return this;
    }

    /**
     *
     * @param {string} methodName
     * @param {MotionVector} accelerationVector
     * @param {MotionVector} dragVector
     *
     * TODO : need to apply RK4 twice. First time on Speed, then on Altitude
     *
     */
    updateRK4(methodName, accelerationVector, dragVector) {
        let dt = this.commonParameters.getDt();
        let k1 = accelerationVector.clone();
        let k2 = accelerationVector.clone().add(k1.clone().scale(dt/2));
        let k3 = accelerationVector.clone().add(k2.clone().scale(dt/2));
        let k4 = accelerationVector.clone().add(k3.clone().scale(dt));
        accelerationVector = k1.add(k2.scale(2)).add(k3.scale(2)).add(k4).scale(1/6);

        let newSpeedVector = accelerationVector.clone().scale(dt).add(this.speedVector());
        let newAltitudeVector = this.coordsVector().clone().add(newSpeedVector.clone().scale(dt));

        this.updateSpeed(newSpeedVector).updateCoords(newAltitudeVector);

        this.shareData(methodName, accelerationVector, dragVector);

        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    hasFuel() {
        return this.localM() > this.localM0();
    }

    /**
     *
     * @returns {boolean}
     */
    hasThrust() {
        return this.localF() > 0;
    }

    /**
     * Update sub module mass if running and has fuel and has thrust
     *
     * @returns {RocketMotionStageExtended}
     */
    updateMass() {
        if (this.running()) {
            if (this.hasFuel()) {
                let dt = this.commonParameters.getDt();
                let deltaM = (this.hasThrust()) ? this.localDm() * dt : 0;
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

    incrementTime() {
        let dt = this.commonParameters.getDt();
        this.t(this.t() + dt);

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
        this.incrementTime();
        this.updateMass();

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

            this.log('Calculate Drag Vector', this.speedVector().clone())

            const dragVector = this.calculateDragVector(this.speedVector());
            let accelerationVector = this.calculateAccelerationVector(dragVector);

            this.log('Drag Vector & Acceleration Vector', dragVector.clone(), accelerationVector.clone())

            switch(methodName) {
                case "Euler" : this.updateEuler(methodName, accelerationVector, dragVector); break;
                case "Heun" : this.updateHeun(methodName, accelerationVector, dragVector); break;
                case "RK4" : this.updateRK4(methodName, accelerationVector, dragVector); break;
            }


            //continueUpdate = (this.h() > 0);
            continueUpdate = (this.coordsVector().z() > 0);
        }

        return continueUpdate;
    }
}

window.RocketMotionStageExtended = RocketMotionStageExtended;