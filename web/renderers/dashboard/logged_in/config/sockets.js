module.exports = function() {
    var soSeparator = ";";

    this.computers = {

    };

    this.soGetComputer = function(id) {
        for (var property in computers) {
            if (computers.hasOwnProperty(property) && computers[property].socket.id > 0) {
                return computers[property].socket;
            }
        }
        return (false);
    }

    this.soAddComputer = function(socket) {
        socket.identity = socket.remoteAddress + ":" + socket.remotePort;
        socket.name = "Unknown@" + socket.remoteAddress;
        console.log('Computer ' + socket.name + ' connected');

        //Check bdd

        if (!socket.destroyed) {
            socket.id = -1;
            computers[socket.identity] = {
                socket: socket,
                connected: false,
            };
        }
    }

    this.soRemoveComputer = async function(socket) {
        if (Object.keys(computers).indexOf(socket.identity) > -1) {
            console.log('Computer ' + socket.name + ' disconnected');
            soSetStatus(socket, 5);
            delete computers[socket.identity];
        }
    }

    this.soSend = function(socket, code, msg = "") {
        if (msg != "")
            msg = " " + msg;
        socket.write(code + msg + '\r\n');
    }

    this.soEnd = function(socket, code, msg = "") {
        if (msg != "")
            msg = " " + msg;
        socket.end(code + msg + '\r\n');
    }

    this.soSetStatus = async function(socket, status) {
        if (socket.id > 0) {
            var userid = await safeQuery("SELECT user_id FROM computers WHERE id = ?", [socket.id]);
            if (userid.length > 0) {
                for (var property in clients) {
                    if (clients.hasOwnProperty(property) && clients[property].socket.handshake.session.uid == userid[0].user_id) {
                        clients[property].socket.emit("status_changed", {status: status, id: socket.id})
                    }
                }
            }

            await safeQuery("UPDATE computers SET status = ? WHERE id = ?", [status, socket.id]);
        }
    }

    this.soSendDirectory = async function(socket, data) {
        var userid = await safeQuery("SELECT user_id FROM computers WHERE id = ?", [socket.id]);
        if (userid.length <= 0) {
            return;
        }
        for (var property in clients) {
            if (clients.hasOwnProperty(property) && clients[property].socket.handshake.session.uid == userid[0].user_id) {
                clients[property].socket.emit("show_dir", {id: socket.id, data: data})
            }
        }
    }

    this.soRegisterComputer = async function(socket, args) {
        if (args.length == 0)
            soSend(socket, 500);
        else {
            arg = args[0];
            if (arg.length != 36) {
                soSend(socket, 501, "Invalid length");
                return;
            }
            var regexp = /^[0-9a-fA-F]+$/;
            for (var i = 0; i < arg.length; i++) {
                if ((i == 8 || i == 13 || i == 18 || i == 23)) {
                    if (arg[i] != "-") {
                        soSend(socket, 501, "Invalid format");
                        return;
                    }
                }
                else if (!(regexp.test(arg[i]))) {
                    soSend(socket, 501, "Invalid format");
                    return;
                }
            }
            socket.name = arg + "@" + socket.remoteAddress;
            computers[socket.identity].connected = true;
            var isInBdd = await safeQuery("SELECT id, name FROM computers WHERE server_ip = ? AND computer_id = ?", [socket.remoteAddress, arg]);
            var name = "New Computer";
            if (isInBdd.length <= 0) {
                console.log('New computer identified as ' + socket.name);
                var request = await safeQuery("INSERT INTO computers (server_ip, computer_id, name, status) VALUES (?, ?, ?, ?)", [socket.remoteAddress, arg, name, 2]);
                socket.id = request.insertId;
            }
            else {
                console.log('Computer identified as ' + socket.name);
                name = isInBdd[0].name;
                socket.id = isInBdd[0].id;
                soSetStatus(socket, 2);
            }
            soSend(socket, 200, name);
        }
    }


    this.tcpserver = net.createServer(function(socket) {
        soSend(socket, 100);
        soAddComputer(socket);

        //socket.pipe(socket);

        //just added
        socket.on("error", function (err) {
            console.log("Socket error: ");
            console.log(err.stack);
        });

        socket.on('data', function (data) {
            //broadcast(socket.name + "> " + data, socket);
            data = data.toString('utf8');
            if (data.length < 3) {
                soEnd(socket, 400);
                return;
            }
            code = data.substr(0, 3);
            if (!isNormalInteger(code)) {
                soEnd(socket, 400);
                return;
            }

            if (data.length > 4) {
                data = data.substr(4);
                data = data.replace('\r','');
                data = data.replace('\n','');
                data = data.split(soSeparator);

                for (i = 0; i < data.length; i++) {
                    if (data[i][data[i].length - 1] == "\\" && i + 1 < data.length) {
                        data[i] = data[i].substr(0, data[i].length - 1) + soSeparator;
                        data[i] = data[i] + data[i + 1];
                        for (j = i + 1; j < data.length - 1; j++) {
                            data[j] = data[j + 1];
                        }
                        data.pop();
                    }
                }
            }
            else {
                data = [];
            }

            if (code == 100) {
                soRegisterComputer(socket, data);
            }
            if (code == 110) {
                soSendDirectory(socket, data);
            }

        });
        socket.on('end', () => {
            soRemoveComputer(socket);
        });

    });

    var ocPort = 8098;

    tcpserver.listen(ocPort, config.ip, () => {
        debug.logSuccess('TCP Socket listening on port ' + ocPort, "SUCCESS", true);
    });
}