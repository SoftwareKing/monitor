angular.module("Lib.Twaver.Model.EventModel", [])

.service( 'EventModelService', [ '$log', 'EventModel', ($log, EventModel)->
  @eventModel = new EventModel()

  @getEventModel = ->
    @eventModel.init()
    return @eventModel

  return
] )

.factory("EventModel", [->

  class EventModel

    constructor: ->
      @init()

    init: ->


    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$emit(eventName, data)

])