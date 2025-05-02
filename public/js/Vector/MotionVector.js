export default class MotionVector {
    static availableModels = ["1D", "2D", "3D"];
    static verticalVector = new MotionVector("1D", 0, 0, 1);

    model = "1D";

    /**
     *
     *          z
     *          |
     *          |
     *          |
     *          |
     *          |
     *          |
     *          O-----------------> x
     *         /
     *        /
     *       /
     *      y
     *
     */
    coordinates = {
                                x: 0,
                                y: 0,
                                z: 0,
                            }
    constructor(model = "1D", x= 0, y= 0, z = 0) {
        if (MotionVector.availableModels.includes(model)) {
            this.model = model;
            this.set(x, y, z);
        } else {
            throw new Error(`Vector Model ${model} is not available`);
        }
    }

    /**
     *
     * @param model
     * @returns {"1D"|"2D"|"3D"}
     */
    static getModelType(model="1D") {
        if (MotionVector.availableModels.includes(model)) {
            return model;
        }
        throw new Error(`Vector Model ${model} is not available`);
    }

    static new(model = "1D", x= 0, y= 0, z = 0) {
        return new MotionVector(model, x, y, z);
    }

    clone() {
        return new MotionVector(this.model, this.x(), this.y(), this.z());
    }

    /**
     *
     * @param {number|MotionVector}x
     * @param {number}y
     * @param {number}z
     * @returns {MotionVector}
     */
    set(x=0, y=0, z=0) {
        if (x instanceof MotionVector) {
            let vector = x;
            this.set(vector.x(), vector.y(), vector.z());
        } else {
            this.coordinates = {x, y, z};
        }

        return this;
    }

    getNorm() {
        switch (this.model) {
            case "1D": return Math.abs(this.coordinates.z);
            case "2D": return Math.sqrt(this.coordinates.x ** 2 + this.coordinates.z ** 2);
            case "3D": return Math.sqrt(this.coordinates.x ** 2 + this.coordinates.y ** 2 + this.coordinates.z ** 2);
        }
    }

    /**
     *
     * @returns {-1|1}
     */
    verticalSign() {
        return this.coordinates.z > 0 ? 1 : -1;
    }

    /**
     * getter/setter for x
     * @param {number|null}value
     * @returns {number}
     */
    x(value=null) {
        if (value !== null) {
            this.coordinates.x = value;
        }
        return this.coordinates.x;
    }

    /**
     * getter/setter for y
     * @param {number|null}value
     * @returns {number}
     */
    y(value=null) {
        if (value !== null) {
            this.coordinates.y = value;
        }
        return this.coordinates.y;
    }

    /**
     * getter/setter for z
     * @param {number|null}value
     * @returns {number}
     */
    z(value=null) {
        if (value !== null) {
            this.coordinates.z = value;
        }
        return this.coordinates.z;
    }

    /**
     *
     * @param {MotionVector}vector
     * @returns {MotionVector}
     */
    add(vector) {
        this.coordinates.x += vector.x();
        this.coordinates.y += vector.y();
        this.coordinates.z += vector.z();

        return this;
    }

    /**
     *
     * @param {MotionVector}vector
     * @returns {MotionVector}
     */
    substract(vector) {
        this.coordinates.x -= vector.x();
        this.coordinates.y -= vector.y();
        this.coordinates.z -= vector.z();

        return this;
    }

    /**
     *
     * @param {MotionVector}vector
     * @returns {MotionVector}
     */
    addX(vector) {
        this.coordinates.x += vector.x();

        return this;
    }

    /**
     *
     * @param {MotionVector}vector
     * @returns {MotionVector}
     */
    addY(vector) {
        this.coordinates.y += vector.y();

        return this;
    }

    /**
     *
     * @param {MotionVector}vector
     * @returns {MotionVector}
     */
    addZ(vector) {
        this.coordinates.z += vector.z();

        return this;
    }

    /**
     *
     * @param {number}factor
     * @returns {MotionVector}
     */
    scale(factor) {
        this.coordinates.x *= factor;
        this.coordinates.y *= factor;
        this.coordinates.z *= factor;

        return this;
    }

    isNull() {
        switch (this.model) {
            case "1D": return this.coordinates.z === 0;
            case "2D": return this.coordinates.x === 0 && this.coordinates.z === 0;
            case "3D": return this.coordinates.x === 0 && this.coordinates.y === 0 && this.coordinates.z === 0;
        }
    }

    toUnitary() {
        const norm = this.getNorm() || 1;
        this.scale(1/norm);

        return this;
    }

    unitaryVector() {
        switch (this.model) {
            case "1D": return new MotionVector(this.model, 0, 0, 1);
            case "2D": return new MotionVector(this.model, 1, 0, 1);
            case "3D": return new MotionVector(this.model, 1, 1, 1);
        }
    }

    /**
     *
     * @param {MotionVector}vector1
     * @param {MotionVector}vector2
     * @returns {MotionVector}
     */
    static sum(vector1, vector2) {
        return new MotionVector(vector1.model,vector1.x()+vector2.x(),vector1.y()+vector2.y(),vector1.z()+vector2.z());
    }

    /**
     *
     * @param {MotionVector}vector
     * @param {number}factor
     * @returns {MotionVector}
     */
    static multiply(vector, factor) {
        return new MotionVector(vector.model,vector.x()*factor,vector.y()*factor,vector.z()*factor);
    }
}

window.MotionVector = MotionVector;