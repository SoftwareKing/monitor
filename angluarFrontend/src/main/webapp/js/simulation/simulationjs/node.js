(function () {
    TopoSimulation.Node = function (item) {
        this.node = new HtmlLabelNodeSimulation({
            id: "n_" + item.id,
            image: this.getImageName(item.img),
            location: {x: item.horizontal, y: item.vertical}
        });
        this.node.setName(item.moDisplayName);
        if (null != item.size && item.size != "") {
            var x = parseInt(item.size.split(",")[0]);
            var y = parseInt(item.size.split(",")[1]);
            this.node.setSize(x, y);
            this.node.size = item.size;
        } else {
            this.node.setSize(58, 58);
            this.node.size = "58,58";
        }
        if (null != item.moDisplayName && item.moDisplayName != "") {
            this.node.elName = item.moDisplayName;
        } else {
            this.node.elName = "";
        }
        this.node.cId = item.moId;
        this.node.type = item.mocpName;
        this.node.classify = item.mocName;
        this.node.elType = "node";
        this.node.elImg = item.img;
        this.node.elStatus = "off";
        return this.node;
    };

    TopoSimulation.Node.prototype.getImageName = function (name) {
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    };


})();