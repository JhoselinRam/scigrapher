import { Graph2D } from "../dist/lib/index.js";
const Graph = Graph2D(document.querySelector(".graph")).pointerZoom({type:"area"});

function changeBackgroundColor(e){
    const color = e.target.value;
    Graph.backgroundColor(color);
}

function changeOpacity(e){
    const opacity = parseFloat(e.target.value);
    Graph.backgroundOpacity(opacity);
}

const labels = {
    titleObj : {
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "25px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "start",
        enable : false    
    },
    subtitleObj :{
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "start",
        enable : false
    },
    xPrimaryObj : {
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "center",
        enable : false
    },
    yPrimaryObj : {
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "center",
        enable : false
    },
    xSecondaryObj : {
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "center",
        enable : false
    },
    ySecondaryObj : {
        text : "",
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "center",
        enable : false
    },
}

let labelSelected = "titleObj";

function toggleLabel(e){
    labelSelected = e.target.className.split(" ")[0];
    labels[labelSelected].enable  = e.target.checked;
    updateLabel();
}

function changeLabelText(e){
    const text =  e.target.value;
    labelSelected = e.target.className.split(" ")[0];
    labels[labelSelected].text = text;
    updateLabel();
}

function toggleLabelFilled(e){
    labelSelected = e.target.className.split(" ")[0];
    labels[labelSelected].filled = e.target.checked;
    updateLabel();
}

function selectLabel(e){
    const selection = e.target.value;
    labelSelected = selection;
}

function updateLabel(){
    const arg = labels[labelSelected];
    switch(labelSelected){
        case "titleObj":
            Graph.title(arg);
            break;
        case "subtitleObj":
            Graph.subtitle(arg);
            break;
        case "xPrimaryObj":
            Graph.xLabel(arg);
            break;
        case "yPrimaryObj":
            Graph.yLabel(arg);
            break;
        case "xSecondaryObj":
            Graph.xLabelSecondary(arg);
            break;
        case "ySecondaryObj":
            Graph.yLabelSecondary(arg);
            break;
    }
}

function changeLabelColor(e){
    const color = e.target.value;
    labels[labelSelected].color = color;
    updateLabel();
}

function changeLabelFont(e){
    const font = e.target.value;
    labels[labelSelected].font = font;
    updateLabel();
}

function changeLabelSize(e){
    const size = e.target.value;
    labels[labelSelected].size = `${size}px`;
    updateLabel();
}

function changeLabelPosition(e){
    const position = e.target.value;
    labels[labelSelected].position = position;
    updateLabel();
}

function changeLabelOpacity(e){
    const opacity = parseFloat(e.target.value);
    labels[labelSelected].opacity = opacity;
    updateLabel();
}

const domain = {
    x : {
        start : -5,
        end : 5
    },
    y : {
        start : -5,
        end : 5
    }
}

function changeDomain(e){
    const axis = e.target.id[0];
    const prop = e.target.id.slice(1).toLowerCase();

    domain[axis][prop] = parseFloat(e.target.value);

    Graph.axisDomain(domain);
}

function changeAxisColor(e){
    const target = document.querySelector("#colorTo").value;
    const color = e.target.value;
    switch(target){
        case "All":
            Graph.axisColor({axis:color});
            break;
        case "xAxis":
            Graph.axisColor({xAxis:color});
            break;
        case "yAxis":
            Graph.axisColor({yAxis:color});
            break;
        case "xBase":
            Graph.axisColor({base:{x:color}});
            break;
        case "yBase":
            Graph.axisColor({base:{y:color}});
            break;
        case "xTick":
            Graph.axisColor({tick:{x:color}});
            break;
        case "yTick":
            Graph.axisColor({tick:{y:color}});
            break;
        case "xText":
            Graph.axisColor({text:{x:color}});
            break;
        case "yText":
            Graph.axisColor({text:{y:color}});
            break;
    }
}

