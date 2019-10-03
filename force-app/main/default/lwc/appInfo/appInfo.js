/* eslint-disable radix */
/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {getRecord, getFieldValue, deleteRecord } from 'lightning/uiRecordApi'
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import addApplication from '@salesforce/apex/addApp.addApplication';
import addProducts from '@salesforce/apex/addApp.addProducts';
import updateApplication from '@salesforce/apex/addApp.updateApplication'
import updateProducts from '@salesforce/apex/addApp.updateProducts';
import appProducts from '@salesforce/apex/appProduct.appProducts'; 
import areaInfo from '@salesforce/apex/appProduct.areaInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import actual product field values 
import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'
import PRODUCT_SIZE from '@salesforce/schema/Product__c.Size__c'
import AVERAGE_COST from '@salesforce/schema/Product__c.Average_Cost__c'
const fields = [PRODUCT_NAME, PRODUCT_ID, PRODUCT_SIZE, AVERAGE_COST];
export default class AppInfo extends LightningElement {
    recordId; 
    @track noArea = true;
    @track notUpdate; 
    @track up;  
    @track appId; 
    @track appName;
    @track appDate; 
    @track areaId;
    @track areaName;
    @track areaSize;   
    @track name; 
    @track productSize; 
    @track productId; 
    @track appTotalPrice = 0;
    @track newProds = []
    @track upProds = [];
    nap = []; 
    updateAppId; 
    lastId = 0; 
    // @track areaName; 

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProduct({error, data}){
        if(data){
            this.lastId = this.lastId + 1; 
            //console.log(this.lastId)
            this.newProds= [
            ...this.newProds,   
             { Product__c:   this.productId = getFieldValue(data, PRODUCT_ID), 
               Product_Name__c:  this.name = getFieldValue(data, PRODUCT_NAME),
               Product_Size__c: this.productSize = getFieldValue(data, PRODUCT_SIZE), 
               Product_Cost__c: getFieldValue(data, AVERAGE_COST),
               Rate2__c: "0", 
               Unit_Area__c: '', 
               numb: this.lastId, 
               Application__c: '',
               Note__c: '' ,
               Units_Required__c: '',
               Unit_Price__c: "0",
               Margin__c: "0",
               Total_Price__c: "0"
             }]; 
             
            this.error = undefined;
        }else if (error){
            this.error = error;
            this.name = undefined;
        }
    console.log(this.newProds)
    }
    //this function listens for fireEvents in other components then sends those events to the correct function
    //in this componenent. forexample 'areaSelect' comes from appArea.js then the id is sent to handleNewArea(); 
        connectedCallback(){
            registerListener('productSelected', this.handleProductSelected, this); 
            registerListener('areaSelect', this.handleNewArea, this);
            registerListener('appSelected', this.update, this); 
        }
        disconnectedCallback(){
            unregisterAllListeners(this);
        }

        handleProductSelected(prodsId){
            // eslint-disable-next-line no-console
            //console.log('handle product ' +prodsId)
            this.recordId = prodsId; 
             
    }
    //get the area idea from the area component then call apex to get further area infor so we can display the name and use for pricing info
    handleNewArea(v){
        this.areaId = v;
        this.noArea = false;
        this.notUpdate = true;  
        areaInfo({ai:v})
         .then((resp)=>{
             //console.log(resp[0].Area_Sq_Feet__c);
             this.areaName = resp[0].Name;
             this.areaSize = resp[0].Area_Sq_Feet__c;
             
         }) 
    }

    //this will set the application date for both update and new app
    date(e){
        this.appDate = e.detail.value; 
        
    }
    //this sets the application name for both update and new
    newName(e){
        this.appName = e.detail.value; 
        this.appId = undefined;
    }
    //this fires the child drop products
    get newProdsSelect(){
        return this.newProds.length >= 1; 
    }
//RATES 
get unitArea(){
    return [
        {label:'OZ/M', value:'OZ/M'}, 
        {label: 'OZ/Acre', value:'OZ/Acre'},
        {label: 'LB/M', value:'LB/M'},
        {label: 'LB/Acre', value:'LB/Acre'}
    ];
}
    //this will determine units required
    unitsRequired = (uOFM, rate, areaS, unitS) => {return uOFM.includes('Acre') ? Math.ceil((((rate/43.56)*areaS))/unitS) : Math.ceil(((rate*areaS)/unitS))}
    handleUnitArea(e){
        let index = this.newProds.findIndex(prod => prod.Product__c === e.target.name)
        this.newProds[index].Unit_Area__c = e.detail.value; 
            if(this.newProds[index].Rate2__c> 0 ){
                this.newProds[index].Units_Required__c = this.unitsRequired(this.newProds[index].Unit_Area__c, this.newProds[index].Rate2__c, this.areaSize, this.newProds[index].Product_Size__c )
            }
    }

