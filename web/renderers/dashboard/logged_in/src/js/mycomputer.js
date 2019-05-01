var computers = [];

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function initRenameTool() {
    $(".rename").unbind( "click" );
    $(".rename").click(function() {
        var id = computer_id;
        that = $(this);
        resetModal();
        modalSetTitle("Rename Computer");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<form>' +
        '<input type="text" class="form-control" value="' + $(".computer_" + id + "_name:first").text() + '" id="computer_new_name"/>' +
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

function goToConsole() {
    $("#editor").fadeOut( "fast" );
    $("#editor_form").fadeOut( "fast" );
    $("#editor_button").fadeOut( "fast" );
    $("#code").fadeIn( "fast" );
}

function goToEditor() {
    $("#editor").fadeIn( "fast" );
    $("#editor_button").fadeIn( "fast" );
    $("#code").fadeOut( "fast" );
}

function initConsoleAccessTool() {
    $(".console").unbind( "click" );
    $(".console").click(function() {
        goToConsole();
    });
}

function initEditorAccessTool() {
    $("#editor_button").unbind( "click" );
    $("#editor_button").click(function() {
        $("#editor_form").fadeToggle( "fast" );
    });

    $(".editor").unbind( "click" );
    $(".editor").click(function() {
        goToEditor();
    });
}

function saveEditorFile() {
    //SAVE
    editor.setValue("",0);
}

function initUnlinkComputer() {
    $(".unlink").unbind( "click" );
    $(".unlink").click(function() {
        resetModal();
        modalSetTitle("Unlink Computer");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<i class="fas fa-exclamation-triangle text-warning"></i> Do you really want to unlink this computer?');
        modalSetConfirmCallback(function() {
            $.ajax({
                type: "POST",
                url: "/my_computers/unlink",
                data: $.param([
                    { name: "computer_id", value: computer_id}
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        //window.location.href = "/my_computers";
                        return;
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

function explorerAddFolder(path, filename, size) {
    path = escapeHtml(path);
    filename = escapeHtml(filename);
    size = escapeHtml(size);
    var folder = '';
    folder += '<tr type="folder" path="' + path + '">';
    folder += '<td style="collapse; border: none; padding-right: 30px;"><i class="fas fa-folder"></i></td>';
    folder += '<td style="collapse; border: none;">' + filename + '</td>'
    folder += '<td style="collapse; border: none;">' + size + '</td>'
    folder += '</tr>';
    $(".explorer").append(folder);
}

function explorerAddFile(path, filename, size) {
    path = escapeHtml(path);
    filename = escapeHtml(filename);
    size = escapeHtml(size);
    var folder = '';
    folder += '<tr type="file" path="' + path + '">';
    folder += '<td style="collapse; border: none; padding-right: 30px;"><i class="fas fa-file"></i></td>';
    folder += '<td style="collapse; border: none;">' + filename + '</td>'
    folder += '<td style="collapse; border: none;">' + size + '</td>'
    folder += '</tr>';
    $(".explorer").append(folder);
}

function showDirectory(dir) {
    dir = JSON.parse(dir);
    dir.sort(function (a, b) {
        if (a.type == b.type)
            return (0);
        if (a.type == "folder")
            return (-1);
        return (1);
    });
    $(".explorer").html("<tr><th></th><th style='padding-right: 40px;'>File Name</th><th>File Size</th></tr>");
    for (var i = 0; i < dir.length; i++) {
        if (dir[i].type == "folder")
            explorerAddFolder(dir[i].path, dir[i].name, dir[i].size);
        else
            explorerAddFile(dir[i].path, dir[i].name, dir[i].size);
    }
    initComputerFolder();
}

function initComputerFolder() {
    $(".explorer tr").unbind( "click" );
    $(".explorer tr").click(function() {
        if ($(this).attr("type") == "folder") {
            loadFolder($(this).attr("path"));
        }
        else if ($(this).attr("type") == "file") {
            getFile($(this).attr("path"));
        }
    });
}

function initSaveFile() {
    $("#saveFile").unbind("click");
    $("#saveFile").click(function() {
        var filename = "/home/" + $("#file").val();
        var value = editor.getValue();
        value = value.replace(/;/g, '\\;');
        saveFile(filename, value);
    });
}

function initTools() {
    initRenameTool();
    initConsoleAccessTool();
    initEditorAccessTool();
    initUnlinkComputer();
    initComputerFolder();
    initSaveFile();
}

function displayComputer(computer) {
    computers.push(computer.id);
    var buttons = '<button type="button" style="height: 100%; border-radius: 0; flex: 1;" class="btn btn-info console">Console Access</button>';
    buttons += '<button type="button" style="height: 100%; border-radius: 0; flex: 1" class="btn btn-success editor">File Editor</button>';
    buttons += '<button type="button" style="height: 100%; border-radius: 0; flex: 1" class="btn btn-danger unlink">Unlink</button>';
    $(".computer").append('<div style="margin: 0; padding: 0; border-radius: 0px;" targetid="' + computer.id + '" class="computerdiv computer_' + computer.id + ' ' + statusClass(computer.status) + '"><img class="computerIco computerIco_' + computer.id + '" src="' + computerImage(computer.status) + '"/><div class="computerInfo computerInfo_' + computer.id + ' ' + flagClass(computer.status) + '"><span class="computer_<%= computer_id %>_name">' + computer.name + '</span> <i class="list-tool fas fa-pen rename" target="' + computer.id + '"></i><br><span>[' + computer.computer_id + '@<a href="http://' + computer.server_ip + '" target="_blank">' + computer.server_ip + '</a>]</span><br><b class="computerStatus_' + computer.id + '">' + getStatus(computer.status) + '</b></div><div class="computer-tools"></div><div style="width: 50%; border-left: 1px solid #252525; display: flex;">' + buttons + '</div></div>')
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

function removeComputer(id) {
    if (computers.indexOf(id) >= 0) {
        computers.splice(computers.indexOf(id), 1);
    }
    $("computer_" + id).remove();
}

function fetchComputer() {
    showLoader();
    $.ajax({
        type: "POST",
        url: "/my_computer",
        data: $.param([
            { name: "computer_id", value: computer_id },
        ]),
        success: function(result)
        {
            hideLoader();
            resetModal();
            if (result.result == "ok") {
                displayComputer(result.computer);
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
    $(".computer").html("");
    fetchComputer();
}

$( document ).ready(function() {
    loadPage();
    loadFolder("/home");
});