function changeAxisOpacity(e){
    const target = document.querySelector("#opacityTo").value;
    const opacity = e.target.value;
    switch(target){
        case "All":
            Graph.axisOpacity({axis:opacity});
            break;
        case "xAxis":
            Graph.axisOpacity({xAxis:opacity});
            break;
        case "yAxis":
            Graph.axisOpacity({yAxis:opacity});
            break;
        case "xBase":
            Graph.axisOpacity({base:{x:opacity}});
            break;
        case "yBase":
            Graph.axisOpacity({base:{y:opacity}});
            break;
        case "xTick":
            Graph.axisOpacity({tick:{x:opacity}});
            break;
        case "yTick":
            Graph.axisOpacity({tick:{y:opacity}});
            break;
        case "xText":
            Graph.axisOpacity({text:{x:opacity}});
            break;
        case "yText":
            Graph.axisOpacity({text:{y:opacity}});
            break;
    }
}

function changeUnits(e){
    const axis = e.target.id;
    const unit = e.target.value;

    switch(axis){
        case "xUnits":
            Graph.axisUnits({x:unit});
            break;
        
        case "yUnits":
            Graph.axisUnits({y:unit});
            break;
    }
}

function changeAxisWidth(e){
    const target = document.querySelector("#widthTo").value;
    const value = e.target.value;

    switch(target){
        case "xBase":
            Graph.axisBase({x:{width:value}});
            break;

        case "yBase":
            Graph.axisBase({y:{width:value}});
            break;

        case "xTicks":
            Graph.axisTicks({x:{width:value}});
            break;

        case "yTicks":
            Graph.axisTicks({y:{width:value}});
            break;
    }
}

function changeTickSize(e){
    const target = e.target.id;
    const value = parseFloat(e.target.value);

    if(target === "xTickSize")
        Graph.axisTicks({x:{size:value}});
    if(target === "yTickSize")
        Graph.axisTicks({y:{size:value}});
}

function changeTickFont(e){
    const target = document.querySelector("#tickFontFor").value;
    const font = e.target.value;

    if(target === "x")
        Graph.axisText({x:{font}});
    if(target === "y")
        Graph.axisText({y:{font}});
}

function changeAxisTextSize(e){
    const size = `${e.target.value}px`;
    const target = e.target.id;

    if(target === "xTextSize")
        Graph.axisText({x:{size}});
    if(target === "yTextSize")
        Graph.axisText({y:{size}});
}

function changeAxisDynamic(e){
    const target = e.target.id;
    const checked = e.target.checked;

    switch(target){
        case "xDynamic":
            Graph.axisDynamic({x:{dynamic:checked}});
            break;
            
        case "yDynamic":
            Graph.axisDynamic({y:{dynamic:checked}});
            break;
            
        case "xContained":
            Graph.axisDynamic({x:{contained:checked}});
            break;
            
        case "yContained":
            Graph.axisDynamic({y:{contained:checked}});
            break;
    }
}

function changeMargin(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    switch(target){
        case "marginStart":
            Graph.margin({x:{start:value}});
            break;
            
        case "marginEnd":
            Graph.margin({x:{end:value}});
            break;
                
        case "marginTop":
            Graph.margin({y:{end:value}});
            break;
        
        case "marginBottom":
            Graph.margin({y:{start:value}});
            break;

    }
}

function changeTicks(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "xTicks")
        Graph.axisTicks({x:{ticks:value===-1?"auto":value}});
    if(target === "yTicks")
        Graph.axisTicks({y:{ticks:value===-1?"auto":value}});
}

function changeSpacing(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "xSpacing")
        Graph.axisTicks({x:{minSpacing : value}});
    if(target === "ySpacing")
        Graph.axisTicks({y:{minSpacing : value}});
}

function changeAxisPosition(e){
    const position = e.target.value;
    Graph.axisPosition(position);
}

