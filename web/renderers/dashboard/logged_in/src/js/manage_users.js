function initUnbanTool() {
    $(".unban-user").unbind('click');
    $(".unban-user").tooltip();

    $(".unban-user").click(function() {
        user_id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Unban User");
        modalSetContent("Do you really want to unban this user?")
        modalAddConfirmButtons("Cancel", "Yes");
        modalSetConfirmCallback(function() {
            $.ajax({
                type: "POST",
                url: "/unban_user",
                data: $.param([
                    { name: "id", value: user_id},
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> User has been unbanned.')
                        $(".user_" + user_id + "_ban").html("Allowed");
                        that.unbind('click');
                        that.removeClass("far").removeClass("fa-check-circle").removeClass("unban-user");
                        that.addClass("fas").addClass("fa-ban").addClass("ban-user").attr("title", "Ban user").tooltip("_fixTitle");
                        initBanTool();
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

function initBanTool() {
    $(".ban-user").unbind('click');
    $(".ban-user").tooltip();

    $(".ban-user").click(function() {
        user_id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Ban User");
        modalSetContent("Do you really want to ban this user?")
        modalAddConfirmButtons("Cancel", "Yes");
        modalSetConfirmCallback(function() {
            $.ajax({
                type: "POST",
                url: "/ban_user",
                data: $.param([
                    { name: "id", value: user_id},
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> User has been banned.')
                        $(".user_" + user_id + "_ban").html("Banned");
                        that.unbind('click');
                        that.removeClass("fas").removeClass("fa-ban").removeClass("ban-user");
                        that.addClass("far").addClass("fa-check-circle").addClass("unban-user").attr("title", "Unban user").tooltip("_fixTitle");
                        initUnbanTool();
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

function initGroupTool() {
    $(".change-user-group").unbind('click');
    $(".change-user-group").tooltip();

    $(".change-user-group").click(function() {
        user_id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Change user group");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<form><select class="custom-select noAppearance" id="group_selector">' +
        '<option value="1">New Member</option>' +
        '<option value="2">Member</option>' +
        '<option value="3">Administrator</option>' +
        '<option value="4">Super Administrator</option>' +
        '</select></form>');
        modalSetConfirmCallback(function() {
            $.ajax({
                type: "POST",
                url: "/change_user_group",
                data: $.param([
                    { name: "id", value: user_id},
                    { name: "groupId", value: $("#group_selector").val()},
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> User group has been changed.')
                        $(".user_" + user_id + "_group").html(result.message);
                        that.unbind('click');
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
                    initGroupTool();
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

function initDeleteTool() {
    $(".delete-user").unbind('click');
    $(".delete-user").tooltip();

    $(".delete-user").click(function() {
        user_id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Delete user");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<i class="fas fa-exclamation-triangle text-warning"></i> Do you really want to delete this user? This action is irreversible.');
        modalSetConfirmCallback(function() {
            $.ajax({
                type: "POST",
                url: "/delete_user",
                data: $.param([
                    { name: "id", value: user_id},
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> User has been deleted.')
                        $(".user_" + user_id).remove();
                        that.unbind('click');
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
                    initDeleteTool();
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

function initScoreTool() {
    $(".change-user-score").unbind('click');
    $(".change-user-score").tooltip();

    $(".change-user-score").click(function() {
        user_id = $(this).attr("target");
        that = $(this);
        resetModal();
        modalSetTitle("Change user score");
        modalAddConfirmButtons("Cancel", "Confirm");
        modalSetContent('<form class="form-inline">' +
        '<select class="custom-select noAppearance mb-2 mr-sm-2" id="score_selector">' +
        '<option value="1">Add</option>' +
        '<option value="-1">Remove</option>' +
        '</select>' +
        '<div class="input-group mb-2 mr-sm-2">' +
        '<div class="input-group-prepend">' +
        '<div class="input-group-text"><i class="fas fa-trophy"></i></div>' +
        '</div>' +
        '<input type="number" class="form-control" value="0" id="score_input"/>' +
        '</div>' +
        '</form>');

        modalSetConfirmCallback(function() {
            var scoreValue = (parseInt($("#score_selector").val()) * parseInt($("#score_input").val()));
            $.ajax({
                type: "POST",
                url: "/change-user-score",
                data: $.param([
                    { name: "id", value: user_id},
                    { name: "score", value: scoreValue}
                ]),
                success: function(result)
                {
                    hideLoader();
                    resetModal();
                    if (result.result == "ok") {
                        modalSetContent('<i class="fas fa-check text-success"></i> User score has been changed.')
                        $(".user_" + user_id + "_score").html(scoreValue + parseInt($(".user_" + user_id + "_score").html()));
                        that.unbind('click');
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
                    initScoreTool();
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

lastSearchVal = "";

function initSearch() {
    $(".users_search").off( "keyup" );
    $(".users_search").keyup(function() {
        if (lastSearchVal != $(this).val()) {
            $(".users_search").val($(this).val());
            loadPage();
        }
        lastSearchVal = $(this).val();
    })
}

function initTools() {
    initBanTool();
    initUnbanTool();
    initGroupTool();
    initDeleteTool();
    initScoreTool();
}

function generateAuthorizations(auth) {
    if (auth == null || typeof(auth) !== "string") {
        return ("None");
    }
    return (auth.split(",").map(d => `<b>${d}</b>`).join(', '));
}

function loadPage() {
    $(".table-loader").stop().fadeIn();
    $.ajax({
        type: "POST",
        url: "/manage_users",
        data: $.param([
            { name: "page", value: users_page },
            { name: "limit", value: users_limit },
            { name: "search", value: $(".users_search").val() },
        ]), // serializes the form's elements.
        success: function(result)
        {
            console.log(entries);
            entries = result.entries.length;
            totalEntries = result.total;
            $(".totalCount").html(totalEntries);
            tableEntries = "";
            for (i = 0; i < result.entries.length; i++) {
                tableEntries += "<tr class='user_" + result.entries[i].id + "'>";
                tableEntries += "<th scope='row'>" + result.entries[i].id + "</th>";
                tableEntries += "<td>" + result.entries[i].username + "</td>";
                tableEntries += "<td class='user_" + result.entries[i].id + "_group'><a href='#' onclick='alert(\"Group ID = " + result.entries[i].groupid + "\")'>" + result.entries[i].groupname + "</a></td>";
                tableEntries += "<td>" + generateAuthorizations(result.entries[i].auth) + "</td>";
                tableEntries += "<td class='user_" + result.entries[i].id + "_ban'>" + (result.entries[i].is_banned?"Banned":"Allowed") + "</td>";
                tableEntries += "<td class='user_" + result.entries[i].id + "_score'>" + result.entries[i].score + "</td>";
                tableEntries += "<td>" + result.entries[i].created_at + "</td>";
                tableEntries += "<td>" + result.entries[i].updated_at + "</td>";
                tableEntries += "<td  style='text-align: center;'>" +
                    "<i class='list-tool change-user-score fas fa-trophy' data-toggle='tooltip' title='Change user score' target='" + result.entries[i].id + "'></i>" +
                    "<i class='list-tool change-user-group fas fa-users-cog' data-toggle='tooltip' title='Change group' target='" + result.entries[i].id + "'></i>" +
                    "<i class='list-tool " + (result.entries[i].is_banned?"unban-user far fa-check-circle":"ban-user fas fa-ban") + "' data-toggle='tooltip' title='" + (result.entries[i].is_banned?"Unban User":"Ban User") + "' target='" + result.entries[i].id + "'></i>" +
                    "<i class='list-tool delete-user fas fa-trash' data-toggle='tooltip' title='Delete user' target='" + result.entries[i].id + "'></i>" +
                "</td>";
                tableEntries += "</tr>";
            }
            $("#users_table_body").html(tableEntries);

            initTools();

            if (users_page < 0)
                users_page = 0;
            if (users_page == 0)
                $(".prev").attr("disabled", true);
            else
                $(".prev").attr("disabled", false);
            if ((users_page + 1) * users_limit >= totalEntries)
                $(".next").attr("disabled", true);
            else
                $(".next").attr("disabled", false);
            $(".table-loader").stop().fadeOut();
        },
        error: function(err) {
        }
    });
}

$( document ).ready(function() {
    initSearch();
    users_limit = $( ".users_show option:selected" ).val();
    users_page = parseInt($(".users_page").val());
    $( ".users_show").val(users_limit);

    $(".prev").attr("disabled", true);

    $(".prev").click(function() {
        if (users_page <= 0)
            return;
        users_page -= 1;
        $(".users_page").val(users_page);
        loadPage();
    });

    $(".next").click(function() {
        if ((users_page + 1) * users_limit >= totalEntries)
            return;
        users_page += 1;
        $(".users_page").val(users_page);
        loadPage();
    });

    $(".users_page").keyup(function() {
        if (users_page != parseInt($(this).val())) {
            users_page = parseInt($(this).val());
            $(".users_page").val($(this).val());
            loadPage();
        }
    });

    $(".users_show").change(function() {
        users_limit = $(this).find('option:selected').val();
        $( ".users_show").val(users_limit);
        users_page = 0;
        loadPage();
    });

    if (users_page < 0)
    users_page = 0;
    if (users_page == 0)
        $(".prev").attr("disabled", true);
    else
        $(".prev").attr("disabled", false);
    if ((users_page + 1) * users_limit >= totalEntries)
        $(".next").attr("disabled", true);
    else
        $(".next").attr("disabled", false);


    loadPage();
});