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
            { label: 'Day', value: '1' },
            { label: 'Week', value: '7' },
            { label: 'Month', value: '30' },
        ];
    }
    //gets from connectedCallBack
    handleShowModal() {
        this.openmodal = true; 
    }
//weeks days months drop down
    handleOption(event){
        this.value = event.detail.value; 
    }
    closeModal(){
        this.openmodal = false; 
    }
    //the reason why I subtract by one is that the apex job is getting the original insert so if i wanted 3 apps 
    //and put 3 in I will get 4 apps 3 copies plus original 
    totalApps(event){
        this.total = event.detail.value ;
        console.log(this.total);
        
    }
    number(event){
        this.timeApart = event.detail.value;
        
    }
    //this sends the info to appInfo.js 
    saveArea(){
        this.value = this.value * this.timeApart; 
        
        //send this to appInfo. If we want to grab more info from this page
        //we can add a new key value pair the function in appInfo.js is customApps()
        const value = new CustomEvent('custApp',{
            detail:{
                total: this.total,
                timeBetween: this.value
            }
        });
        fireEvent(this.pageRef, 'customApps',value); 
        this.closeModal(); 
    }
}
