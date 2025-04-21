export default class Constraints {
    static alwaysPositive(value) {
        return (value > 0) ? value : 0;
    }
}

window.Constraints = Constraints;