import RocketBase from '../Rocket/RocketBase.js';


export default class RocketChart extends RocketBase {
    /**
     *
     * @type {boolean}
     */
    debugLog = false;
    
    charts = [];
    sources = [];
    canvasBackgroundColor = '#dfeff0';

    /**
     *
     * @param {'linear'|'logarithmic'} scaleType
     * @param canvasName
     * @param parameterName
     * @param languageTitleIndex
     * @param {Function|false} minFunction
     * @param {Function|false} maxFunction
     * @param {boolean} useAverage
     * @returns {this}
     */
    addChart(scaleType, canvasName, parameterName, languageTitleIndex, minFunction = false, maxFunction = false, useAverage = false) {
        this.charts.push(
            {
                canvas : document.getElementById(canvasName),
                paramName : parameterName,
                title: () => {
                        let languages = this.commonParameters.getLanguages();
                        let language = this.commonParameters.getLanguage();
                        return languages[languageTitleIndex][language];
                    },
                graph : undefined,
                min : minFunction,
                max: maxFunction,
                useAverage,
                scaleType : scaleType,
            }
        )

        return this;
    }


    /**
     * @param {RocketModuleMethodData} moduleMethodData
     */
    addSource(moduleMethodData) {
        //let getter = moduleMethodData.getter();
        this.sources.push({
            sourceArray : moduleMethodData.getData(),
            label : moduleMethodData.getMethodName(),
            color : moduleMethodData.getColor()
        });

        return this;
    }

    /**
     *
     * @returns {RocketChart}
     */
    clearSources() {
        this.sources = [];

        return this;
    }

    /**
     *
     * @param label
     * @returns {*[]}
     */
    getSource(label) {
        return this.sources.filter(source => source.label === label);
    }

    /**
     *
     * @param chart
     * @returns {{label: *, data: *, borderColor: *, fill: boolean}[]}
     */
    getSources(chart) {
        function minOrValue(value) {
            return (chart.min===false)||(value>=chart.min()) ? value : chart.min();
        }
        function maxOrValue(value) {
            return (chart.max===false)||(value<=chart.max()) ? value : chart.max();
        }

        let paramName = chart.paramName;


        this.log('Sources : ', this.sources)

        return this.sources.map(source => {
            let sourceArray = source.sourceArray;
            if (typeof sourceArray === 'function') {
                sourceArray = sourceArray();
            }
            if (chart.useAverage === true) {
                let min = 0;
                let nbNegative = 0;
                let nbPositive = 0;
                let max = 0;
                sourceArray.forEach(s => {
                    let value = s[paramName];
                    if (value<0) {
                         min += value;
                         nbNegative++;
                    } else {
                         max += value;
                         nbPositive++;
                    }
                });
                min = (nbNegative>0) ? min/nbNegative : 0;
                max = (nbPositive>0) ? max/nbPositive : 0;
                chart.min = (chart.min !== false)&&(chart.min()>min) ? chart.min : () => min;
                chart.max = (chart.max !== false)&&(chart.max()<max) ? chart.max : () => max;
            }

            return {
                label : source.label,
                data : sourceArray.map( s => maxOrValue(minOrValue(s[paramName]))),
                borderColor : source.color,
                fill : false
            }
        })
    }

    /**
     *
     * @param {RocketModuleData} moduleData
     */
    drawCharts(moduleData = null) {
        if (null === moduleData) {
            //throw new Error('No module defined to draw charts');
            this.log('No module defined to draw charts');
            return;
        }
        this.clearSources();
        moduleData.getMethods().forEach(method => {
            this.addSource(moduleData.getMethodData(method))

        });
        this.charts.forEach(async (chart) => {
            chart.graph = await this.drawChart(chart);
        });
    }

    /**
     *
     * @param axisName
     * @returns {any[]}
     */
    getHorizontalSteps(axisName) {
        let maxTime = this.commonParameters.getMaxTime();
        function arrayDt(a, axisName) {
            // TODO : fix the uggly hard coded t<= maxTime
            return a.map(d => d[axisName].toFixed(2)).filter(t=> t<=maxTime );
        }

        let newSet = new Set();
        this.sources.forEach(function(s) {
            let sourceArray = s.sourceArray;
            if (typeof sourceArray === 'function') {
                sourceArray = sourceArray();
            }
            let data = arrayDt(sourceArray, axisName);
            data.forEach(d=>newSet.add(d))
        });

        return [...newSet];
    }

    /**
     *
     * @param chart
     * @returns {{id: string, afterInit: *}}
     */
    contextMenuPlugin(chart) {
        return {
                    id : 'contextMenuPlugin',
                    afterInit: (graph) =>
                    {
                        let menuId = 'menu-'+graph.canvas.id;
                        let existingMenu = document.getElementById(menuId);
                        if (null !== existingMenu) {
                            existingMenu.remove();
                        }
                        let menu = document.getElementById("contextMenu").cloneNode(true);
                        menu.setAttribute('id', menuId);
                        graph.canvas.after(menu);

                        let subMenus = menu.querySelectorAll('.menu-item');
                        for(let i=0;i<subMenus.length;i++) {
                            let action = subMenus[i].getAttribute('data-action');
                            subMenus[i].addEventListener('click', (event)=>{
                                this.handleMenuAction(chart, action);
                                event.preventDefault();
                                event.stopPropagation();
                                menu.style.display = "none";
                            })
                        }

                        const handleContextMenu = (event) =>  {
                            // Hide opened menus
                            let existingMenus = document.querySelectorAll('.context-menu');
                            for(let i=0;i<existingMenus.length;i++) {
                                existingMenus[i].style.display = "none";
                            }

                            // Show menu
                            event.preventDefault();
                            event.stopPropagation();
                            menu.style.left = event.layerX-30 + "px";
                            menu.style.top = event.layerY-30 + "px";
                            menu.style.display = "block";
                            return false;
                        }

                        const handleMouseDown = (event) => {
                            menu.style.display = "none";
                        }

                        graph.canvas.addEventListener('contextmenu', handleContextMenu, false);
                        graph.canvas.addEventListener('mousedown', handleMouseDown, false);
                    } 
                };
    }

