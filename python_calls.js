async function loadPythonClasses(){
	let pyodide = await initPyodide;
	await pyodide.loadPackage("numpy");

	pyodide.runPython(await (await fetch('https://raw.githubusercontent.com/sebbypy/ventilation-flow-tuning/main/ventilationNetwork.py')).text());
}

async function initNetwork(n,initType="uniform"){
	let pyodide = await initPyodide;
	await pyodide.loadPackage("numpy");
	await loadPythonClasses();
		
        
	window.nvents = n;
    window.initType = initType;
    window.totalFlow = parseInt(document.getElementById("totalflow").value)

    window.values = getInitValues()

    console.log(window.values)
		
	pyodide.runPython(`

import numpy as np
from js import nvents
from js import initType
from js import totalFlow
from js import values

array = list(values)

n = network(nvents,initFlow=totalFlow,initType=initType,initValues=array)    

`);

update(n);

}




async function update(n){

window.nVents = n;
test =[];

for (let i=0; i<n ; i++){
	test.push(document.getElementById("flow"+(i+1)+"input").value);
}

window.stands = test;

let pyodide = await initPyodide;
/*pyodide.toPy(v1);*/

pyodide.runPython(`

from js import stands
from js import nvents

stands = stands.to_py()

for i in range(nvents):
	n.setVentPosition(i, float(stands[i]))    
	
n.update()
flows = n.getFlows()
dp = n.getPressureDrop()
`
);

jsFlows = pyodide.globals.get("flows").toJs();
pressureDrop = pyodide.globals.get("dp").toFixed(0);
updateCurrentFlowRateDisplay(jsFlows,pressureDrop,stands);

showHideSuccessFlag(jsFlows);

}



async function updateInitialConditionDisplay(){

    let pyodide = await initPyodide;

    pyodide.runPython(`

flows = n.getFlows()
`
);


    jsFlows = pyodide.globals.get("flows").toJs();
    console.log(jsFlows)

    for (let i=0;i<jsFlows.length;i++){
        document.getElementById("initialinput"+i).value =jsFlows[i].toFixed(0)
    }
}


async function changeActualFlow(flowValue){

    let pyodide = await initPyodide;

    window.newFlowValue = flowValue;

    pyodide.runPython(`

from js import newFlowValue
n.changeTotalFlowRate(newFlowValue)
flows = n.getFlows()
dp = n.getPressureDrop()
`
);

    jsFlows = pyodide.globals.get("flows").toJs();
    pressureDrop = pyodide.globals.get("dp").toFixed(0);
    updateCurrentFlowRateDisplay(jsFlows,pressureDrop,stands);

    //adjustTarget()
    //changeInitialCondition()
    //fillInitialFlowRates()
    
    updateFanFlowDisplay()
    
}


async function changeInitFlow(flowValue){

    

    let pyodide = await initPyodide;

    window.newFlowValue = flowValue;

    pyodide.runPython(`

from js import newFlowValue
n.changeTotalFlowRate(newFlowValue)
flows = n.getFlows()
dp = n.getPressureDrop()
`
);

    jsFlows = pyodide.globals.get("flows").toJs();

    console.log(jsFlows)
    jsFlows = pyodide.globals.get("flows").toJs();


    pressureDrop = pyodide.globals.get("dp").toFixed(0);
    updateCurrentFlowRateDisplay(jsFlows,pressureDrop,stands);

    //changeInitialCondition()
    //cleanInitialFlowRates()
    //fillInitialFlowRates()
    updateInitialConditionDisplay()
    updateFanFlowDisplay()
    
    
    adjustTarget() //only if target is uniform
    
    
    
}
