(function () {
    TopobusinessChart.Link = function (item, node1, node2) {
        this.Link = new twaver.Link(node1, node2);
        this.Link._id = "l_" + item.id;
        this.Link.setStyle('link.color', '#BEBEBE');
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
        this.Link.inNodeMoName = node1.displayName;
        this.Link.outNodeMoName = node2.displayName;
        this.Link.inNodeMoType = node1.type;
        this.Link.outNodeMoType = node2.type;
        this.Link.inNodeMoClassify = node1.classify;
        this.Link.outNodeMoClassify = node2.classify;


        return this.Link;
    };
})();