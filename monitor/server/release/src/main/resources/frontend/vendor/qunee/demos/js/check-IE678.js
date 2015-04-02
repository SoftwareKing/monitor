/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2014 by qunee.com
**/
var userAgent = navigator.userAgent;
var isIE678 = /msie\s([6,7,8])/i.exec(userAgent);
var isIE11 = /rv:11.0/i.test(userAgent);
if(isIE678 && !isIE11){
    var versionNumber = parseInt(isIE678[1]);
//    document.write("<div style='margin: auto;'>请使用Google Chomre, Firefox, Safari, Opera或者IE9+以上版本的浏览器</div>");
    document.write('<div style="z-index: 10;position: fixed; left: 0px; right: 0px; bottom:0px; top:0px; font-size:16px;\
    background-color:#000000;opacity:0.7;filter: alpha(opacity=70);">\
        <div style="background-color:#FFFFFF;width: 600px; margin: 100px auto; padding: 20px; border: solid 1px #000; line-height: 1.5em;">\
        <p>您正在使用 Internet Explorer ' + versionNumber + ' 浏览网页，建议使用支持<span style="color: #2898E0;font-weight:bold;">HTML5</span>的高级浏览器，\
以便正常浏览<span style="color: #2898E0;font-weight:bold;">Qunee for HTML5</span>\
    在线演示</p><p style="font-size: 2em;">\
            <a style="margin:10px;" href="http://www.google.com/chrome/">Chrome</a>\
            <a style="margin:10px;" href="http://www.mozilla.com/">Firefox</a>\
            <a style="margin:10px;" href="http://www.apple.com/safari/">Safari</a>\
            <a style="margin:10px;" href="http://www.opera.com/">Opera</a>\
            <a style="margin:10px;" href="http://www.microsoft.com/windows/internet-explorer/">IE 9+</a>\
        </p>\
        </div></div>');
}