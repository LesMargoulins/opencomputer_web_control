local internet = require('internet')
local net = {}

local function get_page_to_file(url, filepath)
    local file
    local conn
    local tmp = {}

    tmp['headers'] = {}
    tmp['headers']['Pragma'] = 'no-cache'
    tmp['headers']['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    tmp['headers']['Expires'] = '0'
    file = io.open(filepath, 'w')
    if not file then
        return false
    end
    conn = internet.request(url, tmp, tmp['headers'])
    if not conn then
        file:close()
        return false
    end
    for char in conn do
        file:write(char)
    end
    file:close()
    return true
end
net.get_page_to_file = get_page_to_file

return net