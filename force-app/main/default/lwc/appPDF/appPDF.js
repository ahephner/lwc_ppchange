/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getAreas from '@salesforce/apex/appProduct.getAreas';
import getAppPDF from '@salesforce/apex/appProduct.getAppPDF';
import allProds from '@salesforce/apex/programPDF.allProds'; 
import allArea from '@salesforce/apex/programPDF.allArea'; 
export default class AppPDF extends LightningElement {
    @track _selected = [];
    @track pdfOptions; 
    @track ap;
    @track aa; 
    @track sp; 
    @track sa; 
    @api recordId; 

    get choices(){
        return[
            {label: 'All Product Summary', value: 'AP'},
            {label: 'All Areas', value: 'AA'},
            {label: 'Select Area', value: 'SP'},
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

    @wire(getAreas,{recordId: '$recordId'})
        areaList
    
    @wire(getAppPDF, {recordId: '$recordId'})
        appList
    get areaOptions(){
        return this.areaList.data; 
    }

    get appOptions(){
        return this.appList.data; 
    }

    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    goBack(){
        window.history.back(); 
    }
    //All products 
    allProds(){
        allProds({id: this.recordId})
        .then((resp)=>{
            console.log(resp);
            
        })
    }
    //All areas
    allAreas(){
        console.log(this.recordId);
        
        allArea({proId: this.recordId})
        .then((resp)=>{
            console.log(resp);       
        })
        // .then(()=>{
        //     location.reload(); 
        //     window.history.back()
        // })
    }

    //select clicks 
        handleClick(){
        console.log(this._selected)
    }
}