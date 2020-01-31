/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener } from 'c/pubsub';

export default class AppCloneModal extends LightningElement {
    @track openAppClone 

    @wire(CurrentPageReference) pageRef; 
    connectedCallback(){
        console.log('in appClone');
        
        registerListener('appClone', this.openClone, this);
    }
    disconnectedCallback(){
        unregisterListener(this); 
    }

    openClone(){
        this.openAppClone = true; 
    }
    closeAppClone(){
        this.openAppClone = false; 
    }
}