//this file is the engine to the custom # of inserts. If a user selects
//custom in number of apps drop down this registerListner grabs opens modal
/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import { registerListener, unregisterListener, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Modal extends LightningElement {
    @track openmodal = false;
    @api recordId; 
    @track timeApart;
    @track total; 
    @track value; 

    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        registerListener('custom', this.handleShowModal,this);
        
    }

    disconnectedCallback(){
        unregisterListener(this);
    }

    get options() {
        return [
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
        ];
    }
    handleShowModal() {
        console.log('listening');
        this.openmodal = true; 
    }

    handleOption(event){
        this.value = event.detail.value; 
    }
    closeModal(){
        this.openmodal = false; 
    }
    totalApps(event){
        this.total = event.detail.value;
        console.log(this.total);
        
    }
    number(event){
        this.timeApart = event.detail.value;
        
    }
    saveArea(){
        const value = new CustomEvent('custApp',{
            detail:{
                total: this.total,
                timeBetween: this.timeApart,
                spread: this.value
            }
        });
        fireEvent(this.pageRef, 'customApps',value); 
        this.closeModal(); 
    }
}
