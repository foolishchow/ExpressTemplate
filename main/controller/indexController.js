var express = require('express');
var controller = express.Router();
var exec = require("child_process").exec;
var encoding = require("encoding");

/* GET home page. */
controller.get('/', function(req, respond, next) {
  respond.render('index', { title: 'ajax增强' });
});

module.exports = controller;
