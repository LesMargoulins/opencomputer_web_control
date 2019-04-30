--
-- User: Glastis
-- Date: 25-Apr-19
--

local con = require 'common.connexion'
local system = require 'requests.system'
local utilitie = require 'common.utilities'

local codes
codes = {}

local struct
struct = {}
struct.func = 1
struct.rcv_msg = 2
struct.rcv_args = 3
struct.snd_code = 4

local list
list = {}
list[100] = {}
list[100][struct.func] = system.get_id
list[100][struct.rcv_msg] = false
list[100][struct.rcv_args] = false

local function check(code, message, args)
    return  list[code] and
            ((not message and not list[code][struct.msg]) or (message and list[code][struct.msg])) and
            ((not args and not list[code][struct.args]) or (args and list[code][struct.args]))
end
codes.check = check

local function exec(code, message, args)
    return list[code][struct.func](code, message, args)
end
codes.exec = exec

return codes

