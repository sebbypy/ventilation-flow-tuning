function deleteClassElements(className){
	var paras = document.getElementsByClassName(className);
	while(paras[0]) {
		paras[0].parentNode.removeChild(paras[0]);
	}
}


function updateCurrentFlowRateDisplay(flows,pressuredrop,stands){
	
    
	for (let i=0;i<flows.length;i++){
		document.getElementById("flow"+(i+1)+"display").innerHTML=flows[i].toFixed(0)+" m³/h"
	}


	//var totalFlow = flows.reduce((partialSum, a) => partialSum + a, 0)

	//document.getElementById("totalFlow").innerHTML="Total flow rate: "+totalFlow.toFixed(0)+" m³/h";
	//document.getElementById("dp").innerHTML="Actual pressure drop: "+pressuredrop+" Pa";
	//var power =  totalFlow * pressuredrop/3600;
	//document.getElementById("power").innerHTML="Electric power: "+power.toFixed(0)+" W";
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
	
	if (changedvent !== lastChangedVent){
		setNumberOfVentChanges(currentValue + 1);
	}
	
	lastChangedVent = changedvent;
}


function getNumberOfVentChanges(){
	return parseInt(document.getElementById('changeCounter').innerHTML);
}
	

function setNumberOfVentChanges(value){
	document.getElementById('changeCounter').innerHTML = value;

}
	




