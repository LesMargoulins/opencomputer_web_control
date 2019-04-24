$( document ).ready(function() {
    $(".logout").click(function() {
        $('<form action="/logout" method="post"></form>').appendTo('body').submit();
    });

    $(".close").click(function() {
        if ($(this).attr("target-parent")) {
            var elem = $(this).closest( $(this).attr("target-parent") ).find($(this).attr("target-element"));
        }
        else if ($(this).attr("target-element"))
            var elem = $($(this).attr("target-element"));
        else if ($(this).attr("target-closest-element")) {
            var elem = $(this).closest( $(this).attr("target-closest-element") );
        }
        else if ($(this).attr("target-next-element")) {
            var elem = $(this).next( $(this).attr("target-next-element") );
        }
        else {
            var elem = $(this);
        }
        if (typeof $(this).attr("parent-of-target") !== typeof undefined) {
            elem = elem.parent();
        }
        elem.fadeOut();
    })

    $(".minimise").click(function() {
        if ($(this).attr("target-parent")) {
            var elem = $(this).closest( $(this).attr("target-parent") ).find($(this).attr("target-element"));
        }
        else if ($(this).attr("target-element"))
            var elem = $($(this).attr("target-element"));
        else if ($(this).attr("target-closest-element")) {
            var elem = $(this).closest( $(this).attr("target-closest-element") );
        }
        else if ($(this).attr("target-next-element")) {
            var elem = $(this).next( $(this).attr("target-next-element") );
        }
        else {
            var elem = $(this);
        }
        if (typeof $(this).attr("parent-of-target") !== typeof undefined) {
            elem = elem.parent();
        }
        that = $(this).find("i");
        elem.slideToggle("slow","swing", function(){
            if (elem.is(":visible") == true){
                that.removeClass("fa-plus");
                that.addClass("fa-minus");
            }
            else {
                that.removeClass("fa-minus");
                that.addClass("fa-plus");
            }
        });
    })
});