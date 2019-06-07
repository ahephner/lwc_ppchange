import { LightningElement, track } from 'lwc';

export default class AccOrderPdf extends LightningElement {
    @track
    dateOne ='';

    @track
    dateTwo;
    @track prodNum
    dateOneChange(event){
        this.dateOne = event.target.value;
    }
    dateTwoChange(event){
        this.dateTwo = event.target.value;
    }
    prodNumChange(e){
        this.prodNum = e.target.value;
    }
   handleSearch(){
       //this.dateOne = dateOne;
       //bind to apex here use wrapper 
   }
}