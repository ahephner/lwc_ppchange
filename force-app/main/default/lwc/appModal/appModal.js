/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { registerListener, unregisterListener, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AREA_OBJECT from '@salesforce/schema/Area__c'; 
import NAME_FIELD from '@salesforce/schema/Area__c.Name';
import DATE_FIELD from '@salesforce/schema/Area__c.Date__c';
import SQF_FIELD from '@salesforce/schema/Area__c.Area_Sq_Feet__c';
import ACRE_FIELD from '@salesforce/schema/Area__c.Area_Acres__c';
import TYPE_FIELD from '@salesforce/schema/Area__c.Type__c';  
import PROGRAM_FIELD from '@salesforce/schema/Area__c.Program__c';  

export default class AppModal extends LightningElement {
        @track openAppModal = false; 
        @track note; 
        @track areaName;
        @track areaDate;
        @track areaAcres;
        @track areaType;
        @track areaId;
        @track proId; 
        @track feet; 
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
        newFeet(e){
            this.feet = e.detail.value;
            console.log(this.feet);
            
        }
        newAcre(e){
            this.areaAcres = e.detail.value; 
            console.log(this.areaAcres, ' areaAcre');
                        
        }
        newType(e){
            this.note = e.detail.value; 
            console.log(this.note, ' this note');
            
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
            fields[SQF_FIELD.fieldApiName] = this.feet;
            fields[ACRE_FIELD.fieldApiName] = this.areaAcres;
            fields[TYPE_FIELD.fieldApiName] = this.note;
            fields[PROGRAM_FIELD.fieldApiName] = this.recordId;
            console.log(fields);
            
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