    newRate(e){  
        let index = this.newProds.findIndex(prod => prod.Product__c === e.target.name)

            //this.newProds[index].Units_Required__c = this.dryUnits(this.newProds[index].Rate2__c, this.areaSize, this.newProds[index].Product_Size__c )
        window.clearTimeout(this.delay);
             // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delay = setTimeout(()=>{
                this.newProds[index].Rate2__c = e.detail.value;
                //console.log(this.newProds[index].OZ_M__c, this.areaSize ,this.Product_size__c);
                this.newProds[index].Units_Required__c = this.unitsRequired(this.newProds[index].Unit_Area__c, this.newProds[index].Rate2__c, this.areaSize, this.newProds[index].Product_Size__c )    
                this.newProds[index].Total_Price__c = Number(this.newProds[index].Units_Required__c * this.newProds[index].Unit_Price__c)
                
            },500 )    
         
    }
    
//PRICING 
    //this are reusable functions 
    // eslint-disable-next-line radix
    appTotal = (t, nxt)=> (t + nxt).toFixed(2)
    lineTotal = (units, charge) => (units* charge).toFixed(2)
    //new pricing
    newPrice(x){
        window.clearTimeout(this.delay);
        let index = this.newProds.findIndex(prod => prod.Product__c === x.target.name)
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delay = setTimeout(()=>{ 
            
            this.newProds[index].Unit_Price__c = Number(x.detail.value);
                    if(this.newProds[index].Unit_Price__c > 0){
                    this.newProds[index].Margin__c = Number((1 - (this.newProds[index].Product_Cost__c /this.newProds[index].Unit_Price__c))*100);
                    this.newProds[index].Total_Price__c = Number(this.newProds[index].Units_Required__c * this.newProds[index].Unit_Price__c)
                    this.appTotalPrice = this.newProds.map(el=> el.Total_Price__c).reduce(this.appTotal)
                    console.log( this.appTotalPrice);
                }else{
                    this.newProds[index].Margin__c = 0;                
                    this.newProds[index].Margin__c = this.newProds[index].Margin__c.toFixed(2);
                    this.newProds[index].Total_Price__c = Number(this.newProds[index].Units_Required__c * this.newProds[index].Unit_Price__c)
                    console.log(this.newProds[index].Total_Price__c, 'here price');
                    this.appTotalPrice = this.newProds.map(el=> el.Total_Price__c).reduce(this.appTotal)
                    console.log( this.appTotalPrice);   
            }
        },1000)       
    }
    newMargin(m){
        window.clearTimeout(this.delay)
        let index = this.newProds.findIndex(prod => prod.Product__c === m.target.name)
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delay = setTimeout(()=>{
                this.newProds[index].Margin__c = Number(m.detail.value);
                if(1- this.newProds[index].Margin__c/100 > 0){
                    this.newProds[index].Unit_Price__c = Number(this.newProds[index].Product_Cost__c /(1- this.newProds[index].Margin__c/100));
                    this.newProds[index].Total_Price__c = Number(this.newProds[index].Units_Required__c * this.newProds[index].Unit_Price__c)
                    this.appTotalPrice = this.newProds.map(el=> el.Total_Price__c).reduce(this.appTotal)
                    console.log( this.appTotalPrice);
                }else{
                    this.newProds[index].Unit_Price__c = 0;
                    this.newProds[index].Unit_Price__c = this.newProds[index].Unit_Price__c.toFixed(2);
                    this.newProds[index].Total_Price__c = Number(this.newProds[index].Units_Required__c * this.newProds[index].Unit_Price__c)   
                    this.appTotalPrice = this.newProds.map(el=> el.Total_Price__c).reduce(this.appTotal)
                    console.log(this.appTotalPrice);
                    
                }
    },1500)
    }   
    
    //close update window
    cancel(){
        this.newProds = [];
        this.appName = ''; 
        this.appDate = '';
        this.areaId = ''; 
        this.appTotalPrice = '0'
        this.noArea = true; 
        this.up = false; 
    }
    //remove new application from array
    //will remove it on the screen as an option
    remove(e){
        let x = e.target.id.substr(0,18)
        // eslint-disable-next-line no-alert
        let cf = confirm('Do you want to delete this entry?')
        if(cf===true){
        let i = this.newProds.findIndex(prod => prod.Id === x)
        this.newProds.splice(i,1)
        //console.log(this.newProds.length)
        }
    }    
    //get note options and handle change
    get noteOptions(){
        return [
            {label:'Other/None' , value: 'Other' },
            {label:'Irrigate w/in 24 hours' , value: 'Irrigate w/in 24 hours' },
            {label:'Irrigate Immediately' , value: 'Irrigate Immediately' },
            {label:'Syring prior to app' , value: 'Syringe prior to app' },
            {label:'ttt' , value: 'ttt' },
            {label:'weevil/grub' , value: 'weevil/grub' },
            {label:'syring after app' , value: 'syringe after app' }
        ]
    }

    selectNote(e){
        //console.log(this.newProds)
        console.log(e.target.name);
        let index = this.newProds.findIndex(prod => prod.Product_Name__c === e.target.name);
        this.newProds[index].Note__c = e.detail.value;  
        //console.log(index);
        
    }
