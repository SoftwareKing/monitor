jQuery.fn.extend({
    draw_lock: function (value) {
        function db_lock(obj) {
            this.imgsrc = obj.getAttribute("imgsrc");
            this.ctx = obj.getContext("2d");
            this.colors = ["#99cc66", "#a0cc63", "#a9cc5f", "#b4cc5b", "#c0cc55", "#cccc51", "#d7cc4b", "#e2cc46", "#eccc42", "#f3ca3f", "#f8c53e", "#f8bd3d", "#f8b23d", "#f8a53d", "#f5973d", "#ec7b3f", "#e86d40", "#e36141", "#e05643", "#de4f43"];
        }

        db_lock.prototype.bg = function () {
            this.ctx.beginPath();//绘制边框和投影
            this.ctx.fillStyle = "#f1f1f1";
            this.ctx.shadowColor = " ";
            this.ctx.shadowBlur = 0,
                this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.globalAlpha = 0.55;
            this.ctx.arc(67, 67, 67, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }
        db_lock.prototype.arc = function () {
            this.ctx.beginPath();//绘制背景
            this.ctx.shadowBlur = 2,
                this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 3;
            this.ctx.globalAlpha = 0.95;
            this.ctx.fillStyle = "#e5e5e5";
            this.ctx.arc(67, 67, 56, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }
        db_lock.prototype.img = function () {
            this.ctx.beginPath();//绘制图片
            var lock = new Image();
            var self = this;
            lock.onload = function () {
                self.ctx.drawImage(lock, 52, 67);
            }
            lock.src = this.imgsrc;
            this.ctx.closePath();
        }
        db_lock.prototype.tick = function (value) {
            var i = 0;
            var self = this;
            value = value >= 15 ? 60 : value * 60 / 15;
            self.ctx.lineWidth = 2;
            self.ctx.lineCap = "round";
            while (i++ < value) {
                self.ctx.save();
                self.ctx.beginPath();
                self.ctx.translate(67, 67);
                self.ctx.rotate(4.5 * i * Math.PI / 180);
                self.ctx.strokeStyle = self.ctx.fillStyle = self.colors[Math.floor(i / 3)];
                self.ctx.moveTo(0, -44);
                self.ctx.lineTo(0, -54);
                self.ctx.stroke();
                self.ctx.closePath();
                self.ctx.restore();
            }
        }
        db_lock.prototype.text = function (value) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "#666";
            this.ctx.font = "20px Tahoma";
            this.ctx.fillText(value, 22, 55);
            this.ctx.closePath();
        }
        db_lock.prototype.draw = function (value) {
            this.ctx.clearRect(0, 0, 134, 134);
            this.bg();
            this.arc();
            this.img();
            if(value>=0) {
                this.tick(value);
                this.text(value);
            }
        }
        new db_lock(this[0]).draw(value);
    }
});