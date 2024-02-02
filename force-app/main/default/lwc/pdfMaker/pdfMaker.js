import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import pdfMaker from '@salesforce/resourceUrl/pdfMaker';
import getSalesDocs from '@salesforce/apex/quickPriceSearch.getSalesDocs'
export default class PdfMaker extends LightningElement {
    docList;
    jsPdfInitialized=false;
    searchString;
    startDate;
    endDate;
    category;
    pf;
    headers= this.createHeaders(['Date','ProductName', 'Qty', 'UnitPrice'])
    @api recordId;
    renderedCallback(){
        if (this.jsPdfInitialized) {
            return;
        }
        this.jsPdfInitialized = true; 
        Promise.all([
            loadScript(this, pdfMaker)])
    }

    //get values;
    handleDateOne(x){
        this.startDate = x.target.value;
    }
    handleDateTwo(x){
        this.endDate = x.target.value;
    }
    handleCategory(x){
        this.category = x.target.value;
    }
    handleFamily(x){
        this.pf = x.target.value;
    }
    handleSearchString(x){
        this.searchString = x.target.value; 
    }

    generatePdf(){
        //create var that can be destructured
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({});
        //text then location x then y px; 
        //doc.text('Hi I am AJ!', 20, 20);
        doc.table(25,25,this.docList, this.headers, {autosize:true});
        doc.text(this.qty, 20,20)
        doc.save('demo.pdf');

    }
qty; 
    generateData(){
        getSalesDocs({id: this.recordId, 
                    start:this.startDate, 
                    endDate: this.endDate,
                    cat:this.category, 
                    family:this.pf,
                    SearchName:this.searchString }).then(res=>{
        this.docList = res.map(x=>{
            return{
                Date: x.Sales_Document__r.Doc_Date__c,
                ProductName: x.Product_Name__c,
                Qty: x.Qty__c.toString(),
                UnitPrice: x.Unit_Price__c.toString()

            }
           
             
        });
        this.qty = this.docList[0].Qty.toString();  
    }).then(res=>{
        this.generatePdf()
        
     }); 
    }

    createHeaders(keys){
        let results=[]
        for(let i=0; i<keys.length; i++){
            results.push({
                id: keys[i],
                name:keys[i],
                prompt:keys[i],
                width:65,
                align: 'center',
                padding:0
            })
        }
        return results; 
    }
}