//INSERTING UPDATING APPLICATIONS
    //Insert Upsert
    createApplication__c(){

        let params = {
           appName: this.appName,
           appArea: this.areaId,
           appDate: this.appDate
       };
       //console.log(params)
        addApplication({wrapper:params})
            .then((resp)=>{
                this.appId = resp.Id; 
                //console.log(this.appId);
                // eslint-disable-next-line no-return-assign
                this.newProds.forEach((x) => x.Application__c = this.appId)
                let products = JSON.stringify(this.newProds)
                //console.log(products)
                addProducts({products:products})
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Application Added!',
                        variant: 'success'
                    })
                );
            }).then(()=>{
                //console.log("sending new app to table "+this.appId); 
                fireEvent(this.pageRef, 'newApp', this.appId)
            }).then(()=>{
                this.newProds = [];
                this.appName = ''; 
                this.appDate = '';
                this.noArea = true;
                this.notUpdate = false;  
            }).catch((error)=>{
                console.log(JSON.stringify(error))
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error adding app',
                        message: 'Did you select an Area and enter a App Name?',
                        variant: 'error'
                    })
                    
                ) 
            })
    }
    //hook fuction from show details on appTable
    //error if no app products nothing gets fired
    //x is an id grab from the registerListener event up above we pass it to the apex function to get current app products then assign
    //go the newProds. this allows me to reuse the funtions above like ... spread we will seperate new products from existing products below prior to update
    update(x){
        this.noArea = false;
        this.notUpdate = false;  
        this.up = true; 
       appProducts({app:x})
       .then((resp)=>{
        this.newProds= resp;  
        this.appName = resp[0].Application__r.Name;
        this.appDate = resp[0].Application__r.Date__c; 
        this.updateAppId = resp[0].Application__c; 
        this.areaId = resp[0].Application__r.Area__c
        this.areaName = resp[0].Area__c 
        // eslint-disable-next-line radix
        this.areaSize= parseInt(resp[0].Application__r.Area__r.Area_Sq_Feet__c)
        this.appTotalPrice = this.newProds.map(el=> el.Total_Price__c).reduce(this.appTotal)
        }).catch((error)=>{
        console.log(JSON.stringify(error))
    })
    }
//update the actual product here is where we handle the update or insert of products
    upProd(){
        //console.log('new Prods '+ this.newProds);
          
        let updateParams = {
            appName: this.appName,
            appArea: this.areaId,
            appDate: this.appDate
        };
        updateApplication({wrapper:updateParams, id: this.updateAppId })
        .then((response)=>{
            //console.log(response);  
            //console.log(this.appId);
            // eslint-disable-next-line no-return-assign
            this.nap = this.newProds.filter((x)=>{return x.Id === undefined});
            this.newProds = this.newProds.filter((x)=>{return x.Id !== undefined});
            this.nap.forEach((x)=> {x.Application__c = response.Id})
            
             let products = JSON.stringify(this.newProds)
             updateProducts({products:products});
        }).then(()=>{
            //adding the newly added products to this application
            //console.log('in the next .then ' + JSON.stringify(this.nap));
            let addTo = JSON.stringify(this.nap);
            addProducts({products:addTo})
        }).then(()=>{
            fireEvent(this.pageRef, 'newApp', this); 
        }).then(()=>{
            this.newProds = [];
            this.appName = ''; 
            this.appDate = '';
            this.areaId = ''; 
            this.areaName = ''; 
            this.up = false;
            this.noArea = true; 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Application Updated!',
                    variant: 'success'
                })
            );
        }).catch((error)=>{
            console.log(JSON.stringify(error))
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error adding app',
                    message: JSON.stringify(error),
                    variant: 'error'
                })
                
            ) 
        })
        
    }

    //delete single products from an application 
    upDeleteProd(e){
        let product = e.target.id.substr(0,18); 
        let i = this.newProds.findIndex(prod => prod.Id === product);
        // eslint-disable-next-line no-alert
        let c = confirm('Do you want to delete this entry?')
        if(c === true){
        deleteRecord(product)
            .then(()=>{
                this.newProds.splice(i,1)
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success', 
                        message: 'Product    Deleted', 
                        variant: 'success'
                    }) 
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: JSON.stringify(error),
                        variant: 'error'
                    })
                )
            })
        }
    }

 }
