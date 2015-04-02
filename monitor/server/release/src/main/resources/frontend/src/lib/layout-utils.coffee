angular.module("Lib.LayoutUtils", [])
  .factory "LayoutService", [->
    class LayoutService
      constructor: (model)->
        @initLayoutModel() 
        $.extend @layoutModel, model
        @layoutModel.elem = $("#" + model.elemID)  if model and model.elemID

      initLayoutModel: ->
        @layoutModel = {}
        @layoutModel.elemID = "layoutID"
        @layoutModel.elem = $("#" + @layoutModel.elemID)
        @layoutModel.layout = {}
        @layoutModel.layoutSettings = {}
        @layoutModel.layoutSettings.name = @layoutModel.elemID
        @layoutModel.layoutSettings.defaults = @defaultSettings()

      layout: ->
        self = this
        self.layoutModel.layout = self.layoutModel.elem.layout(self.layoutModel.layoutSettings)

      defaultSettings: (options) ->
        self = this
        self.layoutModel.layoutSettings.defaults = {}
        defaults =
          size: "auto"
          minSize: 50
          paneClass: "pane"
          resizerClass: "resizer"
          togglerClass: "toggler"
          buttonClass: "button"
          contentSelector: ".content"
          contentIgnoreSelector: "span"
          togglerLength_open: 35
          togglerLength_closed: 35
          hideTogglerOnSlide: true
          togglerTip_open: "Close This Pane"
          togglerTip_closed: "Open This Pane"
          resizerTip: "Resize This Pane"
          fxName: "slide"
          fxSpeed_open: 750
          fxSpeed_close: 1500
          fxSettings_open: {easing: "easeInQuint"}
          fxSettings_close: {easing: "easeOutQuint"}
        $.extend defaults, options
        self.layoutModel.layoutSettings.defaults = defaults

      aspectSettings: (aspect, options) ->
        self = this
        return alert("aspect only accept: north|south|west|east|center")  unless aspect.match("north|south|west|east|center")
        self.layoutModel.layoutSettings[aspect] = {}
        switch aspect
          when "north"
            settings = @northSettings()
          when "south"
            settings = @southSettings()
          when "east"
            settings = @eastSettings()
          when "west"
            settings = @westSettings()
          when "center"
            return alert("center aspect must pass paneSelector")  if not options or not options.paneSelector
            settings = @centerSettings()
        $.extend settings, options
        self.layoutModel.layoutSettings[aspect] = settings

      northSettings: ->
        north =
          spacing_open: 1
          togglerLength_open: 0
          togglerLength_closed: -1
          resizable: false
          slidable: false
          fxName: "none"
        return north

      southSettings: ->
        south =
          togglerLength_closed: -1
          slidable: false
          initClosed: false
        return south

      eastSettings: ->
        east =
          size: 250
          spacing_closed: 21
          togglerLength_closed: 21
          togglerAlign_closed: "top"
          togglerLength_open: 0
          togglerTip_open: "Close West Pane"
          togglerTip_closed: "Open West Pane"
          resizerTip_open: "Resize West Pane"
          slideTrigger_open: "click"
          initClosed: false
          fxSettings_open: {easing: "easeOutBounce"}
        return east

      westSettings: ->
        west =
          size: 250
          spacing_closed: 21
          togglerLength_closed: 21
          togglerAlign_closed: "top"
          togglerLength_open: 0
          togglerTip_open: "Close West Pane"
          togglerTip_closed: "Open West Pane"
          resizerTip_open: "Resize West Pane"
          slideTrigger_open: "click"
          initClosed: false
          fxSettings_open: {easing: "easeOutBounce"}
        return west

      centerSettings: ->
        center =
          paneSelector: "#paneSelector"
          minWidth: 200
          minHeight: 200
        return center

      addPinBtn: (selector, aspect) ->
        self = this
        $("<span></span>").addClass("pin-button").prependTo selector
        self.layoutModel.layout.addPinBtn "" + selector + " .pin-button", aspect

      addCloseBtn: (selector, aspect, btnID) ->
        self = this
        $("<span></span>").attr("id", btnID).prependTo selector
        self.layoutModel.layout.addCloseBtn "#" + btnID, aspect
]