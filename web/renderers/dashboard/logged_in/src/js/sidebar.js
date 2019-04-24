$( document ).ready(function() {
    $(".navtoggler").click(function() {
        $(this).find(".hamburger").toggleClass("is-active");
        if ($(this).find(".hamburger").hasClass("is-active"))
            $("body").removeClass("closed");
        else
            $("body").addClass("closed");
    });

    $(".menu-item.has-sub > a").click(function() {
        if ($(this).parent(".menu-item").hasClass("selected")) {
            $(this).parent(".menu-item").removeClass("selected");
            $(this).next(".menu-sub").slideUp(150);
        }
        else {
            var elem = $(".menu-item.has-sub.selected > a")
            elem.next(".menu-sub").slideUp(150);
            elem.parent(".menu-item").removeClass("selected");
            $(this).parent(".menu-item").addClass("selected");
            $(this).next(".menu-sub").slideDown(150);
        }
    });

    $(".menu-sub > .menu-item").click(function() {
        if ($(this).hasClass("selected"))
            ;
        else {
            $(".menu-sub > .menu-item.selected").removeClass("selected");
            $(this).addClass("selected");
        }
    });

    //$('.sbcontent').asScrollable();
    $("#sidebar").mCustomScrollbar({
        scrollInertia: 200,
        theme:"minimal"
    });
});