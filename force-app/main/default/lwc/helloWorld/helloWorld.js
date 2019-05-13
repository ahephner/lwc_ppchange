import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi'; 
import USER_ID from '@salesforce/user/Id'; 
import NAME_FIELD from '@salesforce/schema/User.Name'

export default class HelloWorld extends LightningElement {
    @track greeting = 'hey there'
    @track error; 
    @track user;
    updateGreeting(event){
        this.greeting = event.target.value; 
    }
    
    @wire(getRecord, {
        recordId: USER_ID, 
        fields: [NAME_FIELD]
    })wireuser({
        error,
        data
    }){
        if(error){
            this.error = error;
        }else if(data){
            this.user = data.fields.Name.value; 
        }
    }
}