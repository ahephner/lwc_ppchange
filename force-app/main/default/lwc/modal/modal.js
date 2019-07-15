import { LightningElement, track, api } from 'lwc';

export default class Modal extends LightningElement {
    @track openmodal = false;
    @api recordId; 
    handleShowModal() {
        this.openmodal = true; 
    }

    closeModal(){
        this.openmodal = false; 
    }
    saveArea(){
        // eslint-disable-next-line no-alert
        alert('save test');
        this.closeModal(); 
    }
}