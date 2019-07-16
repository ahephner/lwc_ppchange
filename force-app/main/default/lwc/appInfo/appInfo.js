/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi'
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'

const fields = [PRODUCT_NAME, PRODUCT_ID];
export default class AppInfo extends LightningElement {
    recordId; 

    @track appName;
    @track appDate; 
    @track areaId; 
    @track name; 
    @track productId;  
    @track newProds = [{}]; 
     
    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProduct({error, data}){
        if(data){
            this.newProds = [
            ...this.newProds, {
            Id: this.name = getFieldValue(data, PRODUCT_ID), 
            name: this.productId = getFieldValue(data, PRODUCT_NAME), 
            rate:0 
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
            registerListener('areaSelect', this.handleNewArea, this);
        }
        disconnectedCallback(){
            unregisterAllListeners(this);
        }

        handleProductSelected(prodsId){
            // eslint-disable-next-line no-console
            //console.log('handle product ' +prodsId)
            this.recordId = prodsId; 
    }

    handleNewArea(v){
        this.areaId = v;
    }
    date(e){
        this.appDate = e.detail.value; 
    }

    newName(e){
        this.appName = e.detail.value; 
    }
    rate(e){
        this.newProds.rate = e.detail.value 
    }
    insertApp(){
           this.newProds.forEach(function(x){
               console.log('loop ' +x.name); 
           })
        console.log(this.newProds);
        console.log('area ' + this.areaId);
        console.log('date '+ this.appDate);
        console.log('app name ' + this.appName)
    }

}