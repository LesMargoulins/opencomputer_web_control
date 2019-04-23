local robot = require("robot")
local component = require("component")

local inventory = {}

local function get_inventory_map()
	local map = {}
	local size
	local slot
	local data

	slot = 1
	size = robot.inventorySize()
	while slot <= size do
		data = component.inventory_controller.getStackInInternalSlot(slot)
		if not data then
			map[#map + 1] = false
		else
			map[#map + 1] = data
		end
		slot = slot + 1
	end
	return map
end
inventory.get_inventory_map = get_inventory_map

local function select_item(item, meta)
	local slot
	local size
	local data

	slot = 1
	size = robot.inventorySize()
	while slot <= size do
		data = component.inventory_controller.getStackInInternalSlot(slot)
		if data and data.name == item and (not meta or data.damage == meta) then
			robot.select(slot)
			return true
		end
		slot = slot + 1
	end
	return false
end
inventory.select_item = select_item

local function select_fuel()
	local slot
	local size
	local data

	slot = 1
	size = robot.inventorySize()
	while slot <= size do
		data = component.inventory_controller.getStackInInternalSlot(slot)
		if data and (data.name == 'minecraft:coal' or
				(data.name == 'tc:oreTC' and data.damage == 2)) then
			robot.select(slot)
			return true
		end
		slot = slot + 1
	end
	return false
end
inventory.select_fuel = select_fuel

local function select_item_failsafe(item, trymax, meta, sleeptime)
	local try = 0

	if not sleeptime then
		sleeptime = 30
	end
	while not select_item(item, meta) do
		if meta then
			print("Can't select " .. item .. " with meta: " .. meta .. "\nWaiting 30 secs before retrying.")
		else
			print("Can't select " .. item .. "\nWaiting 30 secs before retrying.")
		end
		try = try + 1
		if try > trymax then
			computer.shutdown()
		end
		os.sleep(sleeptime)
	end
end
inventory.select_item_failsafe = select_item_failsafe

local function equip(item, meta)
	local success

	success = true
	if item then
		success = select_item(item, meta)
	end
	if success then
		return component.inventory_controller.equip()
	end
	return success
end
inventory.equip = equip

local function select_next_item(slot, item, meta)
	local data
	local size

	size = robot.inventorySize()
	while slot <= size do
		data = component.inventory_controller.getStackInInternalSlot(slot)

		if data and data.name == item and (not meta or meta == data.damage) then
			robot.select(slot)
			return true
		end
		slot = slot + 1
	end
	return false
end
inventory.select_next_item = select_next_item

local function repack_item(item, meta)
	local slot = 1
	local data

	if item == "minecraft:stone_pickaxe" or item == "minecraft:diamond_pickaxe" then
		return true
	end
	while slot < robot.inventorySize() do
		data = component.inventory_controller.getStackInInternalSlot(slot)
		if not data or ((data.name == item and data.size < 64) and (not meta or meta == data.damage)) then
			if select_next_item(slot + 1, item, meta) then
				robot.transferTo(slot)
				data = component.inventory_controller.getStackInInternalSlot(slot)
			else
				return true
			end
		else
			slot = slot + 1
		end
	end
	return true
end
inventory.repack_item = repack_item

local function push_item_after_slot(from, craft_mode, min_slot)
	local slot
	local data
	local tmp

	slot = from + 1
	if min_slot and min_slot > from + 1 then
		slot = min_slot
	end
	data = component.inventory_controller.getStackInInternalSlot(from)
	robot.select(from)
	while slot < robot.inventorySize() do
		while craft_mode and ((slot >= 1 and slot <= 3) or (slot >= 5 and slot <= 7) or (slot >= 9 and slot <= 11)) do
			slot = slot + 1
		end
		tmp = component.inventory_controller.getStackInInternalSlot(slot)

		if not tmp or (tmp.name == data.name and tmp.damage == data.damage and tmp.size < tmp.maxSize) then
			break
		end
		slot = slot + 1
	end
	if slot < robot.inventorySize() and robot.transferTo(slot) then
		tmp = component.inventory_controller.getStackInInternalSlot(from)

		if tmp then
			return push_item_after_slot(from, craft_mode)
		else
			return slot
		end
	end
	return false
end
inventory.push_item_after_slot = push_item_after_slot

local function free_slots_amount()
	local slot
	local empty_slots
	local size

	slot = 1
	empty_slots = 0
	size = robot.inventorySize()
	while slot <= size do
		if not component.inventory_controller.getStackInInternalSlot(slot) then
			empty_slots = empty_slots + 1
		end
		slot = slot + 1
	end
	return empty_slots
end
inventory.free_slots_amount = free_slots_amount

local function select_empty_slot()
	local slot
	local size

	size = robot.inventorySize()
	slot = 1
	while slot <= size do
		if not component.inventory_controller.getStackInInternalSlot(slot) then
			robot.select(slot)
			return slot
		end
		slot = slot + 1
	end
	return false
end
inventory.select_empty_slot = select_empty_slot

local function unequip()
	if not inventory.select_empty_slot() then
		return false
	end
	component.inventory_controller.equip()
	return true
end
inventory.unequip = unequip

local function select_item_out_of_workbench(item, meta)
	local slot
	local data
	local size

	slot = 4
	size = robot.inventorySize()
	while slot <= size do
		if slot == 5 or slot == 9 then
			slot = slot + 3
		end
		data = component.inventory_controller.getStackInInternalSlot(slot)

		if data and data.name == item and (not meta or data.damage == meta) then
			robot.select(slot)
			return true
		end
		slot = slot + 1
	end
	return false
end
inventory.select_item_out_of_workbench = select_item_out_of_workbench

local function item_amount(item, meta, inventory_map)
	local data
	local slot
	local size
	local amount

	slot = 1
	if inventory_map then
		size = #inventory_map
	else
		size = robot.inventorySize()
	end
	amount = 0
	while slot <= size do
		if inventory_map then
			data = inventory_map[slot]
		else
			data = component.inventory_controller.getStackInInternalSlot(slot)
		end
		if data and data.name == item and (not meta or data.damage == meta) then
			amount = amount + data.size
		end
		slot = slot + 1
	end
	return amount
end
inventory.item_amount = item_amount

--[[
----	purpose: Tell if there is at least one empty slot in robot (regardless of unfilled stacks).
----
----	return: true		robot have no empty slot
----			false		robot have at least one empty slot
--]]
local function is_full()
	local slot
	local data

	slot = robot.inventorySize()
	while slot > 0 do
		data = component.inventory_controller.getStackInInternalSlot(slot)

		if not data then
			return false
		end
		slot = slot - 1
	end
	return true
end
inventory.is_full = is_full

--[[
----	purpose: Tell if there is at least one occupied slot in robot.
----
----	return: true		robot have no empty slot
----			false		robot have at least one empty slot
--]]
local function is_empty()
	local slot
	local data

	slot = robot.inventorySize()
	while slot > 0 do
		data = component.inventory_controller.getStackInInternalSlot(slot)

		if data then
			return false
		end
		slot = slot - 1
	end
	return true
end
inventory.is_empty = is_empty

local function get_size()
	return robot.inventorySize()
end
inventory.get_size = get_size

return inventory