module.exports = function() {
    debug.detail(" - Side Menu");

    this.declareMenu = function(res, category, menu, menuIcon) {
        for (i = 0; i < res.locals.sidemenu.length && res.locals.sidemenu[i].title != category; i++);
        if (i == res.locals.sidemenu.length)
            res.locals.sidemenu.push({title: category, menu: []});
        for (j = 0; j < res.locals.sidemenu[i].menu.length && res.locals.sidemenu[i].menu[j].title != menu; j++);
        if (j == res.locals.sidemenu[i].menu.length)
            res.locals.sidemenu[i].menu.push({title: menu, icon: menuIcon, submenu: []});
    }

    this.addSubMenu = function(res, category, menu, submenu, page, href) {
        for (i = 0; i < res.locals.sidemenu.length && res.locals.sidemenu[i].title != category; i++);
        if (i == res.locals.sidemenu.length)
            res.locals.sidemenu.push({title: category, menu: []});
        for (j = 0; j < res.locals.sidemenu[i].menu.length && res.locals.sidemenu[i].menu[j].title != menu; j++);
        if (j == res.locals.sidemenu[i].menu.length)
            res.locals.sidemenu[i].menu.push({title: menu, icon: "fas fa-question", submenu: []});
        for (k = 0; k < res.locals.sidemenu[i].menu[j].submenu.length && res.locals.sidemenu[i].menu[j].submenu[k].title != submenu; k++);
        if (k == res.locals.sidemenu[i].menu[j].submenu.length)
            res.locals.sidemenu[i].menu[j].submenu.push({title: submenu, data: {page: page, href: href}});
    }
};