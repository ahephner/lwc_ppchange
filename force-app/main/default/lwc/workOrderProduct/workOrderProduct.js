import { LightningElement, api, wire } from 'lwc';
import getWorkOrderProd from '@salesforce/apex/workOrderProducts.getWorkOrderProd';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

export default class WorkOrderProduct extends LightningElement {
    columns = [
       // {label: 'Line Numb', fieldName:'LineItemNumber', type:'text', editable: false },
       {label: 'Goal', fieldName: 'nameURL', type:'url', typeAttributes: {label: {fieldName: 'LineItemNumber'}}, target: '_blank'},
       {label:'Product', fieldName: 'Product_Name__c', type:'text', editable: false},
        {label:'Code', fieldName: 'Product_Code__c',  type:'text', editable: false},
        {label:'Qty', fieldName:'Quantity',  type:'number',cellAttributes: { alignment: 'center' }, editable: true },
        {label:'Cost', fieldName:'Cost__c',  type:'currency',cellAttributes: { alignment: 'center' }, editable: true },
        {label:'Unit Price', fieldName:'UnitPrice',  type:'currency',cellAttributes: { alignment: 'center' }, editable: true },
        {label:'Total Price', fieldName:'TotalPrice',  type:'currency',cellAttributes: { alignment: 'center' }, editable: true },
       // {label:'Ship Prod To', fieldName:'Ship_Product_To__c',  type:'text', editable: false },
        //{label:'Ship Vend', fieldName:'Ship_Product_Vendor__c',  type:'text', editable: false },
        //{label:'Ship #', fieldName:'Ship_Product__c',  type:'text', editable: true },
        {label:'Cost Valid', fieldName:'Cost_Validated__c',  type:'boolean',cellAttributes: { alignment: 'center' }, editable: true },
        {label:'Line Desc', fieldName:'Line_Description__c',  type:'text', editable: true }
    ]
    
    //private
    workOrder
    isLoading
    workOrderProductList
    wop 
    error 
    @api
    get recordId(){
        return this.workOrder
    }
    set recordId(value){
        this.setAttribute('workOrder', value);
        this.workOrder = value; 
        //this.getProd(); 
    }

    @wire(getWorkOrderProd, {recordId: '$workOrder'})
        wiredWO(result){
            this.workOrderProductList = result; 
            if(result.data){
                let nameURL;
                this.wop = result.data.map(row=>{
                    nameURL = `/${row.Id}`
                    return {...row, nameURL}
                });
            }else if(result.error){
                this.wop = undefined;
                console.log(result.error);
                
            }
        }

    // getProd(){
    //         if(this.workOrder == null || this.workOrder == undefined){
    //             return; 
    //         }
    //         this.isLoading = true
    //         getWorkOrderProd({recordId: this.recordId})
    //           .then((resp)=>{
    //               this.wop = resp;
    //               console.log('apex ' +this.wop);
                  
    //           }).catch((error)=>{
    //               this.error = error.message; 
    //           }).finally(()=> this.isLoading = false)
    // }

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
            
            // Handle error
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'error',
                    variant: 'error'
                })
            )
        }).finally(() => {
            console.log('finally');
            
            this.draftValues = []; 
            this.isLoading = false
            
        });  
    }
    @api
    async refresh(){
        this.isLoading = true;
        console.log('refresh');
        await refreshApex(this.workOrderProductList);
        this.isLoading = false;
    }
}