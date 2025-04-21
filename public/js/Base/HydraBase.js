
export default class HydraBase {
    name = '';
    id = null;
    hydraId = null;
    data = {};
    wasUpdated = true;



    /**
     @param {object} hydraData
     @param {string} hydraData[\@id]
     @param {object} hydraData.data
     @param {number} hydraData.id
     @param {string} hydraData.name
     @param {boolean} isNewModule
     @returns {HydraBase}
     */
    constructor(hydraData, isNewModule = true) {
        this.data = hydraData.data || {};
        this.name = hydraData.name || hydraData.data.name;
        this.id = hydraData.id || null;
        this.hydraId = hydraData["@id"] || null;
        this.wasUpdated = isNewModule;
    }

    async save() {
        return this;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.wasUpdated = true;
        this.data = data;
    }

    getHydraId() {
        return this.hydraId;
    }

    setHydraId(hydraId) {
        this.hydraId = hydraId;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getDependentData(data) {
        return data;
    }

    getStructure() {
        let data = this.getData();
        data.name = this.getName();
        return this.getDependentData(data);
    }

}

window.BuilderModuleBase = HydraBase;