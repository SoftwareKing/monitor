(function () {
    Topo.Link = function (item, node1, node2) {
        this.Link = new HtmlLabelLink(node1, node2);
        this.Link._id = "l_" + item.id;
        if (item.classify == 0){
            this.Link.setStyle('link.color', '#BEBEBE');
        } else {
            this.Link.setStyle('link.color', '#2492dd');
        }

        this.Link.setStyle('link.width', 2);


        if (null == item.style || item.style == "") {
            this.Link.style = "arc";
        } else {
            this.Link.style = item.style;
            this.Link.setStyle('link.type', item.style);
        }
        if (null == item.cssLine || item.cssLine == "" || item.cssLine == "solid") {

        } else if (item.cssLine == "dotted"){
            this.Link.setStyle('link.flow', true);
            this.Link.setStyle('link.flow.converse', true);
            this.Link.setStyle('link.pattern', [5, 5]);
            this.Link.setStyle('link.flow.color', 'black');
            this.Link.setStyle('vector.outline.color', '#FFFFFF');
        }
        this.Link.cssLine = item.cssLine;
        this.Link.elName = item.name;
        this.Link.displayName = item.displayName;
        this.Link.customName = item.customName;
        this.Link.classify = item.classify;
        this.Link.elType = "link";
        this.Link.cId = item.moId;
        this.Link.inNodeMoId = node1.cId;
        this.Link.outNodeMoId = node2.cId;
        this.Link.inNodeMoName = node1.elName;
        this.Link.outNodeMoName = node2.elName;
        this.Link.inNodeMoType = node1.type;
        this.Link.outNodeMoType = node2.type;
        this.Link.inNodeMoClassify = node1.classify;
        this.Link.outNodeMoClassify = node2.classify;
        this.Link.inPort = item.inPort;
        this.Link.outPort = item.outPort;
        this.Link.elStatus = "off";
        this.Link.refreshThreshold = 0;
        this.Link.sampleLeft = item.sampleLeft;


        return this.Link;
    };
})();