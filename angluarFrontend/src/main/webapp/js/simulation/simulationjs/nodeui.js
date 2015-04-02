function HtmlLabelNodeUISimulation(network, element) {
    HtmlLabelNodeUISimulation.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(HtmlLabelNodeUISimulation, twaver.network.NodeUI, {
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
    }
});
//node
function HtmlLabelNodeSimulation(id) {
    HtmlLabelNodeSimulation.superClass.constructor.call(this, id);
}
twaver.Util.ext(HtmlLabelNodeSimulation, twaver.Node, {
    getElementUIClass: function () {
        return HtmlLabelNodeUISimulation;
    }
});
