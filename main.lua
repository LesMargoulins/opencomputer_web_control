--
-- User: Glastis
-- Date: 22-Apr-19
--

local net = require 'internet'
local connexion = require 'common.connexion'

local con = net.open('glastis.com', 6564)

--while con do
    connexion.send(con, 'here is a test captain', 'arg1', 'arg2', 132)
    print("sent")
--    os.sleep(4)
--end