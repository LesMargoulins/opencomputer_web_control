local utilities = {}

local function xor_bool(bool)
	return not bool
end
utilities.xor_bool = xor_bool

local function file_exists(filepath)
	local f

	f = io.open(filepath,"r")
	if f then
		io.close(f)
		return true
	end
	return false
end
utilities.file_exists = file_exists

local function download_file(id, filepath, force)
	if force then
		os.execute('pastebin -f get ' .. id .. ' ' .. filepath)
	else
		os.execute('pastebin get ' .. id .. ' ' .. filepath)
	end
end
utilities.download_file = download_file

local function check_dependencie(id, filepath)
	if not file_exists(filepath) then
		download_file(id, filepath)
		return false
	end
	return true
end
utilities.check_dependencie = check_dependencie

local function is_elem_in_list(list, elem)
	local i

	i = 1
	while i <= #list do
		if list[i] == elem then
			return i
		end
		i = i + 1
	end
	return false
end
utilities.is_elem_in_list = is_elem_in_list

local function concatenate_arrays(t1, t2)
	local i

	i = 1
	while i <= #t2 do
		t1[#t1 + 1] = t2[i]
		i = i + 1
	end
	return t1
end
utilities.concatenate_arrays = concatenate_arrays

local function file_exists(filepath)
	local f

	f = io.open(filepath, "rb")
	if f then
		f:close()
	end
	return f ~= nil
end
utilities.file_exists = file_exists

local function read_file(filepath)
	local f
	local str

	f = io.open(filepath, 'rb')
	str = f:read('*all')
	f:close()
	return str
end
utilities.read_file = read_file

local function write_to_file(filepath, str, mode)
	local f

	if not mode then
		mode = "a"
	end
	f = io.open(filepath, mode)
	f:write(str)
	f:close()
end
utilities.write_to_file = write_to_file

local function split(str, separator)
	local t = {}
	local i

	i = 1
	for line in string.gmatch(str, "([^" .. separator .. "]+)") do
		t[i] = line
		i = i + 1
	end
	return t
end
utilities.split = split

local function exec_function_table(actions, param)
	local i

	i = 1
	if not param then
		param = {}
	end
	while i <= #actions do
		actions[i](param[i])
		i = i + 1
	end
end
utilities.exec_function_table = exec_function_table

local function exec_function_table_revert(actions, param)
	local i

	i = #actions
	if not param then
		param = {}
	end
	while i > 0 do
		actions[i](param[i])
		i = i - 1
	end
end
utilities.exec_function_table_revert = exec_function_table_revert

local function debug_info(more, calltrace)
	if not more then
		more = " "
	end
	if calltrace then
		local trace

		trace = split(split(debug.traceback(), '\n')[3], '/')
		write_to_file("trace.log", '\n' .. trace[#trace] .. '\n' .. more .. '\n')
	else
		write_to_file("trace.log", more .. '\n')
	end
end
utilities.debug_info = debug_info

local function var_dump(var)
	if type(var) == 'table' then
		local s

		s = '{ '
		for k,v in pairs(var) do
			if type(k) ~= 'number' then
				k = '"' .. k .. '"'
			end
			s = s .. '\n[' .. k .. '] = ' .. var_dump(v) .. ','
		end
		return s .. '\n} '
	end
	return tostring(var)
end
utilities.var_dump = var_dump

local function round(number, decimals, ext_abs)
	if ext_abs then
		ext_abs = math.floor
	else
		ext_abs = math.ceil
	end
	if not decimals then
		return ext_abs(number)
	end
	decimals = 10 ^ decimals
	return ext_abs(number * decimals) / decimals
end
utilities.round = round

local function args_to_string(separator, ...)
	local args
	local i
	local ret

	ret = ""
	i = 1
	args = {...}
	while args[i] do
		ret = ret .. tostring(args[i])
		i = i + 1
	end
	return ret
end
utilities.args_to_string = args_to_string

return utilities