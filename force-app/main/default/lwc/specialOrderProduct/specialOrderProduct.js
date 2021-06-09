import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor';
import getItems from '@salesforce/apex/specialOrderCloneWProducts.getOrderRequestItems';
const columns = [
    {label:'Product Requested', 'fieldName':'product', type:'text' },
    {label:'QTY', 'fieldName':'Quantity_Requested__c', type:'number' },
    {label:'Unit Cost', 'fieldName':'Unit_Cost__c', type:'currency'},    
    {label:'Min Margin', 'fieldName':'Minimum_Margin__c', type:'percent', editable:true },
    {label:'Sales Margin', 'fieldName':'Sales_Margin__c', type:'percent',  editable:true},
    {label:'Price', 'fieldName':'Unit_Price__c', type:'currency', editable:true},
]
export default class SpecialOrderProduct extends LightningElement {
    isLoading; 
    @api recordId;
    //make component aware of size
    @api flexipageRegionWidth;
    @api prop1; 
    columns = columns;
    requestItems;
    items; 
    formSize; 
    connectedCallback(){
        this.formSize= this.screenSize(FORM_FACTOR);
        console.log('formSize '+this.formSize);
    }
    //check screen size to show table on desktop and cards on mobile
    screenSize = (screen) => {
        return screen === 'Large'? true: false 
    }
    //get the items
    @wire(getItems, {recordId: '$recordId'})
        wiredResult(result){
            this.requestItems = result;
            if(result.data){
                let product; 
                this.items = result.data.map(row =>{
                    product = row.ATS_Product__c ? row.ATS_Product__r.Product_Name__c : row.Product_Description__c;
                    row.Minimum_Margin__c = row.Minimum_Margin__c/100;
                    row.Sales_Margin__c = row.Sales_Margin__c/100; 
                    return {...row, product}
                })
                console.log(this.items);
                
                
            }else if(result.error){
                this.items = undefined;
                console.log(result.error);
            }
        }
     


}