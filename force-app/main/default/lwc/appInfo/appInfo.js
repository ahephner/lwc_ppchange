/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi'
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import addApplication from '@salesforce/apex/addApp.addApplication'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'

const fields = [PRODUCT_NAME, PRODUCT_ID];
export default class AppInfo extends LightningElement {
    recordId; 
    @track appId; 
    @track appName;
    @track appDate; 
    @track areaId; 
    @track name;
    @track rate;  
    @track productId;  
    @track newProds = [{}]; 
     
    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProduct({error, data}){
        if(data){
            this.newProds = [
            ...this.newProds, {
            Id: this.productId = getFieldValue(data, PRODUCT_ID), 
            name: this.name = getFieldValue(data, PRODUCT_NAME), 
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
            //console.log('callback')
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
        this.appId = undefined;
    }
    // rate(e){
    //     this.newProds.rate = e.detail.value

    // }
    createApplication__c(){
       let params = {
           appName: this.appName,
           appArea: this.areaId,
           appDate: this.appDate
       };
       console.log(params)
        addApplication({wrapper:params})
            .then((resp)=>{
                this.appId = resp.Id; 
                console.log(this.appId);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Look at the applications tab!',
                        variant: 'success'
                    })
                );
            }).catch((error)=>{
                console.log(JSON.stringify(error)); 
            })
    }
}

