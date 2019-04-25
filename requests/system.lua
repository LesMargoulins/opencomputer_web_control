--
-- User: Glastis
-- Date: 25-Apr-19
--

local computer = require 'computer'
local system
system = {}

local function get_id(code)
    return code, 'ID', computer.address()
end
system.get_id = get_id

return system

