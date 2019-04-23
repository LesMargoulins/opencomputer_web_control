local robot = require("robot")
local side = require("sides")

local ROBOT_SLEEP_BETWEEN_MOVE_TRY = 2
local ROBOT_SLEEP_BREAK_MOVE_TRY = 0.5

local movement = {}

--[[
----	purpose: Move robot forward.
----
----  	params: amount		optional,	number, amount of blocs robot must move
----			force		optional,	set to true if robot must break bloc if it don't success to move
----
--]]
local function forward(amount, force, func)
	local i

	i = amount
	if not amount then
		i = 1
	end
	while i > 0 do
		if robot.forward() then
			i = i - 1
			if func then
				func()
			end
		elseif force then
			robot.swing()
			if robot.forward() then
				i = i - 1
				if func then
					func()
				end
			else
				os.sleep(ROBOT_SLEEP_BREAK_MOVE_TRY)
			end
		else
			os.sleep(ROBOT_SLEEP_BETWEEN_MOVE_TRY)
			print("Can't forward.")
		end
	end
end
movement.forward = forward

--[[
----	purpose: Move robot up.
----
----  	params: amount		optional,	number, amount of blocs robot must move
----			force		optional,	set to true if robot must break bloc if it don't success to move
----
--]]
local function up(amount, force, func)
	if not amount then
		amount = 1
	end
	while amount > 0 do
		if robot.up() then
			amount = amount - 1
			if func then
				func()
			end
		elseif force then
			robot.swingUp()
			if robot.up() then
				amount = amount - 1
				if func then
					func()
				end
			else
				os.sleep(ROBOT_SLEEP_BREAK_MOVE_TRY)
			end
		else
			os.sleep(ROBOT_SLEEP_BETWEEN_MOVE_TRY)
			print("Can't go up.")
		end
	end
end
movement.up = up

--[[
----	purpose: Move robot down.
----
----  	params: amount		optional,	number, amount of blocs robot must move
----			force		optional,	set to true if robot must break bloc if it don't success to move
----
--]]
local function down(amount, force, func)
	if not amount then
		amount = 1
	end
	while amount > 0 do
		if robot.down() then
			amount = amount - 1
			if func then
				func()
			end
		elseif force then
			robot.swingDown()
			if robot.down() then
				amount = amount - 1
				if func then
					func()
				end
			else
				os.sleep(ROBOT_SLEEP_BREAK_MOVE_TRY)
			end
		else
			os.sleep(ROBOT_SLEEP_BETWEEN_MOVE_TRY)
			print("Can't go down.")
		end
	end
end
movement.down = down

local function move_orientation(orientation)
	if orientation == side.left then
		robot.turnLeft()
	elseif orientation == side.right then
		robot.turnRight()
	elseif orientation == side.back then
		robot.turnRight()
		robot.turnRight()
	end
end
movement.move_orientation = move_orientation

local function move_orientation_revert(orientation)
	if orientation == side.left then
		robot.turnRight()
	elseif orientation == side.right then
		robot.turnLeft()
	elseif orientation == side.back then
		robot.turnLeft()
		robot.turnLeft()
	end
end
movement.move_orientation_revert = move_orientation_revert

local function get_orientation_revert(orientation)
	if orientation == side.left then
		return side.right
	elseif orientation == side.right then
		return side.left
	elseif orientation == side.back then
		return side.front
	elseif orientation == side.front then
		return side.back
	elseif orientation == side.up then
		return side.down
	elseif orientation == side.down then
		return side.up
	end
	return nil
end
movement.get_orientation_revert = get_orientation_revert

local function move(amount, orientation, force, func)
	if orientation then
		if orientation == side.up then
			up(amount, force, func)
		elseif orientation == side.down then
			down(amount, force, func)
		else
			move_orientation(orientation)
			forward(amount, force, func)
			move_orientation_revert(orientation)
		end
	else
		forward(amount, force, func)
	end
end
movement.move = move

local function turn_bool(bool)
	if bool then
		robot.turnLeft()
	else
		robot.turnRight()
	end
end
movement.turn_bool = turn_bool

local function turn_left()
	robot.turnLeft()
end
movement.turn_left = turn_left

local function turn_right()
	robot.turnRight()
end
movement.turn_left = turn_right

local function turn_back()
	robot.turnRight()
	robot.turnRight()
end
movement.turn_back = turn_back

return movement