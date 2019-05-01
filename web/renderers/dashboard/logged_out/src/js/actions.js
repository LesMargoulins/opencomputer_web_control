var captcha = false;
var submitbtn = "";

function setCaptchaToken(state = false) {
    if (state == false) {
        if (submitbtn == "")
            submitbtn = $(".submitbtn").html();
        $(".submitbtn").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>')
        $(".submitbtn").prop('disabled', true);
    }
    else if (submitbtn != "") {
        $(".submitbtn").html(submitbtn);
        $(".submitbtn").prop('disabled', false);
    }
    captcha = state;
}

function generateErrorMsg(msg) {
    return ("<li><i class='fas fa-times'></i>&nbsp;&nbsp;" + msg + "</li>");
}

setCaptchaToken(false);

$( document ).ready(function() {

    setCaptchaToken(false);

    $( document ).ready(function() {
        searchParams = new URLSearchParams(window.location.search);

        // this is the id of the form
        $("#logform").submit(function(e) {

            e.preventDefault(); // avoid to execute the actual submit of the form.

            if (!captcha) {
                alert("No token");
                return false;
            }
            else {
                var form = $(this);
                var url = form.attr('action');
                var data = form.serializeArray();
                data.push({name: "token", value: captcha});
                setCaptchaToken(false);
                $(".errormsg ul").html("");

                $.ajax({
                    type: "POST",
                    url: url,
                    data: $.param(data), // serializes the form's elements.
                    success: function(result)
                    {
                        if (result.result == "ok") {
                            window.location.href = searchParams.has('redirect')?searchParams.get('redirect'):"/";
                        }
                        else {
                            if (result.result != "ko" || !result.messages || result.messages.length == 0)
                                $(".errormsg.general ul").html(generateErrorMsg("Unknown Error"));
                            else {
                                for (i = 0; i < result.messages.length; i++) {
                                    if (result.messages[i].target) {
                                        $(".errormsg[target='" + result.messages[i].target + "'] ul").append(generateErrorMsg(result.messages[i].text));
                                    }
                                    else {
                                        $(".errormsg.general ul").append(generateErrorMsg(result.messages[i].text));
                                    }
                                }
                            }
                            //TODO: Get token from param
                            generateCaptcha();
                        }
                    },
                    error: function(xhr, status, error) {
                        /*var err = eval("(" + xhr.responseText + ")");
                        if (err)
                            alert(err.Message);*/
                        alert("error");
                    }
                });
            }
        });
    });
});