function changePriority(e){
    const target = e.target.id;
    const value = e.target.checked;
console.log(target, value);
    if(target === "xPriority" && value)
        Graph.axisOverlap({priority:"x"});
    if(target === "yPriority" && value)
        Graph.axisOverlap({priority:"y"});
}

function changeOverlap(e){
    const target = e.target.id;
    const value = e.target.checked;

    if(target === "xOverlap")
        Graph.axisOverlap({x:value});
    if(target === "yOverlap")
        Graph.axisOverlap({y:value});
}

function enableGrid(e){
    const target = e.target.id;
    const value = e.target.checked;

    switch(target){
        case "xPrimaryGrid":
            Graph.primaryGrid({x:{enable:value}});
            break;
        
        case "yPrimaryGrid":
            Graph.primaryGrid({y:{enable:value}});
            break;
        
        case "xSecondaryGrid":
            Graph.secondaryGrid({x:{enable:value}});
            break;
        
        case "ySecondaryGrid":
            Graph.secondaryGrid({y:{enable:value}});
            break;
        
    }
}

function changeGridColor(e){
    const target = document.querySelector("#gridTarget").value;
    const color = e.target.value;

    switch(target){
        case "all":
            Graph.gridColor({grid:color});
            break;
            
        case "primary":
            Graph.gridColor({primary:color});
            break;

        case "secondary":
            Graph.gridColor({secondary:color});
            break;

        case "xPrimary":
            Graph.gridColor({x:{primary:color}});
            break;

        case "yPrimary":
            Graph.gridColor({y:{primary:color}});
            break;
 
        case "xSecondary":
            Graph.gridColor({x:{secondary:color}});
            break;

        case "ySecondary":
            Graph.gridColor({y:{secondary:color}});
            break;
 
    }
}

function changeGridOpacity(e){
    const target = document.querySelector("#gridTarget").value;
    const value = parseFloat(e.target.value);

    switch(target){
        case "all":
            Graph.gridOpacity({grid:value});
            break;
            
        case "primary":
            Graph.gridOpacity({primary:value});
            break;

        case "secondary":
            Graph.gridOpacity({secondary:value});
            break;

        case "xPrimary":
            Graph.gridOpacity({x:{primary:value}});
            break;

        case "yPrimary":
            Graph.gridOpacity({y:{primary:value}});
            break;
 
        case "xSecondary":
            Graph.gridOpacity({x:{secondary:value}});
            break;

        case "ySecondary":
            Graph.gridOpacity({y:{secondary:value}});
            break;
 
    }
}

function changeGridWidth(e){
    const target = document.querySelector("#gridTarget").value;
    const value = parseInt(e.target.value);

    switch(target){
        case "all":
            Graph.gridWidth({grid:value});
            break;
            
        case "primary":
            Graph.gridWidth({primary:value});
            break;

        case "secondary":
            Graph.gridWidth({secondary:value});
            break;

        case "xPrimary":
            Graph.gridWidth({x:{primary:value}});
            break;

        case "yPrimary":
            Graph.gridWidth({y:{primary:value}});
            break;
 
        case "xSecondary":
            Graph.gridWidth({x:{secondary:value}});
            break;

        case "ySecondary":
            Graph.gridWidth({y:{secondary:value}});
            break;
 
    }
}

function changeGridStyle(e){
    const target = document.querySelector("#gridTarget").value;
    const value = e.target.value;

    switch(target){
        case "all":
            Graph.gridStyle({grid:value});
            break;
            
        case "primary":
            Graph.gridStyle({primary:value});
            break;

        case "secondary":
            Graph.gridStyle({secondary:value});
            break;

        case "xPrimary":
            Graph.gridStyle({x:{primary:value}});
            break;

        case "yPrimary":
            Graph.gridStyle({y:{primary:value}});
            break;
 
        case "xSecondary":
            Graph.gridStyle({x:{secondary:value}});
            break;

        case "ySecondary":
            Graph.gridStyle({y:{secondary:value}});
            break;
    }
}

