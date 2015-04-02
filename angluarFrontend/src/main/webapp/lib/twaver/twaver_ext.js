HtmlBasicAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.BasicAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._roundRect = { x: 0, y: 0, width: 0, height: 0 };
    this._contentRect = { x: 0, y: 0, width: 0, height: 0 };
    this._triangleDiv = twaver.Util.createDiv();
    this._roundDiv = twaver.Util.createDiv();
    this._contentDiv = twaver.Util.createDiv();

    twaver.Util.setCSSStyle(this._triangleDiv, "border-style", "solid");
    twaver.Util.setCSSStyle(this._contentDiv, "white-space", "nowrap");

    var self = this;
    function toRotatedPoint(x, y, ox, oy, lx, ly, ispositive) {
        if (!ox) {
            ox = this._origin.x;
        }
        if (!oy) {
            oy = this._origin.y;
        }
        if (!lx) {
            lx = this._location.x;
        }
        if (!ly) {
            ly = this._location.y;
        }
        x = x - ox - lx; y = y - oy - ly;
        var point = twaver.Util.transformPoint({ x: ox + lx, y: oy + ly }, (ispositive ? this._radian : -this._radian), x, y).point;
        return point;
    }
    this.hit = function (x, y) {
        if (this._radian && this._origin) {
            var point = toRotatedPoint.call(self, x, y);
            x = point.x, y = point.y;
        }
        return twaver.Util.containsPoint(this._roundRect, x, y) || twaver.Util.containsPoint(this._pointerRect, x, y);
    };
    this.intersects = function (rect) {
        var a = { x: rect.x, y: rect.y }, b = { x: rect.x + rect.width, y: rect.y }, c = { x: rect.x, y: rect.y + rect.height }, d = { x: rect.x + rect.width, y: rect.y + rect.height };
        if (this._radian && this._origin) {
            if (rect.width * rect.height > 50) return false;
            a = toRotatedPoint.call(self, a.x, a.y);
            b = toRotatedPoint.call(self, b.x, b.y);
            c = toRotatedPoint.call(self, c.x, c.y);
            d = toRotatedPoint.call(self, d.x, d.y);
        }
        rect = twaver.Util.getRect([a, b, c, d]);
        return twaver.Util.intersects(this._roundRect, rect) || twaver.Util.intersects(this._pointerRect, rect);
    }
    this.getContentWidth = function () {
        return this._contentDiv.scrollWidth || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "width"));
    }
    this.getContentHeight = function () {
        return this._contentDiv.scrollHeight || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "height"));
    }

    this._view.appendChild(this._roundDiv);
    this._roundDiv.appendChild(this._contentDiv);
};
twaver.Util.ext(HtmlBasicAttachment, twaver.network.BasicAttachment, {
    calculateMeasure: function () {
        var contentWidth = this.getContentWidth();
        var contentHeight = this.getContentHeight();
        var cornerRadius = Math.min(this.getCornerRadius(), contentHeight / 2);
        var pointerLength = this.getPointerLength();
        var pointerWidth = this.getPointerWidth();
        var position = this.getPosition();
        var xOffset = this.getXOffset();
        var yOffset = this.getYOffset();

        this._contentRect.width = contentWidth;
        this._contentRect.height = contentHeight;
        this._contentRect.x = cornerRadius;

        var roundRect = this._roundRect;
        roundRect.width = contentWidth + cornerRadius * 2;
        roundRect.height = contentHeight;
        var location;

        if (pointerLength > 0) {
            var direction = this.getDirection();
            location = this._network.getPosition(position, this._ui, null, xOffset, yOffset);
            var endPoint;
            if (direction === 'aboveleft') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - (roundRect.width - cornerRadius);

                this._pointers = [location,
	     						{ x: location.x, y: location.y - pointerLength },
	     						{ x: location.x - Math.min(pointerWidth, contentWidth), y: location.y - pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " " + fillColor + " transparent transparent";
                this._triangleDivLocation = this._pointers[2];
            }
            else if (direction === 'aboveright') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - cornerRadius;

                this._pointers = [location,
	     						{ x: location.x, y: location.y - pointerLength },
	     						{ x: location.x + Math.min(pointerWidth, contentWidth), y: location.y - pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " transparent transparent " + fillColor;
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'belowleft') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - (roundRect.width - cornerRadius);

                this._pointers = [location,
	     						{ x: location.x, y: location.y + pointerLength },
	     						{ x: location.x - Math.min(pointerWidth, contentWidth), y: location.y + pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = " transparent " + fillColor + " " + fillColor + " transparent";
                this._triangleDivLocation = { x: this._pointers[2].x, y: location.y }
            }
            else if (direction === 'belowright') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - cornerRadius;

                this._pointers = [location,
	     						{ x: location.x, y: location.y + pointerLength },
	     						{ x: location.x + Math.min(pointerWidth, contentWidth), y: location.y + pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent " + fillColor + " " + fillColor;
                this._triangleDivLocation = this._pointers[0];
            }
            else if (direction === 'above') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - roundRect.width / 2;

                this._pointers = [location,
	     						{ x: location.x - Math.min(pointerWidth, contentWidth) / 2, y: location.y - pointerLength },
	     						{ x: location.x + Math.min(pointerWidth, contentWidth) / 2, y: location.y - pointerLength}];

                var hBorderWidth = pointerLength;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + "0px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " transparent transparent transparent";
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'below') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - roundRect.width / 2;

                this._pointers = [location,
	     						{ x: location.x - Math.min(pointerWidth, contentWidth) / 2, y: location.y + pointerLength },
	     						{ x: location.x + Math.min(pointerWidth, contentWidth) / 2, y: location.y + pointerLength}];

                var hBorderWidth = pointerLength;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = "0px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent " + fillColor + " transparent ";
                this._triangleDivLocation = { x: this._pointers[1].x, y: location.y };
            }
            else if (direction === 'left') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x - roundRect.width - pointerLength;

                this._pointers = [location,
	     						{ x: location.x - pointerLength, y: location.y - Math.min(pointerWidth, contentHeight) / 2 },
	     						{ x: location.x - pointerLength, y: location.y + Math.min(pointerWidth, contentHeight) / 2}];

                var hBorderWidth = Math.min(pointerWidth, contentHeight) / 2;
                var vBorderWidth = pointerLength;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px 0px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent  transparent " + fillColor;
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'right') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x + pointerLength;

                this._pointers = [location,
	     						{ x: location.x + pointerLength, y: location.y - Math.min(pointerWidth, contentHeight) / 2 },
	     						{ x: location.x + pointerLength, y: location.y + Math.min(pointerWidth, contentHeight) / 2}];

                var hBorderWidth = Math.min(pointerWidth, contentHeight) / 2;
                var vBorderWidth = pointerLength;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + "0px";
                this._triangleBorderColorStyle = "transparent " + fillColor + " transparent  transparent ";
                this._triangleDivLocation = { x: location.x, y: this._pointers[1].y };
            }
            else {
                throw "Can not resolve '" + direction + "' attachment direction";
            }
        }
        else {
            location = this._network.getPosition(position, this._ui, { width: roundRect.width, height: roundRect.height }, xOffset, yOffset);
            roundRect.x = location.x;
            roundRect.y = location.y;
            this._pointers = null;
        }
        this._location = location;
    },
    updateMeasure: function () {
        this.calculateMeasure();

        if (this._ui.isShadowable() && this.isShadowable()) {
            twaver.Util.setCSSStyle(this._roundDiv, "text-shadow", this._ui._shadowXOffset + "px " + this._ui._shadowYOffset + "px " + this._ui._shadowBlur + "px " + this._ui._shadowColor);
        } else {
            twaver.Util.removeCSSStyle(this._roundDiv, "text-shadow");
        }

        this._pointerRect = twaver.Util.getRect(this._pointers);
        this._viewRect = twaver.Util.unionRect(this._pointerRect, this._roundRect);

        twaver.Util.setCSSStyle(this._contentDiv, "left", this._contentRect.x + "px");
        twaver.Util.setCSSStyle(this._contentDiv, "top", this._contentRect.y + "px");


        twaver.Util.setCSSStyle(this._roundDiv, "left", this._roundRect.x + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "top", this._roundRect.y + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "width", this._roundRect.width + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "height", this._roundRect.height + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "background", this.isFill() ? this.getFillColor() : null);


        twaver.Util.setCSSStyle(this._roundDiv, "-webkit-border-radius", this.getCornerRadius() + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "-moz-border-radius", this.getCornerRadius() + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "border-radius", this.getCornerRadius() + "px");

        if (this._pointers) {
            twaver.Util.setCSSStyle(this._triangleDiv, "left", this._triangleDivLocation.x + "px");
            twaver.Util.setCSSStyle(this._triangleDiv, "top", this._triangleDivLocation.y + "px");
            twaver.Util.setCSSStyle(this._triangleDiv, "border-width", this._triangleBorderWidthStyle);
            twaver.Util.setCSSStyle(this._triangleDiv, "border-color", this._triangleBorderColorStyle);

            this._view.appendChild(this._triangleDiv);
        } else {
            if (this._triangleDiv.parentNode == this._view)
                this._view.removeChild(this._triangleDiv);
        }

        if (this._element.getStyle('label.rotatable') && this.label) {
            var fromLocation = this._ui.getFromPoint();
            var toLocation = this._ui.getToPoint();

            var points = this._ui.getLinkPoints();
            if (points.size() % 2 == 0) {
                fromLocation = points.get(points.size() / 2 - 1);
                toLocation = points.get(points.size() / 2);
            }

            if (fromLocation.x > toLocation.x) {
                this._radian = twaver.Util.getRadiansBetweenLines(toLocation, fromLocation);
            } else {
                this._radian = twaver.Util.getRadiansBetweenLines(fromLocation, toLocation);
            }
            this._origin = { x: this._contentRect.width / 2, y: 0 };


            var deg = "rotate(" + (twaver.Util.toDegrees(this._radian)) + "deg)";
            var origin = this._origin.x + "px " + this._origin.y + "px";
            if (twaver.Util.isChrome || twaver.Util.isSafari) {
                twaver.Util.setCSSStyle(this._roundDiv, "-webkit-transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "-webkit-transform-origin", origin);
            } else if (twaver.Util.isIE) {
                twaver.Util.setCSSStyle(this._roundDiv, "-ms-transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "-ms-transform-origin", origin);
            } else {
                twaver.Util.setCSSStyle(this._roundDiv, "transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "transform-origin", origin);
            }
        } else {
            twaver.Util.removeCSSStyle(this._roundDiv, "-webkit-transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "-webkit-transform-origin");

            twaver.Util.removeCSSStyle(this._roundDiv, "-ms-transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "-ms-transform-origin");

            twaver.Util.removeCSSStyle(this._roundDiv, "transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "transform-origin");

            delete this._origin;
            delete this._radian;
        }

    }
});


HtmlAlarmAttachment = function (elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.alarm = true;
};
twaver.Util.ext(HtmlAlarmAttachment, twaver.network.AlarmAttachment, {
    updateMeasure: function () {
        var font = this.getFont('alarm.font');
        this._contentDiv.innerHTML = this._network.getAlarmLabel(this._element);

        twaver.Util.setCSSStyle(this._contentDiv, "font",font);

        this._fillColor = this._network.getAlarmFillColor(this._element);
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function HtmlLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

HtmlComponentAttachment = function (elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
};
twaver.Util.ext(HtmlComponentAttachment, HtmlBasicAttachment, {
    updateMeasure: function () {
        var component = this._element.getStyle("component.content");
        if (!component.parentNode || component.parentNode != this._contentDiv) {
            this._contentDiv.appendChild(component);
        } 
        this._fillColor = this._element.getStyle("component.fillcolor");
        if (!this._fillColor) this._fillColor = "blue";
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
    },
    getPosition: function () {
        return this.getStyle('component.position');
    },
    getDirection: function () {
        return this.getStyle('component.direction');
    },
    getPointerLength: function () {
        return this.getStyle('component.pointer.length');
    },
    getPointerWidth: function () {
        return this.getStyle('component.pointer.width');
    },
    isShadowable: function () {
        return false;
    },
    getCornerRadius: function () {
        var radius = this.getStyle('component.corner.radius');
        return radius ? radius : 10;
    },
    getPointerLength: function () {
        var length = this.getStyle('component.pointer.length');
        return length ? length : 8;
    },
    getPointerWidth: function () {
        var pwidth = this.getStyle('component.pointer.width');
        return pwidth ? pwidth : 5;
    },
    getPosition: function () {
        var position = this.getStyle('component.position');
        return position ? position : "top";
    },
    getXOffset: function () {
        var xoffset = this.getStyle('component.xoffset');
        return xoffset ? xoffset : 0;
    },
    getYOffset: function () {
        var yoffset = this.getStyle('component.yoffset');
        return yoffset ? yoffset : 0;
    },
    getDirection: function () {
        var direction = this.getStyle('component.direction');
        return direction ? direction : "aboveright";
    },
    isFill: function () {
        return this._fillColor != null;
    },
    getFillColor: function () {
        return this._fillColor;
    }
});