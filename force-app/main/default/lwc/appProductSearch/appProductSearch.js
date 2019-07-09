/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import searchProduct from '@salesforce/apex/appProduct.searchProduct'

export default class AppProductSearch extends LightningElement {
    @track cat = 'ALL';

    @track searchKey;
    @track cat;
    @track prod; 


     get pc() {
        return [
            {label: 'All', value:'ALL'},
            {label: 'Herbicide', value:'Chemicals-Herbicide'},
            {label: 'Fungicide', value:'Chemicals-Fungicide'},
            {label: 'Insecticide', value:'Chemicals-Insecticide'},
            {label: 'PGR', value:'Chemicals-Growth Regulator'}, 
        ]; 
     }
     selectCat(e){
         this.cat = e.detail.value; 
     }
   @wire(searchProduct, {searchKey: '$searchKey', cat:'$cat'})
        loadProd(results){
            this.prod = results; 
            //console.log(this.prod);
            //console.log('here is search key '+this.searchKey)
            //console.log(this.cat);
        }
    get hasResults(){
        console.log(this.prod.data.length); 
        return (this.prod.data.length >0); 
    }
    searchProd(event){
        window.clearTimeout(this.delayTimeout);
            const searchKey = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchKey = searchKey;
            }, 400);
    }
}