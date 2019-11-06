import { LightningElement, track } from 'lwc';

export default class AppRateConvert extends LightningElement {
    @track input; 
    @track m;
    @track acre;
    info(event){
        // eslint-disable-next-line radix
        this.input = parseInt(event.target.value);
        this.m = (this.input / 43.56).toFixed(3);
        this.acre = (this.input * 43.56).toFixed(2); 
    }
}