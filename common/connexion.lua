--
-- User: Glastis
-- Date: 23-Apr-19
--

local utilities = require 'common.utilities'

local connexion
connexion = {}

local endl = '\r\n'
connexion.endl = endl

local separator = ' '
connexion.separator = separator

local function send(sock, code, command, arg, debug)
    local str

    str = utilities.args_to_string(separator, code, command, arg) .. endl
    if debug then
        print('sending: ' .. str)
    end
    sock:write(str);
end
connexion.send = send

local function rcv(sock)
    return sock:read()
end
connexion.rcv = rcv

local function rcv_req(sock)
    local req
    local str

    str = tostring(rcv(sock))
    req = utilities.split(str, separator)
    if #req > 3 then
        return { req[1], req[2], req[3] }
    end
    req[1] = tonumber(req[1])
    return req
end
connexion.rcv_req = rcv_req

return connexion