local component = require('component')
local side = require('sides')
local robot = require('robot')

local inventory = require('inventory')
local move = require('movement')

local environement = {}

local function get_bloc(direction, full_info)
    if not direction then
        direction = side.front
    end
    if full_info then
        return component.geolyzer.analyze(direction)
    end
    return component.geolyzer.analyze(direction).name
end
environement.get_bloc = get_bloc

local function get_bloc_meta(direction)
    if not direction then
        direction = side.front
    end
    return component.geolyzer.analyze(direction).metadata
end
environement.get_bloc_meta = get_bloc_meta

--[[
----	purpose: Use current equiped item to a side
----
----  	params: use_side optional,  side where is used compared to the robot, number. eg 'side.left'. Default is 'side.front'
--]]
local function use(use_side)
    if not use_side then
        use_side = side.front
    end
    if use_side == side.up then
        robot.useUp()
    elseif use_side == side.down then
        robot.useDown()
    else
        move.move_orientation(use_side)
        robot.use()
        move.move_orientation_revert(use_side)
    end
end
environement.use = use

--[[
----	purpose: Use an item to a side
----
----  	params: item, 		requiered, 	name of item that must be suck, string. eg: 'minecraft:dirt'
----            meta, 		optional, 	metadata of the item, number. If no metadata provided then all are matching.
----            use_side    optional,   side where is used compared to the robot, number. eg 'side.left'. Default is 'side.front'
----            equip       optional,   search and equip matching item
----            unequip     optional,   unequip equiped item to an empty slot (if possible)
----
----	return: true
----			false		if item was not found in robot inventory.
--]]
local function use_item(item, meta, use_side, equip, unequip)
    if equip and (not inventory.select_item(item, meta) or not component.inventory_controller.equip()) then
        return false
    end
    use(use_side)
    if unequip and inventory.select_empty_slot() then
        component.inventory_controller.equip()
    end
    return true
end
environement.use_item = use_item

--[[
----	purpose: Fill a bucket with liquid
----
----  	params: liquid_side optional,  where is the liquid compared to the robot, number. eg 'side.left'. Default is 'side.front'
----            equip       optional,   search and equip an empty bucket
----            unequip     optional,   unequip equiped bucket to an empty slot (if possible)
----
----	return: true
----			false		if no empty bucket was found in robot inventory.
--]]
local function fill_bucket(liquid_side, equip, unequip)
    return use_item('minecraft:bucket', 0, liquid_side, equip, unequip)
end
environement.fill_bucket = fill_bucket

return environement