function changeGridDensity(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    value = value>-1?value:"auto";
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{density:value}});
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{density:value}});
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{density:value}});
            break;

        case "ySecondary":
            Graph.secondaryGrid({y:{density:value}});
            break;
    }
}

function changeGridSpacing(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{minSpacing:value}});
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{minSpacing:value}});
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{minSpacing:value}});
            break;

        case "ySecondary":
            Graph.secondaryGrid({x:{minSpacing:value}});
            break;
    }
}

function changeGridMaxDensity(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{maxDensity:value}});
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{maxDensity:value}});
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{maxDensity:value}});
            break;

        case "ySecondary":
            Graph.secondaryGrid({x:{maxDensity:value}});
            break;
    }
}

function enableSecondaryAxis(e){
    const target = e.target.id;
    const checked = e.target.checked;

    if(target === "enableSecondaryX")
        Graph.secondaryAxisEnable({x:checked});
    if(target === "enableSecondaryY")
        Graph.secondaryAxisEnable({y:checked});
}

const secondaryDomain = {
    x : {
        start : -5,
        end : 5
    },
    y : {
        start : -5,
        end : 5
    }
}

function changeSecondaryDomain(e){
    const target = e.target.id;
    const value = parseFloat(e.target.value);

    switch(target){
        case "secondaryXStart":
            secondaryDomain.x.start = value;
            break;
        case "secondaryXEnd":
            secondaryDomain.x.end = value;
            break;
        case "secondaryYStart":
            secondaryDomain.y.start = value;
            break;
        case "secondaryYEnd":
            secondaryDomain.y.end = value;
            break;
    }

    Graph.secondaryAxisDomain(secondaryDomain);
}

function changeSecondaryAxisColor(e){
    const target = document.querySelector("#colorToSecondary").value;
    const color = e.target.value;
    switch(target){
        case "All":
            Graph.secondaryAxisColor({axis:color});
            break;
        case "xAxis":
            Graph.secondaryAxisColor({xAxis:color});
            break;
        case "yAxis":
            Graph.secondaryAxisColor({yAxis:color});
            break;
        case "xBase":
            Graph.secondaryAxisColor({base:{x:color}});
            break;
        case "yBase":
            Graph.secondaryAxisColor({base:{y:color}});
            break;
        case "xTick":
            Graph.secondaryAxisColor({tick:{x:color}});
            break;
        case "yTick":
            Graph.secondaryAxisColor({tick:{y:color}});
            break;
        case "xText":
            Graph.secondaryAxisColor({text:{x:color}});
            break;
        case "yText":
            Graph.secondaryAxisColor({text:{y:color}});
            break;
    }
}

function changeSecondaryAxisOpacity(e){
    const target = document.querySelector("#opacityToSecondary").value;
    const opacity = e.target.value;
    switch(target){
        case "All":
            Graph.secondaryAxisOpacity({axis:opacity});
            break;
        case "xAxis":
            Graph.secondaryAxisOpacity({xAxis:opacity});
            break;
        case "yAxis":
            Graph.secondaryAxisOpacity({yAxis:opacity});
            break;
        case "xBase":
            Graph.secondaryAxisOpacity({base:{x:opacity}});
            break;
        case "yBase":
            Graph.secondaryAxisOpacity({base:{y:opacity}});
            break;
        case "xTick":
            Graph.secondaryAxisOpacity({tick:{x:opacity}});
            break;
        case "yTick":
            Graph.secondaryAxisOpacity({tick:{y:opacity}});
            break;
        case "xText":
            Graph.secondaryAxisOpacity({text:{x:opacity}});
            break;
        case "yText":
            Graph.secondaryAxisOpacity({text:{y:opacity}});
            break;
    }
}

function changeSecondaryUnits(e){
    const axis = e.target.id;
    const unit = e.target.value;

    switch(axis){
        case "secondaryXUnits":
            Graph.secondaryAxisUnits({x:unit});
            break;
        
        case "secondaryYUnits":
            Graph.secondaryAxisUnits({y:unit});
            break;
    }
}

