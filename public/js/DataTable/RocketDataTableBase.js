import Languages from "../Lang/Languages.js";

export default class RocketDataTableBase extends RocketBase{

    static MinStepToShowAllData = 0.1;

    sources = {};
    mainSourceLabel = false;
    dataObject = {};
    columns = [];
    grids = {};
    columnsConf = [];
    gridParams = {};
    defaultPrecision = 2;

    paginationEnabled = true;
    paginationSize = 100;

    rendered = false;
    printEnabled = true;
    /**
     *
     * @type {{data, columns}}
     */
    gridInfo = {};

    isRendered() {
        return this.rendered === true;
    }

    /**
     *
     * @param newColumnsConf
     * @returns {this}
     */
    setColumnsConfiguration(newColumnsConf) {
        this.columnsConf = newColumnsConf || [];

        return this;
    }


    /**
     *
     * @param gridId
     */
    printGrid(gridId) {
        let grid = this.grids[gridId];
        if (typeof grid === 'undefined') {
            alert(window.Languages.get('lg-alert-no-grid-available'));
            return;
        }
        //grid.print(false, true);
        //grid.print();
        if (this.printEnabled) {
            grid.print("all", true);
        } else {
            if (this.isLocalFileLocation()) {
                this.showToastMessage(window.Languages.get('lg-no-print-local') );
            } else {
                this.showToastMessage(window.Languages.get('lg-no-print-remote') );
            }
        }
    }

    /**
     *
     * @param {string} gridId
     * @returns {string}
     */
    formatTitle(gridId) {
        let gridParams = this.gridParams[gridId];
        console.log('gridParams', gridParams)
        let languages = this.commonParameters.getLanguages();
        //let title = gridParams.title +' - '+Languages.get('params-'+gridParams.paramName)+' - '+Languages.get('time-step-simple')+' : '+gridParams.step;
        let title = gridParams.title +' - '+Languages.get('time-step-simple')+' - '+gridParams.step;

        console.log(title);

        return title;
    }


    async downloadFromServer(url, gridId, title, format='xlsx') {
        let data = this.gridInfo[gridId];
        data.fileFormat = format;
        console.log('Posting data:', data)
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        const blob = await response.blob(); // create a new Blob object.
        const tempUrl = window.URL.createObjectURL(blob); // create a new object hydraId
        const a = document.createElement("a"); // create a new anchor element
        a.href = tempUrl; // set its href to the object URL
        a.download = title+'.'+format;  // set its download attribute to the deisred filename.
        a.click(); // programmatically clicking the anchor element to trigger the file download.
    }


    /**
     *
     * @param gridId
     * @param format
     */
    downloadGrid(gridId, format='pdf') {
        let grid = this.grids[gridId];
        let title = this.formatTitle(gridId);
        if (typeof grid === 'undefined') {
            alert('Grid doesnt exist yet.');
            return;
        }
        switch(format) {
            case 'pdf' :
                try {
                    // grid.download("pdf", title+".pdf", {
                    //     orientation:"portrait", //set page orientation to portrait
                    //     title:"Example Report", //add title to report
                    // });
                    if (this.isLocalFileLocation()) {
                        grid.download("pdf", title+".pdf", {
                            orientation:"portrait", //set page orientation to portrait
                            title:"Example Report", //add title to report
                        });
                    } else {
                        this.downloadFromServer('/export', gridId, title, 'pdf')
                    }
                } catch (e) {
                    alert('Error while generating PDF. See console for details.');
                    console.log(e);
                }

                break;
            case 'xlsx':
                try {
                    // TODO : implement a mechanism that checks if the data is too large for old way download. If so, use downloadFromServer

                    // old way
                    //grid.download("xlsx", "data.xlsx");
                    if (this.isLocalFileLocation()) {
                        grid.download("xlsx", "data.xlsx");
                    } else {
                        this.downloadFromServer('/export', gridId, title, 'xlsx');
                    }


                } catch(e) {
                    alert('Error while generating XLSX. See console for details.');
                    console.log(e);
                }
                break;
            case 'csv':
                try {
                    if (this.isLocalFileLocation()) {
                        grid.download("csv", title+".csv");
                    } else {
                        this.downloadFromServer('/export', gridId, title, 'csv')
                    }
                } catch(e) {
                    alert('Error while generating CSV. See console for details.');
                    console.log(e);
                }
                break;
            case 'json':
                try {
                    if (this.isLocalFileLocation()) {
                        grid.download("json", title+".json");
                    } else {
                        this.downloadFromServer('/export', gridId, title, 'json')
                    }

                } catch(e) {
                    alert('Error while generating JSON. See console for details.');
                    console.log(e);
                }
                break;
        }
    }

}

window.RocketDataTableBase = RocketDataTableBase;