--
-- User: Glastis
-- Date: 22-Apr-19
--

local net = require 'internet'
local os = require 'os'
local event = require 'event'
local connexion = require 'common.connexion'
local code = require 'codes'


function core()
    local sock
    local req

    sock = net.open('glastis.com', 8098)
    connexion.send(sock, '101 WAITING')
    while sock do
        req = connexion.rcv_req(sock)
        if not code.check(req[1], req[2], req[3]) then
            connexion.send(sock, '400 INVALID_REQUEST\r\n')
        else
            connexion.send(sock, code.exec(req[1], req[2], req[3]))
        end
    end
end

core()