function changeSecondaryAxisWidth(e){
    const target = document.querySelector("#widthToSecondary").value;
    const value = e.target.value;

    switch(target){
        case "xBase":
            Graph.secondaryAxisBase({x:{width:value}});
            break;

        case "yBase":
            Graph.secondaryAxisBase({y:{width:value}});
            break;

        case "xTicks":
            Graph.secondaryAxisTicks({x:{width:value}});
            break;

        case "yTicks":
            Graph.secondaryAxisTicks({y:{width:value}});
            break;
    }
}

function changeSecondaryTickSize(e){
    const target = e.target.id;
    const value = parseFloat(e.target.value);

    if(target === "secondaryXTickSize")
        Graph.secondaryAxisTicks({x:{size:value}});
    if(target === "secondaryYTickSize")
        Graph.secondaryAxisTicks({y:{size:value}});
}

function changeSecondaryTickFont(e){
    const target = document.querySelector("#tickFontForSecondary").value;
    const font = e.target.value;

    if(target === "x")
        Graph.secondaryAxisText({x:{font}});
    if(target === "y")
        Graph.secondaryAxisText({y:{font}});
}

function changeSecondaryAxisTextSize(e){
    const size = `${e.target.value}px`;
    const target = e.target.id;

    if(target === "secondaryXTextSize")
        Graph.secondaryAxisText({x:{size}});
    if(target === "secondaryYTextSize")
        Graph.secondaryAxisText({y:{size}});
}

function changeSecondaryTicks(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "secondaryXTicks")
        Graph.secondaryAxisTicks({x:{ticks:value===-1?"auto":value}});
    if(target === "secondaryYTicks")
        Graph.secondaryAxisTicks({y:{ticks:value===-1?"auto":value}});
}

function changeSecondarySpacing(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "secondaryXSpacing")
        Graph.secondaryAxisTicks({x:{minSpacing : value}});
    if(target === "secondaryYSpacing")
        Graph.secondaryAxisTicks({y:{minSpacing : value}});
}

function changePolarGrid(e){
    const value = parseInt(e.target.value);
    Graph.polarGrid(value);
}

function changeAxisType(e){
    const type = e.target.value;
    Graph.axisType(type);
}

function changeSecondaryAxisType(e){
    const target = document.querySelector("#secondaryXAxisType").checked?"x":"y";
    const type = e.target.value;

    if(target === "x")
        Graph.secondaryAxisType({x:type});
    if(target === "y")
        Graph.secondaryAxisType({y:type});
}

function changeAspectRatio(){
    const ratio = parseFloat(document.querySelector("#aspectRatio").value);
    const anchor = parseFloat(document.querySelector("#anchor").value);
    const axis = document.querySelector("#xAspectRatio").checked? "x" : "y";

    Graph.aspectRatio({ratio, anchor, axis});
}

function changePointerMove(){
    const enable = document.querySelector("#pointerMove").checked;
    const pointerCapture = document.querySelector("#pointerCapture").checked;
    const delay = parseInt(document.querySelector("#pointerDelay").value);
    const defaultCursor = document.querySelector("#defaultCursor").value;
    const hoverCursor = document.querySelector("#hoverCursor").value;
    const moveCursor = document.querySelector("#moveCursor").value;

    Graph.pointerMove({enable, delay, pointerCapture, defaultCursor, hoverCursor, moveCursor});
}












//---------------------------------------------

