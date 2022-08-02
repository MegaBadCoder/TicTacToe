export class Modal {
    private tmpl = document.getElementById('modal').content.querySelector('.modal').cloneNode(true);
    private content;
    
    constructor(content) {
        this.content = content;
        this.initModalContent();
    }
    initModalContent() {
        this.tmpl.querySelector('.modal__content').appendChild(this.content);
    };

    showModal() {
        document.body.prepend(this.tmpl);
    }
    removeModal() {
        document.body.removeChild(this.tmpl)
    }
} 