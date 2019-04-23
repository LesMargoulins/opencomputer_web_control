local computer = require('computer')

local ENERGY_CHARGING_CHECK_SLEEP = 10
local ERROR_TOLERANCE = 1000
local energy = {}

local function wait_charging(func)
    while computer.energy() < computer.maxEnergy() - ERROR_TOLERANCE do
        if func then
            func()
        end
        os.sleep(ENERGY_CHARGING_CHECK_SLEEP)
    end
end
energy.wait_charging = wait_charging

local function get_max_energy()
    return computer.maxEnergy()
end
energy.get_max_energy = get_max_energy

local function get_level()
    return computer.energy()
end
energy.get_level = get_level

return energy