angular.module('Lib.Twaver.TopoUtils', [])

.factory('TopoUtils', ['$log', ($log)->

  class TopoUtils

    CLEARED               = twaver.AlarmSeverity.CLEARED
    INDETERMINATE         = twaver.AlarmSeverity.INDETERMINATE
    WARNING               = twaver.AlarmSeverity.WARNING
    MINOR                 = twaver.AlarmSeverity.MINOR
    MAJOR                 = twaver.AlarmSeverity.MAJOR
    CRITICAL              = twaver.AlarmSeverity.CRITICAL

    constructor: ->

    # 去掉path后边多余的斜杠（／）；
    # 如果path全是斜杠，是否保留根路径，即（／）；［true：保留；false：不保留（默认false）］
    prettyPath: (path, keepRoot)->
      return "" if !path
      path = unescape( path )
      path = path.substring( 0, path.length - 1 ) while path.lastIndexOf( "/" ) is path.length
      return path if !keepRoot
      return "/" if path is ""
      return path

    # 获取前一路径
    getPrePath: (path)->
      return "" if !path
      path = @prettyPath( path )
      originalPath = path
      path = path.substring( 0, path.lastIndexOf( "/" ) )
      return "/" if path is "" and originalPath.length > 1 and originalPath.startWith( "/" )
      return path

    hasPrePath: (path)->
      return true if @getPrePath( path )
      return false

    getSeverity: (severity)->
      switch severity
        when "CLEAR"          then return CLEARED
        when "INDETERMINATE"  then return INDETERMINATE
        when "WARNING"        then return WARNING
        when "MINOR"          then return MINOR
        when "MAJOR"          then return MAJOR
        when "CRITICAL"       then return CRITICAL

])