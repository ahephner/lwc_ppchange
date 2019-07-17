/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {getRecord, getFieldValue, createRecord } from 'lightning/uiRecordApi'
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/idsUtils';

import APP_OBJECT from '@salesforce/schema/Application__c'
import APP_NAME from '@salesforce/schema/Application__c.Name'
import AREA from '@salesforce/schema/Application__c.Area__c'
import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'

const xfields = [PRODUCT_NAME, PRODUCT_ID];
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

    @wire(getRecord, {recordId: '$recordId', xfields})
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
        console.log('area ' + this.areaId);
        // console.log('date '+ this.appDate);
        console.log('app name ' + this.appName)
        const fields = {}
        fields[AREA.fieldApiName] = this.areaId
        fields[APP_NAME.fieldApiName] = this.appName
        console.log(fields)
        const recordInput = {apiName: APP_OBJECT.objectApiName, fields};
        
        createRecord(recordInput)
            .then(application__c => {
                this.appId = application__c.id; 
                console.log('new appID ' +application__c)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'App created',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: reduceErrors(error).join(', '),
                        variant: 'error',
                       
                    }),
                ); 
            });
    }
}

