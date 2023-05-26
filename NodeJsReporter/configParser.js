var config = require('./documentsConfig.json'); 

module.exports.getActsConfig=function(){	
	 return  config.actsConfig;
}
module.exports.getMinjustReportConfig=function(){	
	 return  config.minjustReportConfig;
}
module.exports.getFsznReportConfig=function(){	
	return  config.fsznReportConfig;
}