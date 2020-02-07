/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener } from 'c/pubsub';
import cloneProducts from '@salesforce/apex/ProgramCloneWithApps_Controller.cloneProducts';
const columns = [
    { label: 'Name', fieldName: 'Product_Name__c',  cellAttributes: { alignment: 'left' } },
    { label: 'Rate', fieldName: 'Report_Rate__c',   cellAttributes: { alignment: 'left' }},
    { label: 'Price', fieldName: 'Unit_Price__c', type:'currency',  cellAttributes: { alignment: 'left' }},
    { label: 'Margin', fieldName: 'Margin__c', type:'percent',  cellAttributes: { alignment: 'left' }},

];
export default class AppCloneModal extends LightningElement {
    @track openAppClone; 
    @track appId;
    @track columns = columns; 
    @track data;
    @track numClone;
    @track time;
    @track appName;
    @track initialDate 
    @track area; 

    @wire(CurrentPageReference) pageRef; 
    
    @wire(cloneProducts, {app: '$appId'})
        wiredList(result){
            console.log('going' + this.appId);
            
            if(result.data){        
                //console.log(result.data);
                this.data = result.data;
                this.appName = result.data[0].Application__r.Name;
                this.initialDate = result.data[0].Application__r.Date__c
                this.area = result.data[0].Application__r.Area__c 
                this.error = undefined; 
                
            }else if(result.error){
                this.error = result.error
                this.data = undefined
                console.log(this.error);
                
            }
        }
    connectedCallback(){
        registerListener('appClone', this.openClone, this);
    }
    disconnectedCallback(){
        unregisterListener(this); 
    }

//track input changes
    numberOfClones(i){
        this.numClone = i.detail.value; 
    }

    time(y){
        this.time = y.detail.value; 
    }
    //button functions
    openClone(apID){
        this.openAppClone = true; 
        this.appId = apID; 
    }
    closeAppClone(){
        this.openAppClone = false; 
    }
}