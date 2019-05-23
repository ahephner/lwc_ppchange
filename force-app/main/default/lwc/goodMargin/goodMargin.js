import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';


export default class GoodMargin extends LightningElement {
   @track name = '';
   @wire(CurrentPageReference) pageRef; //required by pubsub

    connectedCallback(){
        registerListener('productListUpdate', this.handleProductListUpdate, this);
    }

    disconnectedCallback(){
        //unsubscribe from the productListUpdate
        unregisterAllListeners(this)
    }

    handleProductListUpdate(goods){
        this.name = goods.Product_name__c; 
    }
}