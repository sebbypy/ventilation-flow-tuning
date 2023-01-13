function deleteClassElements(className){
	var paras = document.getElementsByClassName(className);
	while(paras[0]) {
		paras[0].parentNode.removeChild(paras[0]);
	}
}

async function loadPythonClasses(){
	let pyodide = await initPyodide
	await pyodide.loadPackage("numpy");

	pyodide.runPython(await (await fetch('https://raw.githubusercontent.com/sebbypy/ventilation-flow-tuning/main/ventilationNetwork.py')).text());
}

async function main(n){
	let pyodide = await initPyodide
	await pyodide.loadPackage("numpy");
	await loadPythonClasses();
		
	window.nvents = n;
		
	pyodide.runPython(`

import numpy as np
from js import nvents

n = network(nvents)    

`);      

update(n)

		
}

function updateDisplay(flows,pressuredrop,stands){
	
	for (let i=0;i<flows.length;i++){
		document.getElementById("flow"+(i+1)+"display").innerHTML=flows[i].toFixed(1)+" m3/h"
	}

	var totalFlow = flows.reduce((partialSum, a) => partialSum + a, 0)

	//document.getElementById("totalFlow").innerHTML="Total flow rate: "+totalFlow.toFixed(0)+" m³/h";
	//document.getElementById("dp").innerHTML="Actual pressure drop: "+pressuredrop+" Pa";
	//var power =  totalFlow * pressuredrop/3600;
	//document.getElementById("power").innerHTML="Electric power: "+power.toFixed(1)+" W";
	//updateVelocity(flows)
	
}

function updateVelocity(flows){

	ref=25;
	
	for(let i = 0; i < flows.length; i++){ 

		key='arrow'+(i+1).toString();
			
		elem = document.getElementsByClassName(key)[0];
	
		style = window.getComputedStyle(elem);
	
		currentLeft = parseFloat(style.left,10);
		currentWidth = parseFloat(style.width,10);
		currentHeight = parseFloat(style.height,10);
	
	
		currentCenter = currentLeft + currentWidth/2.;
		newWidth = flows[i]/ref*20
	
		elem.style.width= newWidth+"px";
		elem.style.height="60px";
		
		newLeft = currentCenter - newWidth/2.;
		elem.style.left = newLeft+"px";
		
	}

}

async function ventSettingChanged(changedvent,numberofvents){
	
	currentValue = getNumberOfVentChanges()	;
	
	if (changedvent != lastChangedVent){
		setNumberOfVentChanges(currentValue + 1);
	}
	
	lastChangedVent = changedvent;
}


function getNumberOfVentChanges(){
	return parseInt(document.getElementById('changeCounter').innerHTML)
}
	

function setNumberOfVentChanges(value){
	document.getElementById('changeCounter').innerHTML = value

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
pressureDrop = pyodide.globals.get("dp").toFixed(1);
updateDisplay(jsFlows,pressureDrop,stands);

showHideSuccessFlag(jsFlows);

}


function checkSuccess(flows){

	target = getTargetFlow()

	for (let i=0;i<flows.length;i++){
		
		if (Math.abs(flows[i]-target) > 1){
			
			return false
		}
	}
	
	return true
}

function showHideSuccessFlag(jsFlows){

	if (checkSuccess(jsFlows)){
		document.getElementById('successflag').innerHTML = 'Réglage réussi';
	}
	else{
		document.getElementById('successflag').innerHTML = '';
	}
}

	

function drawNetwork(n){

	var margin = 10
	var WD = 60;

	if (n<=7){
		var pictureWidth = 500;
		}
	else{
		var pictureWidth = n*(WD+20)+2*margin;
	}

	var WT = pictureWidth-2*margin;
	var DELTA = (WT - n*WD)/(n-1); 

	var H1=100;
	var H2=H1+WD;
	var H3=H2+2*WD;
	
	
	H3p = H3-H2

	svgString="M "+margin+" "+(H3+margin)
	
	svgString+="v -"+H2+" h "+(WT-WD)/2+" v -"+ H3p +" h "+WD+" v "+H3p+" h "+(WT-WD)/2+" v "+H2

	for (let i=0;i<n-1;i++){
		svgString += " h -"+WD
		svgString += " v -"+H1
		svgString += " h -"+DELTA
		svgString += " v "+H1
	}
	svgString += "Z"

	//svgString+="v "+H2+" h "+WT+" v -"+H2
	
	
	deleteClassElements('network-svg')
	
	var draw = SVG().addTo('.networkdiv').size(pictureWidth, 300)
	draw.addClass('network-svg')
	var path = draw.path(svgString)

	path.fill('none').stroke({width:4, color: 'black'})

	return DELTA

}

