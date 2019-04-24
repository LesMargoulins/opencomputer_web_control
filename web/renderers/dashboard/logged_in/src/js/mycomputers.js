function initRenameTool() {
    $(".rename").click(function() {
        console.log("test");
        var id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Rename Computer");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<form>' +
        '<input type="text" class="form-control" value="' + $(".computer_" + id + "_name").text() + '" id="computer_new_name"/>' +
        '</form>');
        modalSetConfirmCallback(function() {
            var name = $("#computer_new_name").val();
            $.ajax({
                type: "POST",
                url: "/my_computers/rename",
                data: $.param([
                    { name: "id", value: id},
                    { name: "newName", value: name}
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> Computer name has been changed.')
                        $(".computer_" + id + "_name").html(result.name);
                        modal.open();
                    }
                    else {
                        if (result.result != "ko" || !result.message) {
                            modalSetContent('<i class="fas fa-times text-danger"></i> An unknown error occured.')
                        }
                        else {
                            modalSetContent('<i class="fas fa-times text-danger"></i> ' + result.message);
                        }
                        modal.open();
                    }
                },
                error: function(err) {
                    hideLoader();
                    resetModal();
                    modalSetContent('<i class="fas fa-times text-danger"></i> An error occured, request failed.');
                    modal.open();
                }
            });
        }, showLoader);
        modal.open();

    });
}

function initTools() {
    initRenameTool();
}

function statusClass(status) {
    return (status==1?"disabled":"")
}

function computerImage(status) {
    switch (status) {
        case 1:
            return "/img/computer_disconnected.png";
        case 2:
            return "/img/computer_working.gif";
        case 3:
            return "/img/computer_loading.gif";
        case 4:
            return "/img/computer_error.gif";
        case 5:
            return "/img/computer_off.png";
    }
    return ("/img/computer.png");
}

function flagClass(status) {
    switch (status) {
        case 1:
            return "danger";
        case 2:
            return "success";
        case 3:
            return "info";
        case 4:
            return "danger";
        case 5:
            return "off";
    }
    return ("unknown");
}

function addComputer(computer) {
    $(".computerlist").append('<div class="computerdiv computer_' + computer.id + ' ' + statusClass(computer.status) + '" ><img class="computerIco" src="' + computerImage(computer.status) + '"/><div class="computerInfo ' + flagClass(computer.status) + '"><h5><b><span class="computer_' + computer.id + '_name">' + computer.name + '</span></b></h5><p>' + (computer.status_name?computer.status_name:"Uknown") + '</p></div><div class="computer-tools"><i class="list-tool fas fa-pen rename" target="' + computer.id + '"></i><i class="list-tool fas fa-laptop-code" target="' + computer.id + '"></i></div></div>')
}

function fetchComputers() {
    showLoader();
    $.ajax({
        type: "POST",
        url: "/my_computers",
        data: $.param([
            {},
        ]),
        success: function(result)
        {
            hideLoader();
            resetModal();
            if (result.result == "ok") {
                if (result.computers.length == 0)
                    $(".computerlist").html("You don't have any computer linked.");
                for (i = 0; i < result.computers.length; i++) {
                    addComputer(result.computers[i]);
                }
                initTools();
            }
            else {
                if (result.result != "ko" || !result.message) {
                    modalSetContent('<i class="fas fa-times text-danger"></i> An unknown error occured.')
                }
                else {
                    modalSetContent('<i class="fas fa-times text-danger"></i> ' + result.message);
                }
                modal.open();
            }
        },
        error: function(err) {
            hideLoader();
            resetModal();
            modalSetContent('<i class="fas fa-times text-danger"></i> An error occured, request failed.');
            modal.open();
        }
    });
}

function loadPage() {
    $(".computerlist").html("");
    fetchComputers();
}

$( document ).ready(function() {
    loadPage();
});