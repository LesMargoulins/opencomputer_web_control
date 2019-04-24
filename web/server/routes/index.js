module.exports = function() {
    debug.log("Loading Renderers");
    //Error page
    this.renderError = function(res, code, message) {
        res.locals.title = "Erreur " + code;
        res.locals.description = message;
        res.locals.page = "system/error";
        res.status(code);
        res.render(path.join(rootdir, 'ejs/error.ejs'));
    }

    this.renderers = [];

    function generateRenderers(folder) {
        var files = fs.readdirSync(folder);
        var tempRenderers = [];
        for (var i in files) {
            var file = fs.lstatSync(path.join(folder, files[i]));
            if (file.isDirectory() && fs.existsSync(path.join(folder, files[i] + "/config.json"))) {
                var jsonrawConfig = fs.readFileSync(path.join(folder, files[i] + "/config.json"));
                var jsonconfig = JSON.parse(jsonrawConfig);
                if ("id" in jsonconfig && "order" in jsonconfig) {
                    jsonconfig.path = path.join(folder, files[i]);
                    jsonconfig.file = files[i];
                    if (!("container" in jsonconfig))
                        jsonconfig.container = false;
                    else if (jsonconfig.container == true) {
                        jsonconfig.content = generateRenderers(path.join(folder, files[i]));
                    }
                    tempRenderers.push(jsonconfig);
                }
            }
        }

        tempRenderers.sort(function (a, b) {
            if (typeof(a.vhost) != typeof(b.vhost)) {
                if (typeof(a.vhost) === "string")
                    return (-1);
                else if (typeof(b.vhost) === "string")
                    return (1);
            }
            if (typeof(a.subdomain) != typeof(b.subdomain)) {
                if (typeof(a.subdomain) === "string")
                    return (-1);
                else if (typeof(b.subdomain) === "string")
                    return (1);
            }
            return (a.order - b.order);
        });

        return (tempRenderers);
    }

    renderers = generateRenderers(path.join(rootdir, "/renderers/"));

    function callRenderers(renderarray, domain = undefined, host = undefined) {
        var router = express.Router();
        for (var i = 0; i < renderarray.length; i++) {
            if (renderarray[i].container == true) {
                callRenderers(renderarray[i].content, renderarray[i].subdomain, renderarray[i].vhost);
            }
            else {
                router.use("/", require(path.join(renderarray[i].path, "/routes/index.js")));
            }
            if (typeof(host) === "string" && host.length > 0) {
                app.use("/", vhost(host, router));
            }
            else if (typeof(domain) === "string" && domain.length > 0)
                app.use("/", subdomain(domain, router));
            else
                app.use("/", router);
        }
    }

    callRenderers(renderers);

    //Start Server
    server.listen(config.port, function () {
        config.loaded = true;
        debug.logSuccess('Server listening on port ' + config.port, "SUCCESS", true);
        debug.detail("", true);
    })

};