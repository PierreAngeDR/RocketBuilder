import Base from "../Base/Base.js";

export default class ExtensionBase extends Base {
    static defaultId = 'unknwon-extension';
    static defaultUiId = 'unknwon-extension-ui';
    currentId = null;
    managerUiId = null
    notLoggedInMessage = "Vous devez d'abord vous connecter pour créer/modifier quoi que ce soit."

    /**
     *
     * @param {ModelStorageManager} storageManager
     * @param {string|null} id
     */
    constructor(storageManager, id = null) {
        super();

        //this.currentId = this.getDefaultId();
        console.log(this.getDefaultId())
        this.setStorageManager(storageManager);
        this.setId(id);

        //this.init();
    }

    /**
     *
     * @returns {*}
     */
    getClassName() {
        return window[this.constructor.name];
    }

    getDefaultId() {
        return this.getClassName().defaultId;
    }

    /**
     *
     * @param {ModelStorageManager} storageManager
     */
    setStorageManager(storageManager) {
        this.storageManager = storageManager;
        return this;
    }

    setId(id = null) {
        console.log('SetId', id, this)
        if (null === id) {
            this.currentId = this.getDefaultId();
        } else {
            this.currentId = id;

        }
        console.log('self.defaultId', this.currentId);
        return this;
    }

    getCurrentId() {
        return this.currentId;
    }

    getManagerUiId() {
        return this.managerUiId || this.getDefaultId().defaultUiId;
    }

    click(isLoggedIn) {
        if (!isLoggedIn) {
            alert(this.notLoggedInMessage);
            return;
        }

        let element = document.getElementById(this.getCurrentId());
        console.log("click", element);
        if (element) {
            element.click();
        }
    }

    createInterfaceElement(elementName) {

        elementName = this.getCurrentId();
        console.log('init Base', elementName );

        // Add event listener to the button
        //let managerElement = document.getElementById(this.getCurrentId());
        let managerElement = document.getElementById(elementName);

        if (null === managerElement) {
            this.warn(`Model builder element with id ${elementName} not found. Skipping.`);
            return false;
        }


        // Create the root element of the UI.
        let element = document.createElement('div');
        element.id = this.getManagerUiId();
        document.body.appendChild(element);

        return true;
    }

    init() {}
}

window.ExtensionBase = ExtensionBase;