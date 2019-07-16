import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi'
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'
//may need to also query product__c id
const fields = [PRODUCT_NAME, PRODUCT_ID];
export default class AppInfo extends LightningElement {
    recordId; 

    @track name; 
    @track productId;  
    @track newProds = [{Id:'', name: ''}]; 

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProduct({error, data}){
        if(data){
            this.newProds = [
            ...this.newProds, {
            Id: this.name = getFieldValue(data, PRODUCT_ID), 
            name: this.productId = getFieldValue(data, PRODUCT_NAME) 
            }]; 
            this.error = undefined;
        }else if (error){
            this.error = error;
            this.name = undefined;
        }
    }

        connectedCallback(){
            // eslint-disable-next-line no-console
            console.log('callback')
            registerListener('productSelected', this.handleProductSelected, this); 
        }
        disconnectedCallback(){
            unregisterAllListeners(this);
        }

        handleProductSelected(prodsId){
            // eslint-disable-next-line no-console
            console.log('handle product ' +prodsId)
            this.recordId = prodsId; 
    }

}