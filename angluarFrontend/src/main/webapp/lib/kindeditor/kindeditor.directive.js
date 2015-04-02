(function(angular){
    var directivesApp=angular.module('kindeditorDirective', []);
    directivesApp.directive('kindEditor',
        function () {
            return{
                restrict: 'EA',
                require: 'ngModel',
                link: function (scope, element, attr, ctrl) {
                    var editor;
                    var initEditor=function () {
                        if (typeof KindEditor != 'undefined') {
                            editor = KindEditor.create('textarea[name="content"]',{
                                afterChange:function(){
                                    if(editor){
                                        scope.$apply(function () {
                                            ctrl.$setViewValue(editor.html());
                                        });
                                    }
                                },
                                resizeType : 1,
                                allowPreviewEmoticons : true,
                                allowImageUpload : true,
                                allowFileManager:true,
                                uploadJson : '../dmonitor-webapi/itsm/form/editorUpload',
                                items : [
                                    'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                                    'insertunorderedlist','image']
                            });
                        }
                    };
//                    ctrl.$render = function () {
//                        var _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
//                        editor.html(_initContent);
//                    };
                    setTimeout(function(){
                        initEditor();
                    },1000);
                }
            }
        }
    );

    directivesApp.directive('colorSt',['Util',
        function (Util) {
            return{
                restrict: 'EA',
                require: 'ngModel',
                link: function (scope, element, attr, ctrl) {
                    var initEditor=function () {
                        var color=Util.getValue(attr.ngModel,scope);
                        if(color && color!="")element.css("cssText","background-color:"+color+"!important;");
                        element.bigColorpicker(function(currentPicker,hex){
                            element.val(hex).css("cssText","background-color:"+hex+"!important;");
                            scope.$apply(function () {
                                ctrl.$setViewValue(hex);
                            });
                        },"L",10);
                    };
                    setTimeout(function(){
                        initEditor();
                    },1000);
                }
            }
        }]
    );
})(angular);