cmake_minimum_required(VERSION 3.12)
project(glastis)

set(CMAKE_CXX_STANDARD 14)

add_executable(glastis
        common/chests.lua
        common/crafting.lua
        common/energy.lua
        common/environement.lua
        common/inventory.lua
        common/movement.lua
        common/net.lua
        common/utilities.lua
        main.lua)
