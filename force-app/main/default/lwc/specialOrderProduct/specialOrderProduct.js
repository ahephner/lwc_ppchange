import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor';
import getItems from '@salesforce/apex/specialOrderCloneWProducts.getOrderRequestItems';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {label:'Product Requested', 'fieldName':'nameURL', type:'url', typeAttributes:{label:{fieldName:'product'}},target:'_blank' },
    {label:'QTY', 'fieldName':'Quantity_Requested__c', type:'number' },
    {label:'Unit Cost', 'fieldName':'Unit_Cost__c', type:'currency'},    
    {label:'Min Margin', 'fieldName':'Minimum_Margin__c', type:'percent-fixed' },
    {label:'Sales Margin', 'fieldName':'Sales_Margin__c', type:'percent-fixed',  editable:true},
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
                let nameURL
                this.items = result.data.map(row =>{
                    product = row.ATS_Product__c ? row.ATS_Product__r.Product_Name__c : row.Product_Description__c;
                    nameURL = `/${row.Id}`;
                    return {...row, nameURL, product}
                })
                console.log(this.items);
                
                
            }else if(result.error){
                this.items = undefined;
                console.log(result.error);
            }
        }
//Refresh
        @api
        async refresh(){
            this.isLoading = true;
            console.log('refresh');
            await refreshApex(this.requestItems);
            this.isLoading = false;
        }
     
        //save From the Table
        handleSave(event){
            this.isLoading = true;
        
            const recordInputs =  event.detail.draftValues.slice().map(draft => {
                const fields = Object.assign({}, draft);
                return { fields };
            });
            const promises = recordInputs.map(recordInput => updateRecord(recordInput));
            Promise.all(promises).then(prod => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Ship It!',
                        variant: 'success'
                    })
                );
                    
                
                 // Display fresh data in the datatable
               return this.refresh();
            }).catch(error => {
                console.log(error);
                
                // Handle error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Margin Error',
                        message: error.body.output.errors[0].message,
                        variant: 'error'
                    })
                )
            }).finally(() => {
                console.log('finally');
                
                this.draftValues = []; 
                this.isLoading = false
                
            });  
        } 


}