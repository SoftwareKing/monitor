jQuery.fn.extend({
    set_limen: function (min, max) {
        var sum = max - min;
        var self = $(this);
        var curr_position = 0;
        self.find(".xntp_aca_conb_linea_box").draggable({
            containment: "parent",
            axis: "x",
            start: function (event, ui) {
                curr_position = event.clientX;
            },
            drag: function (event, ui) {
                var prev = $(this).prev(".xntp_aca_conb_linea_box");
                var next = $(this).next(".xntp_aca_conb_linea_box");
                var parent_width = self.width();

                if (event.clientX - curr_position > 0 && next.length > 0 && $(this).position().left >= next.position().left) {//如果有下一个
                    $(this).css({"left": next.position().left - parent_width / 100}).find("input").val(Math.round($(this).position().left / parent_width * sum) + min);
                    return false;
                }
                if (event.clientX - curr_position < 0 && prev.length > 0 && $(this).position().left <= prev.position().left) {//如果有上一个
                    $(this).css({"left": prev.position().left + parent_width / 100}).find("input").val(Math.round($(this).position().left / parent_width * sum) + min);
                    return false;
                }
                if ($(this).position().left > parent_width && event.clientX - curr_position > 0) {
                    return false;
                }
                self.find(".line_on").eq(self.find(".xntp_aca_conb_linea_box").index($(this))).width((parseInt($(this).find("input").val()) - min) * 100 / sum + "%");
                $(this).find("input").val(Math.round($(this).position().left / parent_width * sum) + min);
            },
            stop: function () {
                self.find(".line_on").eq(self.find(".xntp_aca_conb_linea_box").index($(this))).width((parseInt($(this).find("input").val()) - min) * 100 / sum + "%");
                $(this).css({"left": (parseInt($(this).find("input").val()) - min) * 100 / sum + "%"});
            }
        });
    }
});

