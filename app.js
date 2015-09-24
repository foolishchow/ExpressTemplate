var express = require('express');

//配置url映射
var MvcConfig = require("./source/config/MvcConfig");

var app = express();

//配置Mvc
MvcConfig(app,express);


module.exports = app;
