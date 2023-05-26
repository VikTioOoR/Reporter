var path = require('path');
var documentCreator = require("../documenCreator");
var configParser=require("../configParser");
var moment = require('moment');
moment.locale("ru");
var cfg =configParser.getFsznReportConfig();

module.exports.generateReport = async function() {

	var dateProps=getDateProps();
	var data=Object.assign(dateProps, cfg.reportInfo);

	data.rows = getWorkdaysInMonth(data.month, data.year).map(function(day){
		var item = {
			date:moment(day+"-"+data.month+"-"+data.year, "DD.MM.YYYY").format("DD.MM.YYYY"),
		};
		return item;
	});	
		
	var inputPath=path.resolve(__dirname, 'input.docx');	
 	var outputPath=path.resolve(__dirname, '../output/ФСЗН_отчет '+moment().format("MMMM")+'.docx');
	
	documentCreator.generateDocument(inputPath,outputPath,data);
  	console.log('Success');
}

function getDateProps(){
	
	var now=moment();
	var y = moment().format("YYYY"), m = moment().format("M");
	var lastDay = new Date(y, m, 0);
	lastDay = moment(lastDay);
	//последний рабочий день месяца
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
		month:now.format("MM"),
		monthNorm:now.format("MMMM"),
		monthAcc:now.format('D MMMM').replace(new RegExp("[0-9]", "g"), "").replace(" ","")
	};

	return dateObj;
}

function getWorkdaysInMonth(month, year) {
	var daysCount = moment(year+"-"+month, "YYYY-MM").daysInMonth();
	var days = [];
	for(var i=0; i < daysCount; i++) {
		if (isWeekday(year, month, i+1)) days.push(i+1);
	}
	return days;
}

function isWeekday(year, month, day) {
	//if(day < 10) day = "0"+day;
	var dayOfWeek = moment(year+"-"+month+"-"+day, "YYYY-MM-DD").day();
	return dayOfWeek !=0 && dayOfWeek !=6;
}