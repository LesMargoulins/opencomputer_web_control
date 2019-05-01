module.exports = function() {
    this.clients = {};

    this.sioAddClient = function(socket) {
        if (socket.handshake.session.username) {
            console.log("Connection: User " + socket.handshake.session.username);
            clients[socket.id] = {
                socket: socket
            };
        }
    }

    this.sioRemoveClient = function(socket) {
        if (socket.handshake.session.username) {
            if (Object.keys(clients).indexOf(socket.id) > -1) {
                console.log("User " + socket.handshake.session.username + " quit");
                delete clients[socket.id];
            }
        }
    }

    this.sioDisconnectServer = function() {
        if (clients.length > 0) {
            io.sockets.emit("disconnect");
        }
    }

    io.on('connection', function (socket) {
        sioAddClient(socket);

        if (!socket.handshake.session.username)
            return;

        socket.on('show_dir', async function (data) {
            var computer_id = data.computer_id;
            var computer_socket = soGetComputer(computer_id);
            if (computer_socket == false) {
                socket.emit("computer_offline")
                return;
            }
            var userid = await safeQuery("SELECT user_id FROM computers WHERE id = ?", [computer_socket.id]);
            if (userid.length <= 0 || userid[0].user_id != socket.handshake.session.uid) {
                socket.emit("computer_forbidden");
                return;
            }
            soSend(computer_socket, 110, data.dir);
        });

        socket.on('get_file', async function (data) {
            var computer_id = data.computer_id;
            var computer_socket = soGetComputer(computer_id);
            if (computer_socket == false) {
                socket.emit("computer_offline")
                return;
            }
            var userid = await safeQuery("SELECT user_id FROM computers WHERE id = ?", [computer_socket.id]);
            if (userid.length <= 0 || userid[0].user_id != socket.handshake.session.uid) {
                socket.emit("computer_forbidden");
                return;
            }
            soSend(computer_socket, 111, data.file);
        });

        socket.on('save_file', async function (data) {
            var computer_id = data.computer_id;
            var computer_socket = soGetComputer(computer_id);
            if (computer_socket == false) {
                socket.emit("computer_offline")
                return;
            }
            var userid = await safeQuery("SELECT user_id FROM computers WHERE id = ?", [computer_socket.id]);
            if (userid.length <= 0 || userid[0].user_id != socket.handshake.session.uid) {
                socket.emit("computer_forbidden");
                return;
            }

            soSend(computer_socket, 112, data.path + ";" + data.file.length + ";" + data.file);
        });

        socket.on('disconnect', function () {
            sioRemoveClient(socket);
        });
    });
}