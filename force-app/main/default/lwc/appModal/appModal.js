import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class AppModal extends LightningElement {
        @track openAppModal = false; 

        @wire(CurrentPageReference) pageRef;

        connectedCallback(){
            registerListener('appSelected', this.appSelected, this);
        }

        disconnectedCallback(){
            unregisterListener(this);
        }

        appSelected(){
            // eslint-disable-next-line no-console
            console.log('in appSelected')
            this.openAppModal = true; 
        }

        //can call this in other modals
        closeModal(){
            this.openAppModal = false; 
        }

}