# ventilation-flow-tuning
Tuning of flow rate in a ventilation network - interactive example

The purpose of this tool is to "simulate" the tuning process of a ventilation network and to show how the modification of one vent changes the flow rate at the other vents. 

## Network definition and initialization
The network pressure drops are initialized using initial flow rates. The total initial flow rates has to be defined, and will always corresponds to a fan speed of 50%. 
There are 3 different options to initialize the pressure drops:
* Random initial flows
* Uniform initial flows (same flow in each branch)
* User defined initial flows. In this case, the user can freely define the initial flow rate at each vent and the global flow is automatically set to the sum of the user defined flows

Based on this flow rate, pressure loss coefficients are computed for each branch. 

## Target flows
The target flows are the flows that have to be reached after tuning. There are two options to define them:
* uniform: the target flows are all identical and equal to the total initial flow rate divided by the number of vents
* user defined: the user can freely define the target flow rates for each branch of the network

## Tuning of the network
The network can be tuning by changing the opening of the vents and/or the fan speed. 

There is a realistic physical model for the vents using a real pressure/flow relationship. This means that the behavior is non linear, like for a real vent. 

There is currently no true fan model. The total flow rate is proportional to the fan stand. It is thus totally linear. The 50% mark always corresponds to the total flow rate used to initialize the network. 

If the total initial flow rate and the sum of the target flow rates are equal, there is obviously no need to change the fan speed. It is only usefull to change the fan speed if both totals are not identical (which can only happen if target flow rates are user defined). 

The tuning of the network is considered sucessfull if the difference between the target and actual flow rates is less than 2 m³/h for each branch. 

