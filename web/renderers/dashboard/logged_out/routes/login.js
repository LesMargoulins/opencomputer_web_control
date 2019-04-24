var router = express.Router();

router.get('/login', function (req, res, next) {
    res.locals.page = "login";
    res.locals.title = "Sign In";
    res.locals.description = "Sign in to the Pixel Admin dashboard";
    next();
})

router.post('/login', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var ip = req.clientIp;
    var url = req.body.reditect?req.body.reditect:"/";

    var username = req.body.username;
    var password = req.body.password;
    var response = req.body.token;

    var secret = secretconfig.recaptchaSecret;

    var messages = [];

    if (!isDefined(username))
        messages.push({text:"Field is required", target:"username"});
    if (!isDefined(password))
        messages.push({text:"Field is required", target:"password"});

    if (messages.length > 0) {
        res.end(JSON.stringify({ result: "ko", messages: messages}));
        return;
    }

    axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
        params: {
            secret: secret,
            response: response,
            remoteip: ip
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    }).then(function (response) {
        if (response.data.success == true && response.data.action == "login") {
            if (response.data.score > 0.5) {
                safeQuery("SELECT * FROM users WHERE username = ?", [username]).then(function(result) {
                    if (result.length == 0) {
                        messages.push({text:"Wrong username or password"});
                        res.end(JSON.stringify({ result: "ko", messages: messages}));
                        return;
                    }
                    result = result[0];
                    var id = result.id;
                    checkPass(result.password, password, result.salt).then((result) => {
                        if (result == true) {
                            isBanned(id).then((result) => {
                                if (!result) {
                                    login(req, username, id);
                                    res.end(JSON.stringify({ result: "ok" }));
                                }
                                else {
                                    res.end(JSON.stringify({ result: "ko", messages: [{text:"You are not allowed to connect"}] }));
                                }
                            });
                            return;
                        }
                        else {
                            messages.push({text:"Wrong username or password"});
                            res.end(JSON.stringify({ result: "ko", messages: messages}));
                            return;
                        }
                    })
                    .catch((result) => {
                        messages.push({text:"Wrong username or password"});
                        res.end(JSON.stringify({ result: "ko", messages: messages}));
                        return;
                    });
                });
            }
            else {
                res.end(JSON.stringify({ result: "ko", messages: [
                    {text:"ReCaptcha failed"}
                ] }));
            }
        }
        else {
            res.end(JSON.stringify({ result: "ko", messages: [
                {text:"ReCaptcha failed"}
            ] }));
        }
    }).catch(function (error) {
        res.end(JSON.stringify({ result: "ko", messages: [
            {text:"ReCaptcha unavailable"}
        ] }));
    });
})

module.exports = router;