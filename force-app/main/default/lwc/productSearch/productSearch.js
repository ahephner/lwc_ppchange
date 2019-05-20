/* eslint-disable no-console */
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
//import { fireEvent } from 'c/pubsub';
import { LightningElement, track, wire } from 'lwc';
import searchGoods from '@salesforce/apex/searchProds.searchGoods'; 
    const columns = [
        {label:'Product #', fieldName: 'Name'},
        {label: 'Name', fieldName:'Product_Name__c'}, 
        {label: 'Description', fieldName:"Product_Description__c"},
    ];
export default class ProductSearch extends LightningElement {
        @track searchProd;
        @track goods;
        @track columns = columns; 
        @track tableLoadingState = true; 

        @wire(CurrentPageReference) pageRef; 
        @wire(searchGoods,{searchProd: '$searchProd'})
         
        loadGoods(result){
            this.goods = result;
            // eslint-disable-next-line no-undef
            this.tableLoadingState = false; 
            //pubsub needs to be added 
                // if(result.data){
                  //   fireEvent(this.pageRef, 'productListUpdate', result.data); 
                 //}
        }
        connectedCallback() {
            
        }
        searchChange(event){
            window.clearTimeout(this.delayTimeout);
            const searchProd = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchProd = searchProd;
            }, 300); 
            
        }

        
            handleProductView(event) {
                // Navigate to bear record page
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: event.target.good.Id,
                        objectApiName: 'Product__c',
                        actionName: 'view',
                    },
                });
        }
    }
