/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getApps from '@salesforce/apex/appProduct.getApps';
import { deleteRecord } from 'lightning/uiRecordApi';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Area', fieldName: 'Area_Name__c', sortable: "true" },
    { label: 'Date', fieldName: 'Date__c', sortable: "true"},

    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class AppTable extends LightningElement {
    //programID
    @api recordId; 
    @track appList;
    @track columns = columns;
    @track sortBy; 
    @track sortDirection; 
    @track error; 
    @track test; 
    @track record; 
    @wire(CurrentPageReference) pageRef;
    
    wiredAppList;

    //get apps
    @wire(getApps, {recordId: '$recordId'})
        wiredList(result){
            this.wiredAppList = result; 
            if(result.data){
                this.appList = result.data; 
                this.error = undefined; 
            }else if(result.error){
                this.error = result.error 
                this.appList = undefined; 
            }

        }
        connectedCallback(){

            registerListener('newApp', this.newAppSubmit, this); 
        }

        disconnectedCallback(){
            unregisterAllListeners(this);
        }

        newAppSubmit(e){
            console.log('refresh!')
            console.log(this.test = e)
            return refreshApex(this.wiredAppList)
        }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row.Id;
        console.log('row outside '+row)
        switch (actionName) {
            case 'delete':
                deleteRecord(row)
                    .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success', 
                                message: 'App Deleted', 
                                variant: 'success'
                            }) 
                        ); return refreshApex(this.wiredAppList)
                    })
            
                break;
            case 'show_details':
                console.log(actionName, + " " +row)
                break;
            default:
        }
    }
    //handle sorting
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
        let parseData = JSON.parse(JSON.stringify(this.appList));

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
        this.appList = parseData;

    }

}