function main(){
    document.querySelector("#bgcolor").addEventListener("input", changeBackgroundColor);
    document.querySelector("#bgopacity").addEventListener("input", changeOpacity);
    document.querySelector("#title").addEventListener("input", changeLabelText);
    document.querySelector("#enableTitle").addEventListener("change", toggleLabel);
    document.querySelector("#fillTitle").addEventListener("change", toggleLabelFilled);
    document.querySelector("#subtitle").addEventListener("input", changeLabelText);
    document.querySelector("#enableSubtitle").addEventListener("change", toggleLabel);
    document.querySelector("#fillSubtitle").addEventListener("change", toggleLabelFilled);
    document.querySelector("#xPrimary").addEventListener("input", changeLabelText);
    document.querySelector("#enableXPrimary").addEventListener("change", toggleLabel);
    document.querySelector("#fillXPrimary").addEventListener("change", toggleLabelFilled);
    document.querySelector("#yPrimary").addEventListener("input", changeLabelText);
    document.querySelector("#enableYPrimary").addEventListener("change", toggleLabel);
    document.querySelector("#fillYPrimary").addEventListener("change", toggleLabelFilled);
    document.querySelector("#xSecondary").addEventListener("input", changeLabelText);
    document.querySelector("#enableXSecondary").addEventListener("change", toggleLabel);
    document.querySelector("#fillXSecondary").addEventListener("change", toggleLabelFilled);
    document.querySelector("#ySecondary").addEventListener("input", changeLabelText);
    document.querySelector("#enableYSecondary").addEventListener("change", toggleLabel);
    document.querySelector("#fillYSecondary").addEventListener("change", toggleLabelFilled);
    document.querySelector("#selectLabel").addEventListener("change", selectLabel);
    document.querySelector("#labelColor").addEventListener("input", changeLabelColor);
    document.querySelector("#labelFont").addEventListener("change", changeLabelFont);
    document.querySelector("#labelSize").addEventListener("input", changeLabelSize);
    document.querySelector("#labelPosition").addEventListener("input", changeLabelPosition);
    document.querySelector("#labelOpacity").addEventListener("input", changeLabelOpacity);
    document.querySelector("#xStart").addEventListener("input", changeDomain);
    document.querySelector("#yStart").addEventListener("input", changeDomain);
    document.querySelector("#xEnd").addEventListener("input", changeDomain);
    document.querySelector("#yEnd").addEventListener("input", changeDomain);
    document.querySelector("#axisColor").addEventListener("input", changeAxisColor);
    document.querySelector("#axisOpacity").addEventListener("input", changeAxisOpacity);
    document.querySelector("#xUnits").addEventListener("input", changeUnits);
    document.querySelector("#yUnits").addEventListener("input", changeUnits);
    document.querySelector("#widthInput").addEventListener("input", changeAxisWidth);
    document.querySelector("#xTickSize").addEventListener("input", changeTickSize);
    document.querySelector("#yTickSize").addEventListener("input", changeTickSize);
    document.querySelector("#tickFont").addEventListener("change", changeTickFont);
    document.querySelector("#xTextSize").addEventListener("input", changeAxisTextSize);
    document.querySelector("#yTextSize").addEventListener("input", changeAxisTextSize);
    document.querySelector("#xDynamic").addEventListener("change", changeAxisDynamic);
    document.querySelector("#yDynamic").addEventListener("change", changeAxisDynamic);
    document.querySelector("#xContained").addEventListener("change", changeAxisDynamic);
    document.querySelector("#yContained").addEventListener("change", changeAxisDynamic);
    document.querySelector("#marginStart").addEventListener("input", changeMargin);
    document.querySelector("#marginEnd").addEventListener("input", changeMargin);
    document.querySelector("#marginTop").addEventListener("input", changeMargin);
    document.querySelector("#marginBottom").addEventListener("input", changeMargin);
    document.querySelector("#xTicks").addEventListener("input", changeTicks);
    document.querySelector("#yTicks").addEventListener("input", changeTicks);
    document.querySelector("#xSpacing").addEventListener("input", changeSpacing);
    document.querySelector("#ySpacing").addEventListener("input", changeSpacing);
    document.querySelector("#axisPosition").addEventListener("change", changeAxisPosition);
    document.querySelector("#xOverlap").addEventListener("change", changeOverlap);
    document.querySelector("#yOverlap").addEventListener("change", changeOverlap);
    document.querySelector("#xPriority").addEventListener("input", changePriority);
    document.querySelector("#yPriority").addEventListener("input", changePriority);
    document.querySelector("#xPrimaryGrid").addEventListener("change", enableGrid);
    document.querySelector("#yPrimaryGrid").addEventListener("change", enableGrid);
    document.querySelector("#xSecondaryGrid").addEventListener("change", enableGrid);
    document.querySelector("#ySecondaryGrid").addEventListener("change", enableGrid);
    document.querySelector("#gridColor").addEventListener("input", changeGridColor);
    document.querySelector("#gridOpacity").addEventListener("input", changeGridOpacity);
    document.querySelector("#gridWidth").addEventListener("input", changeGridWidth);
    document.querySelector("#gridStyle").addEventListener("change", changeGridStyle);
    document.querySelector("#gridDensity").addEventListener("input", changeGridDensity);
    document.querySelector("#gridSpacing").addEventListener("input", changeGridSpacing);
    document.querySelector("#gridMaxDensity").addEventListener("input", changeGridMaxDensity);
    document.querySelector("#enableSecondaryX").addEventListener("change", enableSecondaryAxis);
    document.querySelector("#enableSecondaryY").addEventListener("change", enableSecondaryAxis);
    document.querySelector("#secondaryXStart").addEventListener("input", changeSecondaryDomain);
    document.querySelector("#secondaryXEnd").addEventListener("input", changeSecondaryDomain);
    document.querySelector("#secondaryYStart").addEventListener("input", changeSecondaryDomain);
    document.querySelector("#secondaryYEnd").addEventListener("input", changeSecondaryDomain);
    document.querySelector("#secondaryAxisColor").addEventListener("input", changeSecondaryAxisColor);
    document.querySelector("#secondaryAxisOpacity").addEventListener("input", changeSecondaryAxisOpacity);
    document.querySelector("#secondaryXUnits").addEventListener("input", changeSecondaryUnits);
    document.querySelector("#secondaryYUnits").addEventListener("input", changeSecondaryUnits);
    document.querySelector("#secondaryWidthInput").addEventListener("input", changeSecondaryAxisWidth);
    document.querySelector("#secondaryXTickSize").addEventListener("input", changeSecondaryTickSize);
    document.querySelector("#secondaryYTickSize").addEventListener("input", changeSecondaryTickSize);
    document.querySelector("#secondaryTickFont").addEventListener("change", changeSecondaryTickFont);
    document.querySelector("#secondaryXTextSize").addEventListener("input", changeSecondaryAxisTextSize);
    document.querySelector("#secondaryYTextSize").addEventListener("input", changeSecondaryAxisTextSize);
    document.querySelector("#secondaryXTicks").addEventListener("input", changeSecondaryTicks);
    document.querySelector("#secondaryYTicks").addEventListener("input", changeSecondaryTicks);
    document.querySelector("#secondaryXSpacing").addEventListener("input", changeSecondarySpacing);
    document.querySelector("#secondaryYSpacing").addEventListener("input", changeSecondarySpacing);
    document.querySelector("#polarGrid").addEventListener("input", changePolarGrid);
    document.querySelector("#axisType").addEventListener("input", changeAxisType);
    document.querySelector("#secondaryType").addEventListener("change", changeSecondaryAxisType);
    document.querySelector("#applyAspectRatio").addEventListener("click", changeAspectRatio);
    document.querySelector("#pointerMove").addEventListener("change", changePointerMove);
    document.querySelector("#pointerCapture").addEventListener("change", changePointerMove);
    document.querySelector("#pointerDelay").addEventListener("input", changePointerMove);
    document.querySelector("#defaultCursor").addEventListener("input", changePointerMove);
    document.querySelector("#hoverCursor").addEventListener("input", changePointerMove);
    document.querySelector("#moveCursor").addEventListener("input", changePointerMove);
}
main();