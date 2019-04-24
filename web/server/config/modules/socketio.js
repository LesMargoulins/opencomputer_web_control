module.exports = function() {
    debug.detail(" - Socket.io");

    this.io = require('socket.io')(server);
    this.sharedsession = require("express-socket.io-session");

    io.use(sharedsession(session), {
        autoSave: true
    });

    var clients = [];

    function addClient(socket) {
        if (socket.handshake.session.username) {
            console.log("Connection: User " + socket.handshake.session.username);
            clients.push(socket);
        }
    }

    function removeClient(socket) {
        if (clients.indexOf(socket) > -1) {
            console.log("User " + socket.handshake.session.username + " quit");
            clients.splice(clients.indexOf(socket), 1);
        }
    }

    io.on('connection', function (socket) {
        addClient(socket);

        socket.on('message', function (message) {
          //Sends message to all connected sockets
          socket.broadcast.emit("message");
        });

        socket.on('disconnect', function () {
            removeClient(socket);
        });
    });

    this.net = require('net');

    var computers = [];

    function addComputer(socket) {
        socket.name = socket.remoteAddress + ":" + socket.remotePort 

        console.log('Computer ' + socket.name + ' connected');

        computers.push(socket);
    }

    function removeComputer(socket) {
        console.log('Computer ' + socket.name + ' disconnected');
        computers.splice(computers.indexOf(socket), 1);
    }


    this.tcpserver = net.createServer(function(socket) {

        socket.write('Hello Computer\r\n');

        addComputer(socket);

        //socket.pipe(socket);

        socket.on('data', function (data) {
            //broadcast(socket.name + "> " + data, socket);
            console.log('Computer ' + socket.name + " sent: " + data.toString('utf8'));

        });
        socket.on('end', () => {
            removeComputer(socket);
        });

    });

    tcpserver.listen(1337, '127.0.0.1');
}

//nc -zv hostname port