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
     //runs on load
     get areaOptions(){
         // eslint-disable-next-line no-console
         //console.log('==> '+JSON.stringify(this.areaList.data)); 
         return this.areaList.data; 
     }   
    //this function will fire the value or id to appinfo
    //then it find the index of the value and the label value to pass to appInfo..then in the appInfo we will handle it in aName()
     selectArea(e){
        fireEvent(this.pageRef, 'areaSelect', e.detail.value )
            //filter off this value set areaName to equal the return then send it to the app info using the fire event.  
                // let x = this.areaList.data.findIndex(a => a.value === e.detail.value)  
                // let y = this.areaList.data[x].label
                // // eslint-disable-next-line no-console
                // console.log(y);
                //   fireEvent(this.pageRef, 'areaName', y);
                
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