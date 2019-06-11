/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import docSearch from '@salesforce/apex/docSearchController.docSearch'
import Customer from '@salesforce/schema/Account.Customer__c'
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';

const fields = [Customer]; 
export default class App extends LightningElement {
     @api recordId; 
     @track rId; 
     @wire(getRecord, {recordId: '$recordId', fields })
        number({error, data}){
            if(data){
                this.rId = getFieldValue(data, Customer); 
                this.error = undefined;
            }else if(error){
                this.error = error; 
                this.rId = undefined; 
            }
        }
     
     
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
            custNum: this.rId     
       }; 
       
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
