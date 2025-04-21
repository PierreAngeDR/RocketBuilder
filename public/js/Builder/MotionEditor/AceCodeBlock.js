export default class AceCodeBlock {
    static get toolbox() {
        return false; // pas besoin d’outils visibles
    }

    constructor({ data }) {
        this.data = data || { code: '' };
        this.editor = null;
        this.wrapper = null;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'ace-editor-wrapper';
        this.wrapper.id = 'ace-' + Math.random().toString(36).substring(2, 9);

        // 🔒 Désactive contenteditable sur la zone Ace (important pour empêcher les conflits avec Editor.js)
        this.wrapper.setAttribute('contenteditable', 'false');

        // 🧠 Empêche Editor.js de capter les touches (dont Enter)
        this.wrapper.addEventListener('keydown', (e) => e.stopPropagation());
        this.wrapper.addEventListener('mousedown', (e) => e.stopPropagation());

        // ⏳ Initialise Ace une fois le DOM prêt
        setTimeout(() => {
            const parentBlock = this.wrapper.closest('[contenteditable]');
            if (parentBlock) {
                parentBlock.setAttribute('contenteditable', 'false');
                parentBlock.onkeydown = (e) => e.stopPropagation();
                parentBlock.onkeyup = (e) => e.stopPropagation();
                parentBlock.onkeypress = (e) => e.stopPropagation();
            }

            this.editor = ace.edit(this.wrapper.id);
            this.editor.session.setMode("ace/mode/javascript");
            this.editor.setValue(this.data.code || '', 1);
            this.editor.setOptions({
                fontSize: "14px",
                showPrintMargin: false,
                useSoftTabs: true,
                tabSize: 2,
                highlightActiveLine: true
            });

            this.editor.container.style.pointerEvents = 'auto';
            this.editor.container.style.zIndex = '10';
            this.editor.container.style.position = 'relative';
            this.editor.resize();
            this.editor.focus();
        }, 0);

        return this.wrapper;
    }



    save() {
        return {
            code: this.editor ? this.editor.getValue() : ''
        };
    }
}

window.AceCodeBlock = AceCodeBlock;