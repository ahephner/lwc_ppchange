import { LightningElement, track } from 'lwc';
//need apex class 
export default class App extends LightningElement {
   //@api recordid
    @track dateOne ='';

    @track dateTwo;
    @track prodNum
    @track yn = false; 
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
//    handleSearch(){
//        this.dateOne = dateOne;
//        this.dateTwo = dateTwo;
//        this.prodNum = prodNum; 
//    }
   
}
