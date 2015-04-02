(function () {
    TopobusinessChart.Node = function (item, size, horizontal, vertical) {
        this.node = new twaver.Node({
            id: "n_" + item.id,
            image: this.getImageName(item.img),
            location: {x: horizontal, y: vertical}
        });
        this.node.setName(item.moDisplayName);
        this.node.displayName = item.moDisplayName;
        this.node.setSize(size, size);
        this.node.size = "" + size + "," + size + "";
        this.node.cId = item.moId;
        this.node.type = item.mocpName;
        this.node.classify = item.mocName;
        this.node.elType = "node";
        this.node.elImg = item.img;
        this.node.setClient("movable", false);
        this.node.movable = false;
        return this.node;
    };

    TopobusinessChart.Node.prototype.getImageName = function (name) {
        name = "kuang_" + name;
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    };


})();