/* eslint-disable no-console */
//import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
//import { fireEvent } from 'c/pubsub';
import { LightningElement, track, wire } from 'lwc';
import searchGoods from '@salesforce/apex/searchProds.searchGoods'; 
export default class ProductSearch extends LightningElement {
        @track searchProd;
        @track goods;

        @wire(searchGoods,{searchProd: '$searchProd'})
         
        loadGoods(results){
            this.goods = results;
                // if(results.data){
                //     fireEvent(this.pageRef, 'productListUpdate', results.data); 
                // }
        }
        searchChange(event){
            window.clearTimeout(this.delayTimeout);
            const searchProd = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchProd = searchProd;
            }, 300); 
              
            
        }

}