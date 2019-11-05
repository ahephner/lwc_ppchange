import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class SteelGreenQuestions extends LightningElement {
    @api recordId;
    @api objectApiName; 
 success(){
     this.dispatchEvent(
         new ShowToastEvent({
             title: 'Success',
             message:'Questions Recorded',
             variant: 'success'
         })
     )
 }
}