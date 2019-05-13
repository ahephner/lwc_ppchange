/* eslint-disable no-console */
import { LightningElement,  track } from 'lwc';
//import search from '@salesforce/apex/contactSearch.search'
export default class SearchContact extends LightningElement {
    @track name = '';
    
   // @wire(search,{name: '$name'})
    //contacts; 

    look(event){
        
        this.name = event.target.value; 
    }
}