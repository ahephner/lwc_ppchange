import { LightningElement, api } from 'lwc';


export default class AppProductList extends LightningElement {
    //import form appProductSearch
    @api prods; 

    handleSelect(event){
        //prevent default behavoir of a tag
        event.preventDefault();
        //
        const selectEvent = new CustomEvent('productselect', {
            bubbles: true
          
        }); 
        
        
        this.dispatchEvent(selectEvent); 
    }
}