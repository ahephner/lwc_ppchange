import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'

const fields = [PRODUCT_NAME];
export default class GoodMargin extends LightningElement {
     recordId; 
    @track name ; 

    @wire(CurrentPageReference) pageRef; 
   
    @wire(getRecord, {recordId: '$recordId', fields })
        wiredProduct({error, data}){
            if(data){
                this.name = getFieldValue(data, PRODUCT_NAME); 
                this.error = undefined;
            }else if (error){
                this.error = error;
                this.name = undefined;
            }
        }

        connectedCallback(){
            // eslint-disable-next-line no-console
            console.log('callback')
            registerListener('productListUpdate', this.handleProduct, this); 
        }

        disconnectedCallback(){
            unregisterAllListeners(this);
        }

        handleProduct(prodId){
            // eslint-disable-next-line no-console
            console.log(prodId)
            this.recordId = prodId; 
    }
}