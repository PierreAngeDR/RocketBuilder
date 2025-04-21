

/**
 * color picker
 */
async function _initColorPicker() {
    let colorPickerId = document.querySelector('.charts-color-picker');
    let chartsColorPicker = new JSColor(colorPickerId, {
        onChange: () => {
            rocket.updateChartBackgroundColor(chartsColorPicker.toRGBAString())
        },

    });
    let color = await rocket.getParameters().getChartBackgroundColor();
    chartsColorPicker.fromString(color);

}

window.initColorPicker = async function() {
    await _initColorPicker();
}