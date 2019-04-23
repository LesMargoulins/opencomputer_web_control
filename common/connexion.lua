--
-- User: Glastis
-- Date: 23-Apr-19
--

local utilities = require 'common.utilities'

local connexion
connexion = {}

local endl
endl = '\r\n'

local function send(con, code, ...)
    local str

    str = utilities.args_to_string(code, ...) .. endl
    con:write(str);
end
connexion.send = send

return connexion