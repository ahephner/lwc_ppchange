import { LightningElement, wire, track, api  } from 'lwc';
import getAreas from '@salesforce/apex/appProduct.getAreas';
export default class AppArea extends LightningElement {

    @track area; 
    @api recordId; 
    @wire(getAreas,{recordId: '$recordId'})
        areaList;
     
     get areaOptions(){
         // eslint-disable-next-line no-console
         console.log('==> '+JSON.stringify(this.areaList.data)); 
         return this.areaList.data; 
     }   

     selectArea(e){
        this.value = e.detail.value 
    }
}