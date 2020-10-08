public with sharing class workOrderProducts {
    AuraEnabled(cachable=True)
    public static list<WorkOrderLineItem> getWorkOrderProd(id recordId){
        return [select id,LineItemNumber, Product_Name__c, Product_Code__c, Quantity,
        UnitPrice, Cost__c,TotalPrice, Cost_Validated__c, Ship_Product__c,Ship_Product_To__c, Ship_Product_Vendor__c
        from  WorkOrderLineItem where  WorkOrderId =: recordId ];
    }
}
