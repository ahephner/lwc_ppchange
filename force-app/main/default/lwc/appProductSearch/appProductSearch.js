/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getAreas from '@salesforce/apex/appProduct.getAreas'; 


export default class AppProductSearch extends LightningElement {
    @track value= '';
    @track area; 
    @api recordId; 
    
    @wire(getAreas,{recordId: '$recordId'})
        areaList;
     
     get areaOptions(){
         console.log('==> '+JSON.stringify(this.areaList.data)); 
         return this.areaList.data; 
     }   
     get pc() {
        return [
            {label: 'Herbicide', value:'Herbicide'},
            {label: 'Fungicide', value:'Fungicide'},
            {label: 'Insecticide', value:'Insecticide'},
            {label: 'PGR', value:'PGR'}, 
        ]; 
     }
     selectCat(e){
         this.value = e.detail.value; 

     }
     selectArea(e){
         this.value = e.detail.value 
     }
}