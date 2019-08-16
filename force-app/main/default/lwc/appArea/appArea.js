import { LightningElement, wire, track, api  } from 'lwc';
import getAreas from '@salesforce/apex/appProduct.getAreas';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners,fireEvent } from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';

export default class AppArea extends LightningElement {

    @track area; 
    @api recordId;
    
    @wire(CurrentPageReference) pageRef;

    @wire(getAreas,{recordId: '$recordId'})
        areaList
        
     //return label value array from custom apex wrapper
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

    //open Modal 
    newArea(){
        // eslint-disable-next-line no-console
        console.log('in app area ' +this.recordId)
        fireEvent(this.pageRef, 'newArea', this); 
    }

    //listen for new area
    connectedCallback(){
        registerListener('options', this.addedOption, this);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }
    //will update the drop down with new value
    addedOption(){
        return refreshApex(this.areaList)
       
    }
   
}