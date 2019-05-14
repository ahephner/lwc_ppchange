/* eslint-disable getter-return */
import { LightningElement, track } from 'lwc';

export default class Calculator extends LightningElement {

    @track firstNumber;
    @track secondNumber;
    @track currentResult;
    @track operatorUsed;
  
    onNumberChange(event) {
      //Getting input field name
      const inputFieldName = event.target.name;
      if (inputFieldName === "firstName") {
        //value of first number has changed, modifying the property value
        this.firstNumber = event.target.value;
      } else if(inputFieldName === "secondName") {
        //value of second number has changed, modifying the property value
        this.secondNumber = event.target.value;
      }
    }
  
      onAdd() {
      // eslint-disable-next-line radix
      this.currentResult = parseInt(this.firstNumber) + parseInt(this.secondNumber);
      this.operatorUsed = '+';
      //Check if both numbers are okay and operable 
    }
    onSub() {
      // eslint-disable-next-line radix
      this.currentResult = parseInt(this.firstNumber) - parseInt(this.secondNumber);
      this.operatorUsed = '-';
      //Check if both numbers are okay and operable 
    }
     onMultiply() {
      // eslint-disable-next-line radix
      this.currentResult = parseInt(this.firstNumber) * parseInt(this.secondNumber);
      this.operatorUsed = '*';
      //Check if both numbers are okay and operable 
    }
  
     onDivide() {
      // eslint-disable-next-line radix
      this.currentResult = parseInt(this.firstNumber) / parseInt(this.secondNumber);
      this.operatorUsed = '%';
      //Check if both numbers are okay and operable 
    }
      // eslint-disable-next-line consistent-return
      get result() {
      
      if(this.currentResult === 0 || this.currentResult){
        return `Result of ${this.firstNumber} ${this.operatorUsed} ${this.secondNumber} is ${this.currentResult}`;
      } 
      }
}