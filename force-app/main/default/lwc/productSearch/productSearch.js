/* eslint-disable no-console */
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { LightningElement, track, wire } from 'lwc';
import searchGoods from '@salesforce/apex/searchProds.searchGoods'; 
    
export default class ProductSearch extends NavigationMixin(LightningElement) {
        @track searchProd;
        @track goods;
         
        //@track tableLoadingState = true; 
//get current page reference store in pageRef
        @wire(CurrentPageReference) pageRef; 
        //wire apex searchGOods method with the searchProd term then set goods equal to results
        @wire(searchGoods,{searchProd: '$searchProd'})
        loadGoods(result){
            this.goods = result;
            // eslint-disable-next-line no-undef
            
            //pubsub needs to be added 
            //to share across components 
                 if(result.data){
                     fireEvent(this.pageRef, 'productListUpdate', result.data); 
                 }
        }
 
        searchChange(event){
            window.clearTimeout(this.delayTimeout);
            const searchProd = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchProd = searchProd;
            }, 300); 
            
        }
        get hasResults() {
            //console.log('in has Results')
            console.log(this.goods.data);
            return (this.goods.data.length > 0); 
        }
        
        handlegood(event) {
               const goodId = event.detail; 
               console.log(goodId); 
                // Navigate to bear record page
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: goodId,
                        objectApiName: 'Product__c',
                        actionName: 'view',
                    },
                });
        }
    }
