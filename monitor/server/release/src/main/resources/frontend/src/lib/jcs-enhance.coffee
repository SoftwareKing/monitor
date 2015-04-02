angular.module('Lib.JcsEnhance', [])
  .factory('AceElementModifier', [->

    reset = (el) ->
      angular.forEach(el.find('span'), (spanEl) ->
        spanEl = angular.element(spanEl);
        spanEl.remove() if (spanEl.hasClass('error-msg') || spanEl.hasClass('form-control-feedback') || spanEl.hasClass('control-feedback'))
      )
      el.removeClass('has-info has-success has-error has-feedback');

      frmGroupEl = findFormGroupElement(el)

      iconEl = findElementDesc(el, 'i')
      if iconEl?
        originIcon = iconEl.attr('origin-class')
        iconEl.attr('origin-class', iconEl.attr('class')) unless originIcon?
        iconEl.removeClass 'icon-ok icon-remove'
        iconEl.addClass originIcon
      helpEl = findWithClassElementDesc(el, 'help-block')

      if helpEl?
        originText = helpEl.attr('origin-text')
        successText = helpEl.attr('success-text')
        helpEl.attr('origin-text', helpEl.text()) unless originText?
        helpEl.attr('success-text', originText) unless successText?
        helpEl.text(originText) 

    findWithClassElementAsc = (el, klass) ->
      parent = angular.element(el)
      for num in [0..3]
        break unless parent?
        break if parent.hasClass(klass)
        parent = parent.parent()
      parent

    findWithClassElementDesc = (el, klass) ->
      el = angular.element(el)
      child = undefined
      for child in el.children()
        break if child? and angular.element(child).hasClass(klass)
        if child.children?
          child = findWithClassElementDesc(child, klass)
          break if child.length > 0
      angular.element(child)

    findElementDesc = (el, name) ->
      el = angular.element(el)
      child = undefined
      for child in el.children()
        break if child? and child.nodeName == name.toUpperCase()
        if child.children?
          child = findElementDesc(child, name)
          break if child.length > 0
      angular.element(child)
      

    findFormGroupElement = (el) ->
      findWithClassElementAsc(el, 'form-group')

    makeValid = (el)->
      frmGroupEl = findFormGroupElement(el)
      return frmGroupEl.addClass('has-success has-feedback') if skip(el)
      reset(frmGroupEl)
      frmGroupEl.addClass('has-success has-feedback')
      iconEl = findElementDesc(frmGroupEl, 'i')
      iconEl.attr('class', 'ace-icon icon-ok') if iconEl?
      helpEl = findWithClassElementDesc(frmGroupEl, 'help-block')
      helpEl.text(helpEl.attr('success-text')) if helpEl?

    makeInvalid = (el, errorMsg)->
      frmGroupEl = findFormGroupElement(el)
      return frmGroupEl.addClass('has-error has-feedback') if skip(el)
      reset(frmGroupEl);

      frmGroupEl.addClass('has-error has-feedback')
      iconEl = findElementDesc(frmGroupEl, 'i')
      iconEl.attr('class', 'ace-icon icon-remove') if iconEl?
      helpEl = findWithClassElementDesc(frmGroupEl, 'help-block')
      helpEl.text(errorMsg) if helpEl?

    skip = (el)->
      elem = el.context
      return false if elem.nodeName is "TEXTAREA" or (elem.nodeName is "INPUT" and (elem.type isnt "radio" and elem.type isnt "checkbox"))
      return true

    makeDefault = (el)->
      frmGroupEl = findFormGroupElement(el)
      frmGroupEl.addClass('has-info')
      reset(frmGroupEl)

    {
      makeValid: makeValid,
      makeInvalid: makeInvalid,
      makeDefault: makeDefault,
      key: 'itsnow'
    };
  ])
