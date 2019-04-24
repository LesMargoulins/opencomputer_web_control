var modal;

var modalConfirmCallback = function() {}
var modalCancelCallback = function() {}

function reinitRemodal() {
    modal = $('[data-remodal-id=modal]').remodal();
    $(document).off('closed', '.remodal');
    $(document).on('closed', '.remodal', function (e) {
        if (e.reason) {
            if (e.reason == "confirmation")
                modalConfirmCallback();
            else if (e.reason == "cancellation")
                modalCancelCallback();
        }
    });
}

function resetModal() {
    modalSetTitle("");
    $("#remodal-content").html("");
    $("#remodal-buttons").html('');
    modalResetCallbacks();
    reinitRemodal()
}

function modalAddConfirmButtons(cancel = "Cancel", confirm = "OK") {
    $("#remodal-buttons").html('<br>' +
    '<button data-remodal-action="cancel" class="remodal-cancel">' + cancel + '</button>' +
    '<button data-remodal-action="confirm" class="remodal-confirm">' + confirm + '</button>');
    reinitRemodal();
}

function modalRemoveConfirmButtons() {
    $("#remodal-buttons").html('');
    reinitRemodal();
}

function modalSetTitle(title) {
    $("#remodal-title").html(title);
    reinitRemodal();
}

function modalSetContent(content) {
    $("#remodal-content").html(content);
    reinitRemodal();
}

function modalSetConfirmCallback(endCallback = modalConfirmCallback, callback = () => {}) {
    $(document).off('confirmation', '.remodal');
    $(document).on('confirmation', '.remodal', callback);
    modalConfirmCallback = endCallback;
}

function modalSetCancelCallback(endCallback = modalCancelCallback, callback = () => {}) {
    $(document).off('cancellation', '.remodal');
    $(document).on('cancellation', '.remodal', callback);
    modalCancelCallback = endCallback;
}

function modalResetCallbacks() {
    modalConfirmCallback = function() {};
    modalCancelCallback = function() {};
    $(document).off('cancellation', '.remodal');
    $(document).off('confirmation', '.remodal');
}

$( document ).ready(function() {
    reinitRemodal();
});