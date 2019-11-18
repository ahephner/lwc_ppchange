/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';

export default class AppPDF extends LightningElement {
    @track _selected = [];
    @track pdfOptions; 
    @track ap;
    @track aa; 
    @track sp; 
    @track sa; 

    get choices(){
        return[
            {label: 'All Product Summary', value: 'AP'},
            {label: 'All App Spray Sheet', value: 'AA'},
            {label: 'Select Products', value: 'SP'},
            {label: 'Select Applications', value: 'SA'}
        ]
    }

    userSelect(input){
        if(input.detail.value ==='AP'){
            this.ap = true; this.aa = false;
            this.sp = false; this.sa = false; 
        }else if(input.detail.value ==='AA'){
            this.aa = true; this.ap = false;
            this.sp = false; this.sa = false; 
        }else if(input.detail.value === 'SP'){
            this.sp = true; this.aa = false;
            this.ap = false; this.sa = false; 
        }else if(input.detail.value === 'SA'){
            this.sa = true; this.aa = false;
            this.sp = false; this.ap = false; 
        }
    }

    //get id's as value 
    get prodOptions() {
        return [
            { label: 'Dismiss', value: 'ds' },
            { label: 'Quicksilver', value: 'qs' },
            { label: 'Insignia', value: 'isg' },
            { label: 'Seed', value: 'se' },
            { label: '22-0-5 .067 prod.', value: 'fert' },
            { label: 'Round Up', value: 'rp' },
        ];
    }
    get appOptions(){
        return [
            {label: 'June 1', value:'J'},
            {label: 'Dollar Spot', value:'DS'},
            {label: 'Weed and Feed', value:'WF'},
        ]
    }
    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    handleClick(){
        console.log('Ouch I was clicked')
    }
}