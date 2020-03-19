//this file is the engine to the custom # of inserts. If a user selects
//custom in number of apps drop down this registerListner grabs opens modal
/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import { registerListener, unregisterListener, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Modal extends LightningElement {
    @track openmodal = false;
    @api recordId; 
    @track numberOfApps;
    @track weeksApart; 

    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        registerListener('custom', this.handleShowModal,this);
        
    }

    disconnectedCallback(){
        unregisterListener(this);
    }

    handleShowModal() {
        console.log('listening');
        this.openmodal = true; 
    }


    closeModal(){
        this.openmodal = false; 
    }
    weeks(event){
        this.weeksApart = event.detail.value;
    }
    number(event){
        this.numberOfApps = event.detail.value;
        console.log(this.numberOfApps);
        
    }
    saveArea(){
        const value = new CustomEvent('custApp',{
            detail:{
                weeks: this.weeksApart,
                number: this.numberOfApps
            }
        });
        fireEvent(this.pageRef, 'customApps',value); 
        this.closeModal(); 
    }
}