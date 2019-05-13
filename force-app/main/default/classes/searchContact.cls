public with sharing class searchContact {
        @AuraEnabled (cacheable=True)
    public static list<contact> searchContact(string Name){
        string key = '%'+ Name +'%';
        return [select name from contact where name like :key]; 
    }
}
