var fs = require('fs');
var path = require('path');
var documentCreator = require("../documenCreator");
var configParser=require("../configParser");
var moment = require('moment');
var async = require('async');
moment.locale("ru");
const { GoogleSpreadsheet } = require('google-spreadsheet');
var cfg =configParser.getMinjustReportConfig();

var doc = new GoogleSpreadsheet(cfg.spreadsheetKey);  

var sheet;

module.exports.generateReport = async function() {
   
	await doc.useServiceAccountAuth(cfg.credentials);
	
	await doc.loadInfo();

	console.log('Loaded doc: '+doc.title);
	console.log('Checking sheet with name:',cfg.sheetName)

	sheet=doc.sheetsByTitle[cfg.sheetName];

	if(sheet==null){
		console.log('Sheet  not exist:',cfg.sheetName);
      	return;
	}
	console.log('sheet : '+sheet.title+' successfully found!');

	var rows = await sheet.getRows();
	
	console.log('Read '+rows.length+' rows');
	
	var rowItems = rows.map(function(row) {
		return {
			date:moment(row['Дата'], "DD.MM.YYYY"),
		  	name:row['Наименование'],
		  	person:row['Контактное лицо'],
		  	problem:row['Проблема'],
		  	solution:row['Решение'],
		}		
	});

	var curentMonth=moment().month();
	var currentYear=moment().year();
		 
	var filteredRows=rowItems.filter(function (row){
		return row.date.month()==curentMonth && row.date.year()==currentYear;
	})     
	console.log('In current month we have :',filteredRows.length)

	var dateProps=getDateProps();
	var data=Object.assign(dateProps, cfg.reportInfo);
	
	//разделение на консультации и удаление
	var filteredRows=filteredRows.map(function(row) {   
		var item={
	  		organisation:row.name,
	  		date:row.date.format("DD.MM.YYYY"),
			problem:row.problem.toLowerCase().indexOf('удаление ик')>=0?'del':'consult',
		};
		console.log(item)
	  	return item;
	});

	data.rows=groupRows(filteredRows);	
		
	var inputPath=path.resolve(__dirname, 'input.docx');	
 	var outputPath=path.resolve(__dirname, '../output/Отчет МинЮст за '+moment().format("MMMM")+'.docx');
	 
	documentCreator.generateDocument(inputPath,outputPath,data);
  	console.log('Success');
}

function getDateProps(){
	
	var now=moment();
	var date = new Date(), y = y = moment().format("YYYY"), m = moment().format("M");
	var lastDay = new Date(y, m, 0);
	lastDay = moment(lastDay);
	// while(true){
	// 	if(lastDay.day()!=0 && lastDay.day()!=6){			
	// 		break;
	// 	}
	// 	lastDay.add(-1,'days')
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



function groupRows(rows){

    var dates=rows.map((e)=>e.date);    
    var uniqueDates = dates.filter((v, i, a) => a.indexOf(v) === i);

    var groupedRows=[];

    for(var i =0;i<uniqueDates.length;i++){

    	var consultsOrgs = rows.filter((e)=>e.date==uniqueDates[i] && e.problem=='consult')
    					   .map((e)=>e.organisation)
    					   .join(', ')+'.';


    	var delOrgs = rows.filter((e)=>e.date==uniqueDates[i] && e.problem=='del')
    					   .map((e)=>e.organisation)
    					   .join(', ')+'.';		 
        if(consultsOrgs.length>1)   					   	
    			groupedRows.push({
    		 		organisation:consultsOrgs,
  		   	 		date:uniqueDates[i],
  		   	 		problem:'Консультация по работе в АИС «Взаимодействие»',
  		   	 		solution:'Оказали консультацию.',
  		   	 		
    		})
    	 if(delOrgs.length>1)   					   	
    			groupedRows.push({
    		 		organisation:delOrgs,
  		   	 		date:uniqueDates[i],
  		   	 		problem:'Удаление информационных карт',
  		   	 		solution:'Поиск и удаление необходимых информационных карт',
    		})				   	

    		
    }

    return groupedRows;
}

