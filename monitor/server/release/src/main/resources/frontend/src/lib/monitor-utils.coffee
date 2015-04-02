# monitor项目的公共util包，许多方法以后会转移到平台的utils.coffee文件中，目前为了开发方便暂时放这

String::contains = (str)->
  string = this
  return false if string.indexOf( str ) is -1
  return true

String::startWith = (str)->
  string = this
  return true if string.indexOf( str ) is 0
  return false

# 删除数组中指定值
Array::removeElem = (val)->
  arr = this
  return if arr? or arr.length is 0 or !val
  index = arr.indexOf( val )
  return if index is -1
  arr.splice( index, 1 )

String::firstLetterToUpperCase = ->
  string = this
  return string.replace string.charAt( 0 ), string.charAt( 0 ).toUpperCase() if string

String::str2Html = ->
  string = this
  return "" if !string
  $span = jQuery("<span></span>")
  $span.text( string )
  $span.attr( "title", string )
  return $span.prop( "outerHTML" )

angular.module("Lib.MonitorUtils", [])

.factory( 'MonitorCommonService', [ '$log', ($log)->
  class MonitorCommonService

    constructor: ->

    # 文档内容高度自适应
    windowResize: (elemID, outerPaddingBottom)->
      target = $("#" + elemID)
      return if !target or target.length is 0
      clientHeight  = document.documentElement.clientHeight
      offsetTop     = target.offset().top
      target.height( clientHeight - offsetTop - outerPaddingBottom )

    # 监听窗体大 小变化事件
    onWindowResize: (elemID, outerPaddingBottom)->
      self = this
      self.windowResize( elemID, outerPaddingBottom )
      $(window).resize ->
        self.windowResize( elemID, outerPaddingBottom )

] )