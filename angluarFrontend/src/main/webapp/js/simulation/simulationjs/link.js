(function () {
    TopoSimulation.Link = function (item, node1, node2) {
        this.Link = new HtmlLabelLinkSimulation(node1, node2);
        this.Link._id = "l_" + item.id;
        this.Link.setStyle('link.color', '#BEBEBE');
        this.Link.setStyle('link.width', 4);


        this.Link.style = "arc";
        this.Link.setStyle('link.type', "arc");

        if (null == item.cssLine || item.cssLine == "" || item.cssLine == "solid") {

        } else if (item.cssLine == "dotted"){
            this.Link.setStyle('link.flow', true);
            this.Link.setStyle('link.flow.converse', false);
            this.Link.setStyle('link.pattern', [5, 5]);
            this.Link.setStyle('link.flow.color', 'black');
            this.Link.setStyle('vector.outline.color', '#FFFFFF');
        }
        this.Link.cssLine = item.cssLine;
        this.Link.elName = node1.displayName + "-" + node2.displayName;

        this.Link.elType = "link";

        this.Link.inNodeMoId = node1.cId;
        this.Link.outNodeMoId = node2.cId;
        this.Link.inNodeMoName = node1.elName;
        this.Link.outNodeMoName = node2.elName;
        this.Link.inNodeMoType = node1.type;
        this.Link.outNodeMoType = node2.type;
        this.Link.inNodeMoClassify = node1.classify;
        this.Link.outNodeMoClassify = node2.classify;
        this.Link.elStatus = "off";


        return this.Link;
    };
})();

//this.link.setStyle('label.rotatable', true);
//this.link.setStyle('link.type', 'flexional');
//this.link.setStyle('link.pattern', [10, 10]);
//this.link.setStyle('link.flow', true);
//this.link.setStyle('link.width', 6);
//this.link.setStyle('link.color', 'white');
//this.link.setStyle('link.flow.color', 'black');
