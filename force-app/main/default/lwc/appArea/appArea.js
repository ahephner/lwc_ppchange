import { LightningElement, wire, track, api  } from 'lwc';
import getAreas from '@salesforce/apex/appProduct.getAreas';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
//import {fireEvent} from 'c/pubsub';

export default class AppArea extends LightningElement {

    @track area; 
    @api recordId;

    @wire(CurrentPageReference) pageRef;

    @wire(getAreas,{recordId: '$recordId'})
        areaList;
     
     get areaOptions(){
         // eslint-disable-next-line no-console
         console.log('==> '+JSON.stringify(this.areaList.data)); 
         return this.areaList.data; 
     }   

     selectArea(e){
        fireEvent(this.pageRef, 'areaSelect', e.detail.value )
        // eslint-disable-next-line no-console
       // console.log(this.area); 
    }

   
}