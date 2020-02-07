/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener } from 'c/pubsub';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Rate', fieldName: 'Rate', sortable: "true" },
    { label: 'Price', fieldName: 'Price', sortable: "true"},
    { label: 'Margin', fieldName: 'Margin', sortable: "true"},

];
export default class AppCloneModal extends LightningElement {
    @track openAppClone 
    @track appId
    @track columns = columns; 
    @wire(CurrentPageReference) pageRef; 
    connectedCallback(){
        console.log('in appClone');
        
        registerListener('appClone', this.openClone, this);
    }
    disconnectedCallback(){
        unregisterListener(this); 
    }

    openClone(apID){
        this.openAppClone = true; 
        this.appId = apID; 
    }
    closeAppClone(){
        this.openAppClone = false; 
    }
}