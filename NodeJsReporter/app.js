var fs = require('fs');
var path = require('path');

var actCreator = require("./acts/actCreator");
var minjustReporter = require("./minjustReporter/reportCreator");
var fsznReporter = require("./fsznReporter/reportCreator");
var lettersCreator = require("./letters/letterCreator");


actCreator.generateDocument();
minjustReporter.generateReport();
fsznReporter.generateReport();
lettersCreator.generateDocument();