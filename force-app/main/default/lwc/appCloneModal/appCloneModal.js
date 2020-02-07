/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener } from 'c/pubsub';
import cloneProducts from '@salesforce/apex/ProgramCloneWithApps_Controller.cloneProducts';
const columns = [
    { label: 'Name', fieldName: 'Product_Name__c',  cellAttributes: { alignment: 'left' },  sortable: "true" },
    { label: 'Rate', fieldName: 'Report_Rate__c',   cellAttributes: { alignment: 'left' }},
    { label: 'Price', fieldName: 'Unit_Price__c', type:'currency',  cellAttributes: { alignment: 'left' },  sortable: "true"},
    { label: 'Margin %', fieldName: 'Margin__c', type:'number',  cellAttributes: { alignment: 'left'},  sortable: "true"},

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

    //sorting
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;

    }
}