/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { registerListener, unregisterListener, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AREA_OBJECT from '@salesforce/schema/Area__c'; 
import NAME_FIELD from '@salesforce/schema/Area__c.Name';
import DATE_FIELD from '@salesforce/schema/Area__c.Date__c';
import SQ_FIELD from '@salesforce/schema/Area__c.Area_Sq_Feet__c';
import ACRE_FIELD from '@salesforce/schema/Area__c.Area_Acres__c';
import TYPE_FIELD from '@salesforce/schema/Area__c.Type__c';  
import PROGRAM_FIELD from '@salesforce/schema/Area__c.Program__c';  

export default class AppModal extends LightningElement {
        @track openAppModal = false; 
        @track note; 
        @track areaName;
        @track areaDate;
        @track areaSq;
        @track areaAcres;
        @track areaType;
        @track areaId;
        @track proId; 
        @api recordId; 
        //get api values from object settings
        get setNotes(){
            return [
                {label:'Athletic Field' , value: 'Athletic Field'},
                {label:'Greens', value: 'Greens'},
                {label:'Tees', value: 'Tees'},
                {label:'Fairways' , value: 'Fairways'},
                {label:'Fairways/Tees' , value: 'Fairways/Tees'},
                {label:'Rough' , value: 'Rough'},
                {label:'Other' , value: 'Other'} 
            ]
        }   

        @wire(CurrentPageReference) pageRef;

        connectedCallback(){
            registerListener('newArea', this.appSelected, this);
        }

        disconnectedCallback(){
            unregisterListener(this);
        }
        //input field actions
        newName(e){
            this.areaName = e.detail.value;
            this.areaId = undefined; 
            
        }
        newDate(e){
            this.areaDate = e.detail.value;
        }
        newSq(e){
            this.areaSq = e.detail.value;
        }
        newAcre(e){
            this.areaAcres = e.detail.value;             
        }
        newType(e){
            this.note = e.detail.value; 
            
        }
        //open modal
        appSelected(){
            this.openAppModal = true; 
        }

        //can call this in other modals
        closeModal(){
            this.openAppModal = false; 
        }
        
        saveArea(){
            const fields ={}; 
            fields[NAME_FIELD.fieldApiName] = this.areaName;
            fields[DATE_FIELD.fieldApiName] = this.areaDate;
            fields[SQ_FIELD.fieldApiName] = this.areaSQ;
            fields[ACRE_FIELD.fieldApiName] = this.areaAcres;
            fields[TYPE_FIELD.fieldApiName] = this.note;
            fields[PROGRAM_FIELD.fieldApiName] = this.recordId;
         
            const recordInput = {apiName: AREA_OBJECT.objectApiName, fields};
            //create record
            createRecord(recordInput)
            .then(area => {
                this.areaId = area.id; 
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Area created',
                        variant: 'success',
                    }),
                );
            })
            .then(this.openAppModal = false)
            .then(()=>{
                fireEvent(this.pageRef, 'options', this.areaId)
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                    console.log(JSON.stringify(error))
                );
            });
    }
            
}

