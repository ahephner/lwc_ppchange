import { LightningElement, api, track } from 'lwc';

const columns = [
    {label:'Product #', fieldName: 'Name'},
    {label: 'Name', fieldName:'Product_Name__c'}, 
    {label: 'Description', fieldName:"Product_Description__c"},
];

export default class ProductTiles extends LightningElement {
    @api good;
    @track columns = columns;
    handleOpenRecordClick(){
        const selectEvent = new CustomEvent('handlegood', {
            bubbles : true,
            detail: this.good.Id
        });
        this.dispatchEvent(selectEvent); 
    }
}