    /**
     *
     * @returns {{id: string, beforeDraw: *}}
     */
    customCanvasBackgroundColorPlugin() {
        return {
                    id: 'customCanvasBackgroundColor',
                    beforeDraw: (chart, args, options) => {
                        const {ctx} = chart;
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = options.color || '#99ffff';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    }
                };
    }

    /**
     *
     * @param Chart chart
     * @returns {Promise<Chart>}
     */
    async drawChart(chart) {
        if (chart.graph) chart.graph.destroy();
        let backgroundColor = this.commonParameters.getChartBackgroundColor()
        return new Chart(chart.canvas.getContext("2d"), {
            type: 'line',
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chart.title()
                    },
                    customCanvasBackgroundColor: {
                        color: backgroundColor
                    }
                },
                scales: {
                    x: {
                        display: true,
                    },
                    y: {
                        display: true,
                        type: chart.scaleType,
                    }
                }
            },
            plugins: [
                        this.contextMenuPlugin(chart),
                        this.customCanvasBackgroundColorPlugin()
                    ],
            data: {
                // TODO : add a parameter for axis (t, but it could be something else)
                labels: this.getHorizontalSteps('t'),
                datasets: this.getSources(chart)
            }
        });
    }

    /**
     *
     * @param newColor
     * @returns {this}
     */
    updateCanvasBackgroundColor(newColor) {
        this.canvasBackgroundColor = newColor;
        return this;
    }

    /**
     *
     * @param chart
     * @param action
     */
    handleMenuAction(chart, action) {
        switch(action) {
            case "print-pdf" :
                this.printToPdf(chart);
                break;
            case "copy-to-clipboard" :
                this.copyToClipBoard(chart);
                break;
            case "save-as-pdf" :
                this.saveAsPdf(chart);
                break;
            case "save-as-png" :
                this.saveAsPng(chart);
                break;
        }
    }

    /**
     *
     * @param chart
     */
    printToPdf(chart) {
        this.saveAsPdf(chart, true);
    }

    /*
    *  source : https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
    */
    /**
     *
     * @param chart
     * @returns {Promise<void>}
     */
    async copyToClipBoard(chart) {
        let languages = this.commonParameters.getLanguages();
        let language = this.commonParameters.getLanguage();
        async function getBlobFromCanvas(canvas) {
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Canvas toBlob failed"));
                }
                });
            });
        }

        async function copyCanvasContentsToClipboard(canvas) {
            if (ClipboardItem.supports("image/png")) {
                // Copy canvas to blob
                try {
                    const blob = await getBlobFromCanvas(canvas);
                    // Create ClipboardItem with blob and it's type, and add to an array
                    const data = [new ClipboardItem({ [blob.type]: blob })];
                    // Write the data to the clipboard
                    await navigator.clipboard.write(data);
                } catch (error) {
                    let clipBoardErrorMessages = languages['lg-error-copy-clipboard'];
                    let clipBoardErrorMessage = clipBoardErrorMessages&&clipBoardErrorMessages[language] || null;
                    let message = (null !== clipBoardErrorMessage) ? clipBoardErrorMessage : 'Error while copying image to Clipboard';
                    alert(message);
                }
            } else {
                let clipBoardErrorMessages = languages['lg-error-copy-clipboard-not-supported'];
                let clipBoardErrorMessage = clipBoardErrorMessages&&clipBoardErrorMessages[language] || null;
                let message = (null !== clipBoardErrorMessage) ? clipBoardErrorMessage : 'Copying png image to Clipboard is not supported by your browser';
                alert(message);
            }
        }
        await copyCanvasContentsToClipboard(chart.canvas);
    }

    /**
     *
     * @param chart
     * @param print
     */
    saveAsPdf(chart, print=false) {
        let chartId = chart.canvas.id;
        let chartTitle = 'chart['+chart.title()+'].pdf';
        html2canvas(document.getElementById(chartId)).then(
            function (canvas) {
                var img = canvas.toDataURL(); //image data of canvas
                let aspectRatio = canvas.width/canvas.height;
                const jsPDF = window.jspdf.jsPDF;
                var doc = new jsPDF("l", "mm", "a4");
                let borderLeft = 20;
                var finalWidth = doc.internal.pageSize.getWidth()-borderLeft*2;
                let finalHeight = finalWidth/aspectRatio;
                let borderTop = (doc.internal.pageSize.getHeight()-finalHeight)/2

                doc.addImage(img, borderLeft, borderTop, finalWidth, finalHeight);
                if (false === print) {
                    doc.save(chartTitle);
                } else {
                    let blob = doc.output('blob')
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL).print();
                    return;
                }
            }
        );
    }

    /**
     *
     * @param chart
     */
    saveAsPng(chart) {
        // Convert our canvas to a data URL
        let canvasUrl = chart.canvas.toDataURL();
        let chartTitle = 'chart['+chart.title()+'].png';

        // Create an anchor, and set the href value to our data URL
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download = chartTitle;
        createEl.click();
        createEl.remove();
    }

    /**
     * @param {RocketModule} module
     */
    onSettingsChanged(module = null) {
        this.drawCharts(module);
    }
}
window.RocketChart = RocketChart;