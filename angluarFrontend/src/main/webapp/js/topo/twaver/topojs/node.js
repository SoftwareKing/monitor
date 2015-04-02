(function () {
    Topo.Node = function (item) {
        this.node = new HtmlLabelNode({
            id: "n_" + item.id,
            image: this.getImageName(item.img),
            location: {x: item.horizontal, y: item.vertical}
        });
        if (null != item.customName && item.customName != "") {
            this.node.setName(item.customName);
        } else if (null != item.name && item.name != "") {
            this.node.setName(item.name);
        }
        if (null != item.size && item.size != "") {
            var x = parseInt(item.size.split(",")[0]);
            var y = parseInt(item.size.split(",")[1]);
            this.node.setSize(x, y);
            this.node.size = item.size;
        } else {
            this.node.setSize(32, 32);
            this.node.size = "32,32";
        }
        if (null != item.name && item.name != "") {
            this.node.elName = item.name;
        } else {
            this.node.elName = "";
        }
        this.node.displayName = item.displayName;
        this.node.customName = item.customName;
        this.node.elUser = item.user;
        this.node.ip = item.ip;
        this.node.cId = item.moId;
        this.node.drillId = item.drillId;
        this.node.drillName = item.drillName;
        this.node.type = item.type;
        this.node.classify = item.classify;
        this.node.elType = "node";
        this.node.isDevice = item.isDevice;
        this.node.elImg = item.img;
        this.node.elStatus = "off";
        this.node.elAlarmLevel = -1;
        this.node.elAlarmCount = -1;
        this.node.mirroring = item.mirroring;
        this.node.elImgPath = item.imgPath;
        if (item.isSelect == "true"){
            this.node.setClient("isSelectable", false);
        }
        this.node.isSelect = item.isSelect;
        this.node.refreshThreshold = 0;
        return this.node;
    };

    Topo.Node.prototype.getImageName = function (name) {
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    };


})();