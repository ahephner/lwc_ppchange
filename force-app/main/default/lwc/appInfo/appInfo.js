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
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import PRODUCT_ID from '@salesforce/schema/Product__c.Id'
import PRODUCT_NAME from '@salesforce/schema/Product__c.Product_Name__c'

const fields = [PRODUCT_NAME, PRODUCT_ID];
export default class AppInfo extends LightningElement {
    recordId; 
    @track notUpdate = true; 
    @track up;  
    @track appId; 
    @track appName;
    @track appDate; 
    @track areaId; 
    @track name;  
    @track productId;  
    @track newProds = []
    @track upProds = []; 
    nap = []; 
    updateAppId; 
    lastId = 0; 
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
              OZ_M__c:  "0", 
              numb: this.lastId, 
              Application__c: '' 
             }]; 
             
            this.error = undefined;
        }else if (error){
            this.error = error;
            this.name = undefined;
        }
    //console.log(this.newProds)
    }
    
        connectedCallback(){
            // eslint-disable-next-line no-console
            //console.log('callback')
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

    handleNewArea(v){
        this.areaId = v;
        console.log(v)
    }
    date(e){
        this.appDate = e.detail.value; 
        
    }

    newName(e){
        this.appName = e.detail.value; 
        this.appId = undefined;
    }
    get newProdsSelect(){
        return this.newProds.length >= 1; 
    }
    newRate(e){
     let index = this.newProds.findIndex(prod => prod.numb === e.target.name)
     //console.log("index number" + index);
     this.newProds[index].OZ_M__c = e.detail.value;    
    
    }
//update rate in update app screen 
     updateRate(r){
        let newRate = this.newProds.findIndex(p => p.Product__c === r.target.name); 
        this.newProds[newRate].OZ_M__c = r.detail.value;  
     }
//close update window
    cancel(){
        this.newProds = [];
        this.appName = ''; 
        this.appDate = '';
        this.areaId = ''; 
        this.notUpdate = true; 
        this.up = false; 
    }
//remove new application from array
//will remove it on the screen as an option
    remove(e){
        let x = e.target.id.substr(0,18)
        let i = this.newProds.findIndex(prod => prod.Id === x)
        this.newProds.splice(i,1)
        //console.log(this.newProds.length)
      
    }    
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
                this.areaId = ''; 
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
    //hook fuction from show details on appTable
    //error if no app products nothing gets fired
    //x is an id grab from the registerListener event up above we pass it to the apex function to get current app products then assign
    //go the newProds. this allows me to reuse the funtions above like ... spread we will seperate new products from existing products below prior to update
    update(x){
        this.notUpdate = false; 
        this.up = true; 
       appProducts({app:x})
       .then((resp)=>{
        this.newProds= resp;  
        this.appName = resp[0].Application__r.Name;
        this.appDate = resp[0].Application__r.Date__c; 
        this.updateAppId = resp[0].Application__c; 
        this.areaId = resp[0].Area__c
        console.log('here is appId '+ this.updateAppId)
    }).catch((error)=>{
        console.log(JSON.stringify(error))
    })
    }
//update the actual product here is where we handle the update or insert of products
    upProd(){
        console.log('new Prods '+ this.newProds);
          
        let updateParams = {
            appName: this.appName,
            appArea: this.areaId,
            appDate: this.appDate
        };
        updateApplication({wrapper:updateParams, id: this.updateAppId })
        .then((response)=>{
            console.log(response);  
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
            this.up = false;
            this.notUpdate = true; 
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
