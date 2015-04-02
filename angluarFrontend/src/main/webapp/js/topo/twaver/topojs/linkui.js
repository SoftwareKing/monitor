function HtmlLabelLinkUI(network, element) {
    HtmlLabelLinkUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(HtmlLabelLinkUI, twaver.network.LinkUI, {
    checkAttachments: function () {
        twaver.network.NodeUI.prototype.checkAttachments.call(this);
        this.checkComponentAttachment();
    },
    checkComponentAttachment: function () {
        if (!this._componentAttachment && this._element.getStyle('component.content')) {
            this._componentAttachment = new HtmlComponentAttachment(this);
            //console.log("初始化  " + this._element._id + +"  " + new Date().toLocaleString());
        }
        if (this._componentAttachment && !this._element.getStyle('component.visible')) {
            // this._componentAttachment.getView().style.display = "none";
            var isThere = false;
            for (var i = 0; i < this.getAttachments().size(); i++) {
                if (this.getAttachments().get(i) instanceof HtmlComponentAttachment) {
                    isThere = true;
                }
            }
            if (isThere) {
                this.removeAttachment(this._componentAttachment);
                //console.log("移除后  " + this._element._id + +"  " + new Date().toLocaleString());
            } else {
                //console.log("不移除  " + this._element._id + +"  " + new Date().toLocaleString());
            }
        }
        if (this._componentAttachment && this._element.getStyle('component.visible')) {
            var isThere = false;
            for (var i = 0; i < this.getAttachments().size(); i++) {
                if (this.getAttachments().get(i) instanceof HtmlComponentAttachment) {
                    isThere = true;
                }
            }
            if (!isThere) {
                this.addAttachment(this._componentAttachment);
                this._componentAttachment.getView().style.display = "block";
                this._componentAttachment.getView().style.zIndex = 2147483647;
                //console.log("加入后  " + this._element._id + +"  " + new Date().toLocaleString());
            } else {
                //console.log("未加入  " + this._element._id + +"  " + new Date().toLocaleString());
            }
        }
    },
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
    checkAlarmAttachment: function () {
        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new HtmlAlarmAttachment(this, false);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    }
});

function HtmlLabelLink(id, from, to) {
    HtmlLabelLink.superClass.constructor.call(this, id, from, to);
}
twaver.Util.ext(HtmlLabelLink, twaver.Link, {
    getElementUIClass: function () {
        return HtmlLabelLinkUI;
    }
});

