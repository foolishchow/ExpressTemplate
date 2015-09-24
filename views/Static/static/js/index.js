define(function(require, exports, module) {
var $ = require("jquery");
var util = {};
    util.mask = function(){
        console.info("mask show");
        $(".mask").addClass("visi");
    }
    util.maskhide = function(){
        console.info("mask hide");
        $(".mask").removeClass("visi");
    }

    var ajax = $.ajax;
    $.ajax =  function(url,object){ 
        var Url,Obj; 
        if(object == undefined){ 
            Obj = url;  
        }else{ 
            Obj = object; 
        } 
        if(!Obj.dataType){ 
            Obj.dataType = 'json'; 
        } 
        if(Obj.success == undefined ) Obj.success= function(){};
        var success = Obj.success;
        Obj.success = function(){
            if(Obj.mask) util.maskhide();
            success.apply(this,arguments);
        }

        if(Obj.mask) util.mask();
        ajax(url,object);
    };

    window.ajax2 = function(){
        /**
         * [ajxa description]
         */
        jQuery.ajax({
            url  :'/ajax',
            type : 'post',
            async : false,
            mask:true,
            data : {},
            success : function(data) {
                console.info(data);
            },
            error: function(jqXhr,status, error){
                //success
            }
        });
    }

    function func1(){

        func2();
    }
    function func2(){
        //ddddd
        $.ajax({});
    }

});