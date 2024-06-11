var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'Nav14@#$***',
   database:'registeration-details'
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
module.exports = connection; 