function drawArrow(xcenter,ypos,ivalue){
	
	var margin=0;
	var W = 10;
	var L = 45 ;

	xpos = xcenter - W-margin
	
	svgString="M "+(margin+W/2+xpos)+" "+(margin+ypos);
	svgString += " h "+W;
	svgString += " v "+L;
	svgString += " h "+1/2*W;
	svgString += " l -"+W+" "+L/4;
	svgString += " l -"+W+" -"+L/4;
	svgString += " h "+1/2*W;
	svgString += " z";
	
	draw = SVG.find('.network-svg');
	
	var path = draw.path(svgString)
	
	var text = draw.text(ivalue).attr({x:xcenter-5, y: 260});

	path.fill({color:'#008080'}).stroke({width:1, color: 'black'})

}

function drawNetworkArrows(n){

	margin=10
	WD = 60
	if (n<=7){
		var pictureWidth = 500;
	}
	else{
		var pictureWidth = n*(WD+20)+2*margin;
	}
	var WT = pictureWidth-2*margin;
	var DELTA = (WT - n*WD)/(n-1); 

	
	for (let i=0;i<n;i++){
		
		xcenter = margin + WD/2 + i*(WD+DELTA)
		drawArrow(xcenter,210,(i+1).toString())
	}
}


function createInput(number,marginRight,totalNumberOfVents){

	inputForm = document.getElementsByClassName('form-inline')[0]

	var inputElement = document.createElement('input');
	inputElement.id = 'flow'+number+'input';

    inputElement.type = 'range';
    inputElement.className = 'counter';
	
	inputElement.style = "width:"+60+"px;margin-left:0px;margin-right:"+marginRight+"px";
	
	if (number==1){
		inputElement.style = "width:60px;margin-left:10px;margin-right:"+marginRight+"px";
	}	
	if (number==totalNumberOfVents){
		inputElement.style = "width:60px;margin-left:0px;margin-right:"+"0"+"px";
	}	
	
	inputForm.appendChild(inputElement);
	inputElement.setAttribute("value", "100");
	inputElement.setAttribute("min", "1");
	inputElement.setAttribute("max", "100");

	inputElement.onchange = function(){
		update(totalNumberOfVents);
		ventSettingChanged(number,totalNumberOfVents);
		}

}

function createFlowDisplay(number,width,marginRight,totalNumberOfVents){

	horizontal = document.getElementsByClassName('horizontal')[0];
	var inputElement = document.createElement('p');

	inputElement.id = 'flow'+number+'display';
	inputElement.className = 'flowdisplay';

	horizontal.appendChild(inputElement);


	inputElement.style = "width:"+width+"px;margin-left:0px;margin-right:"+marginRight+"px";
	if (number==1){
		inputElement.style = "width:60px;margin-left:10px;margin-right:"+marginRight+"px";
	}	
	if (number==totalNumberOfVents){
		inputElement.style = "width:60px;margin-left:0px;margin-right:"+"0"+"px";
	}	
	
	inputElement.innerHTML  = "0 m³/h";
	
}


function createNetWorkInputs(n,spacing){

	for (let i=0;i<n;i++){

		createInput(i+1,spacing,n);
		createFlowDisplay(i+1,60,spacing,n);
	}
}

function getTargetFlow(){

	flow = parseFloat(document.getElementById("totalflow").value)
	vents = parseInt(document.getElementById("numberofvents").value)
	
	targetFlow = flow/vents
		
	return targetFlow

}
function adjustTarget(){
	
	document.getElementById("targetflow").innerHTML = getTargetFlow().toFixed(1)

}


function setnumberofducts(numberOfDucts){

	deleteClassElements('network-svg')
	deleteClassElements('counter')
	deleteClassElements('flowdisplay')

	spaceBetweenDucts = drawNetwork(numberOfDucts)
	drawNetworkArrows(numberOfDucts)
	createNetWorkInputs(numberOfDucts,spaceBetweenDucts)
	main(numberOfDucts)

	adjustTarget()

}

async function changeFlow(flowValue){

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
pressureDrop = pyodide.globals.get("dp").toFixed(1);
updateDisplay(jsFlows,pressureDrop,stands);

adjustTarget()

}