function checkSuccess(flows){

	tolerance=2

	targets = getTargetFlows()

    console.log(targets)

	for (let i=0;i<flows.length;i++){
		
		if (Math.abs(flows[i]-targets[i]) > tolerance){
			
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

function setVentPosition(number,value){

    ventPositionId = 'flow'+number+'input';
    ventPositionElement = document.getElementById(ventPositionId)
    
    if (ventPositionElement != null){
        
        ventPositionElement.value = value
    }
}

function resetAllVentPositions(){
    
    
    n = parseInt(document.getElementById("numberofvents").value)

   	for (let i=0;i<n;i++){
        
        setVentPosition(i,100)
    
    }
}



function createFanInput(){
    
    
    parentElement = document.getElementById("fancontroldiv")
    inputElement = document.getElementById('fanstanddisplay')
    
    console.log(inputElement)


    if (inputElement == null){

        var inputElement = document.createElement('p')
        inputElement.id = 'fanstanddisplay'
        inputElement.innerHTML = "50 %"
        inputElement.style="display: block;width: 60px; margin-left: 240px; margin-right: 0px;margin-bottom:0px;margin-top:0px"
        parentElement.appendChild(inputElement)
    
        
        var inputElement = document.createElement('input');
        inputElement.id = 'fanstand';
        inputElement.type = 'range';
        inputElement.onchange = function(evt){updateFanStandDisplay(evt.target.value)}

        parentElement.appendChild(inputElement)


        var inputElement = document.createElement('p')
        inputElement.id = 'fanflowrate'
        inputElement.style="display: inline; margin-left:30px;"
        parentElement.appendChild(inputElement)
        
        updateFanFlowDisplay()


    }
   
    

}





function updateFanStandDisplay(val){

    elem = document.getElementById('fanstanddisplay')
    elem.innerHTML = val+" %"

    changeActualFlow(actualFanFlowRate())

    updateFanFlowDisplay()
    
}

function actualFanFlowRate(){
    
    stand = document.getElementById('fanstand').value
    inittotalflow = document.getElementById('totalflow').value

    val = stand/100*inittotalflow*2 //*2 because 50% corresponds to init total flow
    
    return val
}

function updateFanFlowDisplay(){

    val = actualFanFlowRate()

    elem = document.getElementById('fanflowrate')
    elem.innerHTML = val.toFixed(0)+" m³/h"
    
}


function createFlowDisplay(number,width,marginRight,totalNumberOfVents){

	actualflowdiv = document.getElementById('actualflowdisplay');

	var inputElement = document.createElement('p');
	inputElement.id = 'flow'+number+'display';
	inputElement.className = 'flowdisplay';

	actualflowdiv.appendChild(inputElement);


	inputElement.style = "width:"+width+"px;margin-left:0px;margin-right:"+marginRight+"px";
	if (number==1){
		inputElement.style = "width:60px;margin-left:10px;margin-right:"+marginRight+"px";
	}	
	if (number==totalNumberOfVents){
		inputElement.style = "width:60px;margin-left:0px;margin-right:"+"0"+"px";
	}	
	inputElement.innerHTML  = "0 m³/h";
}

function createFlowDisplayLabel(){
    actualflowdiv = document.getElementById('actualflowdisplay');

	var inputElement = document.createElement('p');
	actualflowdiv.appendChild(inputElement);
	inputElement.innerHTML  = "Current flows";
    inputElement.setAttribute("lng-tag","current_flows")
    inputElement.className = "flowdisplay";
    inputElement.style = "margin-left:50px";
    inputElement.style.fontWeight = "bold"
    
    targetflowdiv = document.getElementById('targetflowdisplay');

	var inputElement = document.createElement('p');
	targetflowdiv.appendChild(inputElement);
	inputElement.innerHTML  = "Target flows";
    inputElement.setAttribute("lng-tag","target_flows")
    inputElement.className = "flowdisplay";
    inputElement.style = "margin-left:50px";
    inputElement.style.fontWeight = "bold"
        
}    

function createTargetFlowDisplay(number,width,marginRight,totalNumberOfVents){

	targetflowdiv = document.getElementById('targetflowdisplay');

	var inputElement = document.createElement('p');
	inputElement.id = 'targetflow'+number+'display';
	inputElement.className = 'flowdisplay';

	targetflowdiv.appendChild(inputElement);


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

    createFanInput()

	for (let i=0;i<n;i++){

		createInput(i+1,spacing,n);
		createFlowDisplay(i+1,60,spacing,n);
        createTargetFlowDisplay(i+1,60,spacing,n)
	}
    
    createFlowDisplayLabel()
    
}

function getTargetFlows(){
	vents = parseInt(document.getElementById("numberofvents").value)
    values = []

    for (let i=0; i<vents;i++){
        inputid = "input"+i
        
        values.push(document.getElementById(inputid).value)
     
    }
		
	return values
}

function getCurrentFlows(){
	vents = parseInt(document.getElementById("numberofvents").value)
    values = []

    for (let i=0; i<vents;i++){
        inputid = "input"+i
        
        values.push(document.getElementById(inputid).value)
     
    }
		
	return values
}



function adjustTarget(){
	
    vents = parseInt(document.getElementById("numberofvents").value)

    if (document.getElementById("targetflowratedefinition").value == "uniform"){

        for (let i=0; i<vents;i++){
            inputid = "input"+i
            
            inputElement = document.getElementById(inputid)
            inputElement.value = computeUniformTarget().toFixed(0)
        }
    }
    
    
    //showHideSuccessFlag(pyodide.globals.get("flows").toJs())
    
}


function changeTargetFlowsDefinition(){
    
    cleanTargetFlowRates()
    fillTargetFlowRates()
    updateTargetDisplay()
}

function computeUniformTarget(){
    
    flow = parseFloat(document.getElementById("totalflow").value)
	vents = parseInt(document.getElementById("numberofvents").value)
    return flow/vents
}

function cleanTargetFlowRates(){
    targetDiv = document.getElementById("targetinputs")
    while(targetDiv.firstChild){
        targetDiv.removeChild(targetDiv.firstChild);
    }
}



function fillTargetFlowRates(){

    totalFlow  =  document.getElementById("totalflow")
    targetDiv = document.getElementById("targetinputs")
     
    vents = parseInt(document.getElementById("numberofvents").value)
	targetType = document.getElementById("targetflowratedefinition").value


    for (let i=0; i<vents;i++){
        var input = document.createElement("input");
        input.type = "number"
        input.className = "numberinput"
        input.id = "input"+i

        input.value = computeUniformTarget().toFixed(0)
        input.onchange = function(){changeOneTargetFlowRate()}

        if (targetType=="uniform"){
            input.disabled= true
        }
        else{
            input.disabled = false
        }
        targetDiv.append(input)
    }
}


function updateTargetDisplay(){
    
    n = parseInt(document.getElementById("numberofvents").value)

    
	for (let i=0;i<n;i++){
		document.getElementById("targetflow"+(i+1)+"display").innerHTML = document.getElementById("input"+i).value+" m³/h"
	}

}

function changeOneTargetFlowRate(){
    
    updateTargetDisplay()

    //showHideSuccessFlag(pyodide.globals.get("flows").toJs())

}        


function changeInitFlowsDefinition(){
    
    cleanInitialFlowRates()
    fillInitialFlowRates()
    
    changeInitialCondition()
}
    
    
function cleanInitialFlowRates(){
    targetDiv = document.getElementById("initialinputs")
    while(targetDiv.firstChild){
        targetDiv.removeChild(targetDiv.firstChild);
    }
    
    //also have to reset the buttons
    resetAllVentPositions()
    
}

function fillInitialFlowRates(){

    totalFlow  =  document.getElementById("totalflow")
    targetDiv = document.getElementById("initialinputs")
     
    vents = parseInt(document.getElementById("numberofvents").value)
	targetType = document.getElementById("initflowratedefinition").value

    if (targetType == "userDefined"){
        totalFlow.disabled = true
    }
    else{
        totalFlow.disabled = false
    }

    for (let i=0; i<vents;i++){
        var input = document.createElement("input");
        input.type = "number"
        input.className = "numberinput"
        input.id = "initialinput"+i

        input.value = computeUniformTarget().toFixed(0)
        input.onchange = function(input){changeOneInitialFlowRate(input)}

        if (targetType=="uniform"){
            input.disabled= true
        }
        else if (targetType=="random"){
            input.disabled = true
        }
        else{
            input.disabled = false
        }
        targetDiv.append(input)
    }
}


function changeOneInitialFlowRate(e){
    //called when changing manually one of the initial flow rates
    // this must insure that the total flow rate is conserved
    // propose proportional change

    var caller = e.target || e.srcElement; // indentify caller object
    
    currentTotalInitialFlowRate = 0

    for (let i=0; i<vents;i++){
        inputid = "initialinput"+i
        flowValue = parseInt(document.getElementById(inputid).value)
        currentTotalInitialFlowRate += flowValue
    }
    document.getElementById("totalflow").value = currentTotalInitialFlowRate
    
    //imbalance = currentTotalInitialFlowRate - targetTotalFlowValue
    
    /*if (Math.abs(imbalance) > 0 ){
        showImbalanceWarning(true,imbalance)
    }
    else{
        showImbalanceWarning(false,0)
    }*/

    changeInitialCondition()
}


function showImbalanceWarning(flag,value){
    
    if (flag){
        document.getElementById("imbalancewarning").innerHTML = "Warning: imbalance of "+value+" m³/h"
    }
    else{
        document.getElementById("imbalancewarning").innerHTML = ""
    }
}

function getInitValues(){
    vents = parseInt(document.getElementById("numberofvents").value)

    values = []

    for (let i=0; i<vents;i++){
        inputid = "initialinput"+i
        console.log(inputid)
        flowValue = parseInt(document.getElementById(inputid).value)
        values.push(flowValue)
        
    }    
    return values
}

function updateAfterNumberOfDuctsChanged(numberOfDucts){

    initialConditionType = document.getElementById("initflowratedefinition").value
    initvalues = []

    deleteClassElements('network-svg')
    deleteClassElements('counter')
    deleteClassElements('flowdisplay')

    
    spaceBetweenDucts = drawNetwork(numberOfDucts)
    drawNetworkArrows(numberOfDucts)
    createNetWorkInputs(numberOfDucts,spaceBetweenDucts)

    changeInitFlowsDefinition()
    changeTargetFlowsDefinition()


    if (initialConditionType == 'userDefined'){
        initvalues = getInitValues()
    }

    initNetwork(numberOfDucts,initialConditionType,initvalues)

}


async function changeInitialCondition(){
    
    numberOfDucts = parseInt(document.getElementById("numberofvents").value)
    
    initialConditionType = document.getElementById("initflowratedefinition").value

    initvalues = []
    if (initialConditionType == 'userDefined'){
        initvalues = getInitValues()
        
    }

    
    await initNetwork(numberOfDucts,initialConditionType,initvalues)
    update(numberOfDucts)
 
    updateInitialConditionDisplay()
}



