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
	  var outputPath=path.resolve(__dirname, '../output/Сопроводительное письмо '+bank.aliasName+'.docx');
	 
	  documentCreator.generateDocument(inputPath,outputPath,bank);
	});
}



function GenerateDocumentsData(){
	var config=configParser.getActsConfig();    
	var dataItems=[];
	var dateProps=getDateProps();

		config.banks.forEach(function(bank) {
	  		var bankData=Object.assign({}, dateProps)
	  		bankData=Object.assign(bankData, bank)

			dataItems.push(bankData);
	});	
	return dataItems;
}


function getDateProps(){
	
	var now=moment();
	var date = new Date(), y = moment().format("YYYY"), m = moment().format("M");
	var lastDay = new Date(y, m, 0);
	lastDay = moment(lastDay);
	while(true){
		if(lastDay.day()!=0 && lastDay.day()!=6){			
			break;
		}
		lastDay.add(-1,'days')
	}
	now=lastDay;
	dateObj={
		year:now.format("gggg"),
		date:now.format("L"),
		monthNorm:now.format("MMMM"),
		monthAcc:now.format('MMMM').replace(new RegExp("[0-9]", "g"), "").replace(" ","")
	};

	return dateObj;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}