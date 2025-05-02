export default class DegreeUtils {
    /**
     *
     * @param {number}degree
     * @returns {number}
     */
    static degreeToRadian(degree) {
        return degree * Math.PI / 180;
    }
}

window.DegreeUtils = DegreeUtils;