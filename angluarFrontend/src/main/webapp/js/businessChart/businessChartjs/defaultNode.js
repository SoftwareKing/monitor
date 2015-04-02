(function () {
    TopobusinessChart.DefaultNode = function (i, j, rows, columns, img, size) {
        this.node = new twaver.Node({
            id: "d_" + i + "_" + j,
            image: this.getImageName(img)
        });
        this.node.setLocation(rows, columns);
        this.node.setSize(size, size);
        this.node.size = "" + size + "," + size + "";
        this.node.elType = "defaultNode";
        this.node.setClient("movable", false);
        this.node.movable = false;
        return this.node;
    };

    TopobusinessChart.DefaultNode.prototype.getImageName = function (name) {
        name = "kuang_" + name;
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    };


})();