/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import docSearch from '@salesforce/apex/docSearchController.docSearch'
export default class App extends LightningElement {
    /**
     * @track indicates that if this object changes,
     * the UI should update to reflect those changes.
     */
     @track dateOne;
     dateTwo;
     prodNum;
     yn = false;
    @track call; 
    @track error  
    dateOneChange(event){
        this.dateOne = event.target.value;
    }
    dateTwoChange(event){
        this.dateTwo = event.target.value;
    }
    prodNumChange(e){
        this.prodNum = e.target.value;
    }
    ynChange(e){
        this.yn = e.target.checked; 
    }
   handleSearch(){
       let  parameters = {
            one: this.dateOne,
            two: this.dateTwo, 
            check: this.yn, 
            prodName: this.prodNum, 
           
       }; 
       console.log(parameters.one)
       console.log(parameters.prodName)
       docSearch({wrapper: parameters})
            .then(results =>{
                this.call = results;
                this.error = undefined;
            })
            .catch(error=>{
                this.call = undefined;
                this.error = error; 
            }); 
   }
   
}
