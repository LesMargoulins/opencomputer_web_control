var computers = [];

function initAddComputer() {
    $(".addComputer").unbind( "click" );
    $(".addComputer").click(function() {
        resetModal();
        modalSetTitle("Link a Computer");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<form>' +
        '<div class="form-group">' +
        '<label for="ip_address">IP address</label>' +
        '<input type="text" class="form-control" value="" id="ip_address"/>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="computer_id">Computer ID</label>' +
        '<input type="text" class="form-control" value="" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" id="computer_id"/>' +
        '</div>' +
        '</form>');
        modalSetConfirmCallback(function() {
            var ip_address = $("#ip_address").val();
            var computer_id = $("#computer_id").val();
            $.ajax({
                type: "POST",
                url: "/my_computers/link",
                data: $.param([
                    { name: "ip_address", value: ip_address},
                    { name: "computer_id", value: computer_id}
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> Computer has been linked.')
                        $(".nocomputer").remove();
                        addComputer(result.computer);
                        initTools();
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
        $("#computer_id").mask('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', {'translation': {
                x: {pattern: /[a-f0-9]/},
            }
        });
    });
}

function initControlTool() {
    $(".control").unbind( "click" );
    $(".control").click(function() {
        var id = $(this).attr("target");
        window.location.href = "/my_computer/" + id;
    });
}

function initRenameTool() {
    $(".rename").unbind( "click" );
    $(".rename").click(function() {
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
    initAddComputer();
    initControlTool();
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

function getStatus(status) {
    switch (status) {
        case 1:
            return "Disconnected";
        case 2:
            return "Connected";
        case 3:
            return "Loading";
        case 4:
            return "Error";
        case 5:
            return "Off";
    }
    return ("Unknown");
}

function addComputer(computer) {
    computers.push(computer.id);
    $(".computerlist").append('<div targetid="' + computer.id + '" class="computerdiv computer_' + computer.id + ' ' + statusClass(computer.status) + '" ><img class="computerIco computerIco_' + computer.id + '" src="' + computerImage(computer.status) + '"/><div class="computerInfo computerInfo_' + computer.id + ' ' + flagClass(computer.status) + '"><h5 style="margin-bottom: 0px"><b><span class="computer_' + computer.id + '_name">' + computer.name + '</span></b></h5>[' + computer.computer_id + '@' + computer.server_ip + ']<br><b class="computerStatus_' + computer.id + '">' + getStatus(computer.status) + '</b></div><div class="computer-tools"><i class="list-tool fas fa-pen rename" target="' + computer.id + '"></i><i class="list-tool fas fa-laptop-code control" target="' + computer.id + '"></i></div></div>')
}

function removeComputer(id) {
    if (computers.indexOf(id) >= 0) {
        computers.splice(computers.indexOf(id), 1);
    }
    $("computer_" + id).remove();
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
                    $(".computerlist").html("<span class='nocomputer'>You don't have any computer linked.</span>");
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