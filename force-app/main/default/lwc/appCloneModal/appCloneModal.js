/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener } from 'c/pubsub';

export default class AppCloneModal extends LightningElement {
    @track openAppClone 
    @track appId 
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