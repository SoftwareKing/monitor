angular.module("Lib.JsonCycleParser", [])

.factory("JsonCycleParser", ["$log", ($log)->

    class JsonCycleParser

      constructor: (@json)->
        return if !@isJson( @json )

        @identify         = "@id"
        @identifyReg      = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/
        @objMappings      = {}
        @redefineds       = []

        @parseJson( @json )
        @definedGetters( @redefineds )

      parseJson: (json)->
        return if !@isJson( json )
        identifyVal = null
        for key, val of json
          if key is @identify
            identifyVal = val
            continue
          if typeof val is "string"
            continue if !@identifyReg.test( val )
            @redefineds.push( { "json": json, "field": key } )
            continue
          if val instanceof Array
            @parseArray( val )
            continue
          if val instanceof Object
            @parseJson( val )
        @objMappings[ identifyVal ] = json if identifyVal

      parseArray: (array)->
        return if !array or array.length is 0
        for val in array
          if val instanceof Array
            @parseArray( val )
            continue
          if val instanceof Object
            @parseJson( val )

      definedGetters: (datas)->
        return if !datas or datas.length is 0
        @definedGetter( data.json, data.field ) for data in datas

      definedGetter: (json, field)->
        return if !json or !field
        value = json[ field ]
        value = @objMappings[ value ] if @identifyReg.test( value )
        json.__defineGetter__( field, -> return value )

      isJson: (json)->
        return false if !json
        try
          JSON.stringify( json )
          return true
        catch error
          return false

  ])