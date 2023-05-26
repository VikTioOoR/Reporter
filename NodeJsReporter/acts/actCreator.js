var fs = require('fs');
var path = require('path');
var documentCreator = require("../documenCreator");
var configParser=require("../configParser");
var moment = require('moment');
moment.locale("ru");

module.exports.generateDocument =function(){
	var inputPath=path.resolve(__dirname, 'input.docx');

	var banks = GenerateDocumentsData();

	banks.forEach(function(bank) {
	  var outputPath=path.resolve(__dirname, '../output/Акт '+bank.aliasName+' за '+moment().format("MMMM")+'.docx');

	  if(bank.aliasName == "ЗАО _ОптиКурс НКФО"){
		var optiKursPath = path.resolve(__dirname, 'inputOptiKurs.docx');
		documentCreator.generateDocument(optiKursPath,outputPath,bank);
		return;
	  }
	  
	  if(bank.aliasName == "ОАО Сбер Банк"){
		  var SberPath = path.resolve(__dirname, 'inputSber.docx');
		  documentCreator.generateDocument(SberPath,outputPath,bank);
		  return;
	  }

	  documentCreator.generateDocument(inputPath,outputPath,bank);
	});	
}

function GenerateDocumentsData(){
	var config=configParser.getActsConfig();    
	var dataItems=[];
	var dateProps=getDateProps();

	var io=config.circResponsibleFio.substring(config.circResponsibleFio.length-4);
	config.circResponsibleFioR=io+config.circResponsibleFio.substring(0,config.circResponsibleFio.length-5);

		config.banks.forEach(function(bank) {
	  		var bankData=Object.assign({}, dateProps)
	  		bankData=Object.assign(bankData, bank)
	  		bankData.circResponsiblePost=config.circResponsiblePost;
	  		bankData.circResponsibleFio=config.circResponsibleFio;
	  		bankData.circResponsDocument=config.circResponsDocument;  		
	        bankData.circResponsibleFioR=config.circResponsibleFioR;  		
	        bankData.circResponsiblePostUpCase=capitalizeFirstLetter(config.circResponsiblePost);  		
			
	        if(bankData.depositter == null)
	         	bankData.depositter=bankData.fullName;

	         //если не указан ответственный вставлем поле для заполнения
	         bankData.bankResponsibleFilled=bankData.bankResponsible!=null?bankData.bankResponsible:"";
	         bankData.bankResponsibleEmpty=bankData.bankResponsible==null?"__________________________________________________________":"";
	         

 			 bankData.bankResponsiblePostFilled=bankData.bankResponsiblePost!=null?bankData.bankResponsiblePost:"";
	         bankData.bankResponsiblePostEmpty=bankData.bankResponsiblePost==null?"________________________":"";

	         bankData.bankResponsibleFioFilled=bankData.bankResponsibleFio!=null?bankData.bankResponsibleFio:"";
	         bankData.bankResponsibleFioEmpty=bankData.bankResponsibleFio==null?"____________":"";
	         

	         bankData.bankResponsibleDoc=bankData.bankResponsibleDoc!=null?bankData.bankResponsibleDoc:"__________________________________________________________";



			dataItems.push(bankData);
	});	
	return dataItems;
}


function getDateProps(){
	
	var now=moment();
	var date = new Date(), y = moment().format("YYYY"), m = moment().format("M");
	var lastDay = new Date(y, m, 0);
	lastDay = moment(lastDay);
	// while(true){
		// if(lastDay.day()!=0 && lastDay.day()!=6){			
			// break;
		// }
		// lastDay.add(-1,'days')
	// }
	now=lastDay;
	dateObj={
		year:now.format("gggg"),
		date:now.format("DD"),
		monthNorm:now.format("MMMM"),
		monthAcc:now.format('D MMMM').replace(new RegExp("[0-9]", "g"), "").replace(" ","")
	};

	return dateObj;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}