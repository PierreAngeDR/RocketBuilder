export const formatNumbers = function(value) {
    //return new Intl.NumberFormat("de-DE", { minimumSignificantDigits: 2, maximumSignificantDigits: 2, minimumFractionDigits : 2, maximumFractionDigits:2 }).format(value)
    return new Intl.NumberFormat("de-DE", { minimumFractionDigits : 2, maximumFractionDigits:2 }).format(value)
}
window['formatNumbers'] = formatNumbers;
/**
 *
 * @returns {{totalMem: number, totalJs: number, availableMem: number, availablePercent: string}}
 */
export const getMemoryUsage = function() {
    /**
     *
     * @property {Object} window.performance.memory
     * @property {number} window.performance.memory.jsHeapSizeLimit
     * @property {number} window.performance.memory.totalJSHeapSize
     * @property {number} window.performance.memory.usedJSHeapSize
     */
    let memoryInfo = window.performance.memory;
    let totalMem = memoryInfo.jsHeapSizeLimit;
    let totalJs = memoryInfo.totalJSHeapSize;

    let availableMem = totalMem-totalJs;
    let availablePercent = ((availableMem/totalMem)*100).toFixed(2);

    return {
        totalMem,
        totalJs,
        availableMem,
        availablePercent,
    }
}

window['getMemoryUsage'] = getMemoryUsage;

export const logMemoryUsage = function() {
    let {totalMem, totalJs, availableMem, availablePercent} = window.getMemoryUsage();

    console.log('Using '+formatNumbers(totalJs)+' out of '+formatNumbers(totalMem)+' . Still '+formatNumbers(availableMem)+' available ('+availablePercent+'%)');
}
window['logMemoryUsage'] = logMemoryUsage;

console.log('Show Memory usage by calling showMemoryUsage() in browser console.');
logMemoryUsage();