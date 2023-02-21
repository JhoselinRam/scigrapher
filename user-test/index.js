import { Graph2D } from "../dist/lib/index.js";
const Graph = Graph2D(document.querySelector(".graph"),{
    axis : {
        position : "bottom-left",
    },
    secondary : {
        x:{
            start : -5,
            end : 5,
        },
        y:{
            start : 5,
            end : -5,
        }
    }
}).pointerZoom().pointerMove().containerResize();

function changeBackgroundColor(e){
    const color = e.target.value;
    Graph.backgroundColor(color).draw();
}

function changeOpacity(e){
    const opacity = parseFloat(e.target.value);
    Graph.backgroundOpacity(opacity).draw();
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
            Graph.title(arg).draw();
            break;
        case "subtitleObj":
            Graph.subtitle(arg).draw();
            break;
        case "xPrimaryObj":
            Graph.xLabel(arg).draw();
            break;
        case "yPrimaryObj":
            Graph.yLabel(arg).draw();
            break;
        case "xSecondaryObj":
            Graph.xLabelSecondary(arg).draw();
            break;
        case "ySecondaryObj":
            Graph.yLabelSecondary(arg).draw();
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

    Graph.axisDomain(domain).draw();
}

function changeAxisColor(e){
    const target = document.querySelector("#colorTo").value;
    const color = e.target.value;
    switch(target){
        case "All":
            Graph.axisColor({axis:color}).draw();
            break;
        case "xAxis":
            Graph.axisColor({xAxis:color}).draw();
            break;
        case "yAxis":
            Graph.axisColor({yAxis:color}).draw();
            break;
        case "xBase":
            Graph.axisColor({base:{x:color}}).draw();
            break;
        case "yBase":
            Graph.axisColor({base:{y:color}}).draw();
            break;
        case "xTick":
            Graph.axisColor({tick:{x:color}}).draw();
            break;
        case "yTick":
            Graph.axisColor({tick:{y:color}}).draw();
            break;
        case "xText":
            Graph.axisColor({text:{x:color}}).draw();
            break;
        case "yText":
            Graph.axisColor({text:{y:color}}).draw();
            break;
    }
}

function changeAxisOpacity(e){
    const target = document.querySelector("#opacityTo").value;
    const opacity = e.target.value;
    switch(target){
        case "All":
            Graph.axisOpacity({axis:opacity}).draw();
            break;
        case "xAxis":
            Graph.axisOpacity({xAxis:opacity}).draw();
            break;
        case "yAxis":
            Graph.axisOpacity({yAxis:opacity}).draw();
            break;
        case "xBase":
            Graph.axisOpacity({base:{x:opacity}}).draw();
            break;
        case "yBase":
            Graph.axisOpacity({base:{y:opacity}}).draw();
            break;
        case "xTick":
            Graph.axisOpacity({tick:{x:opacity}}).draw();
            break;
        case "yTick":
            Graph.axisOpacity({tick:{y:opacity}}).draw();
            break;
        case "xText":
            Graph.axisOpacity({text:{x:opacity}}).draw();
            break;
        case "yText":
            Graph.axisOpacity({text:{y:opacity}}).draw();
            break;
    }
}

function changeUnits(e){
    const axis = e.target.id;
    const unit = e.target.value;

    switch(axis){
        case "xUnits":
            Graph.axisUnits({x:unit}).draw();
            break;
        
        case "yUnits":
            Graph.axisUnits({y:unit}).draw();
            break;
    }
}

function changeAxisWidth(e){
    const target = document.querySelector("#widthTo").value;
    const value = e.target.value;

    switch(target){
        case "xBase":
            Graph.axisBase({x:{width:value}}).draw();
            break;

        case "yBase":
            Graph.axisBase({y:{width:value}}).draw();
            break;

        case "xTicks":
            Graph.axisTicks({x:{width:value}}).draw();
            break;

        case "yTicks":
            Graph.axisTicks({y:{width:value}}).draw();
            break;
    }
}

function changeTickSize(e){
    const target = e.target.id;
    const value = parseFloat(e.target.value);

    if(target === "xTickSize")
        Graph.axisTicks({x:{size:value}}).draw();
    if(target === "yTickSize")
        Graph.axisTicks({y:{size:value}}).draw();
}

function changeTickFont(e){
    const target = document.querySelector("#tickFontFor").value;
    const font = e.target.value;

    if(target === "x")
        Graph.axisText({x:{font}}).draw();
    if(target === "y")
        Graph.axisText({y:{font}}).draw();
}

function changeAxisTextSize(e){
    const size = `${e.target.value}px`;
    const target = e.target.id;

    if(target === "xTextSize")
        Graph.axisText({x:{size}}).draw();
    if(target === "yTextSize")
        Graph.axisText({y:{size}}).draw();
}

function changeAxisDynamic(e){
    const target = e.target.id;
    const checked = e.target.checked;

    switch(target){
        case "xDynamic":
            Graph.axisDynamic({x:{dynamic:checked}}).draw();
            break;
            
        case "yDynamic":
            Graph.axisDynamic({y:{dynamic:checked}}).draw();
            break;
            
        case "xContained":
            Graph.axisDynamic({x:{contained:checked}}).draw();
            break;
            
        case "yContained":
            Graph.axisDynamic({y:{contained:checked}}).draw();
            break;
    }
}

function changeMargin(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    switch(target){
        case "marginStart":
            Graph.margin({x:{start:value}}).draw();
            break;
            
        case "marginEnd":
            Graph.margin({x:{end:value}}).draw();
            break;
                
        case "marginTop":
            Graph.margin({y:{end:value}}).draw();
            break;
        
        case "marginBottom":
            Graph.margin({y:{start:value}}).draw();
            break;

    }
}

function changeTicks(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "xTicks")
        Graph.axisTicks({x:{ticks:value===-1?"auto":value}}).draw();
    if(target === "yTicks")
        Graph.axisTicks({y:{ticks:value===-1?"auto":value}}).draw();
}

function changeSpacing(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "xSpacing")
        Graph.axisTicks({x:{minSpacing : value}}).draw();
    if(target === "ySpacing")
        Graph.axisTicks({y:{minSpacing : value}}).draw();
}

function changeAxisPosition(e){
    const position = e.target.value;
    Graph.axisPosition(position).draw();
}

function changePriority(e){
    const target = e.target.id;
    const value = e.target.checked;
console.log(target, value);
    if(target === "xPriority" && value)
        Graph.axisOverlap({priority:"x"}).draw();
    if(target === "yPriority" && value)
        Graph.axisOverlap({priority:"y"}).draw();
}

function changeOverlap(e){
    const target = e.target.id;
    const value = e.target.checked;

    if(target === "xOverlap")
        Graph.axisOverlap({x:value}).draw();
    if(target === "yOverlap")
        Graph.axisOverlap({y:value}).draw();
}

function enableGrid(e){
    const target = e.target.id;
    const value = e.target.checked;

    switch(target){
        case "xPrimaryGrid":
            Graph.primaryGrid({x:{enable:value}}).draw();
            break;
        
        case "yPrimaryGrid":
            Graph.primaryGrid({y:{enable:value}}).draw();
            break;
        
        case "xSecondaryGrid":
            Graph.secondaryGrid({x:{enable:value}}).draw();
            break;
        
        case "ySecondaryGrid":
            Graph.secondaryGrid({y:{enable:value}}).draw();
            break;
        
    }
}

function changeGridColor(e){
    const target = document.querySelector("#gridTarget").value;
    const color = e.target.value;

    switch(target){
        case "all":
            Graph.gridColor({grid:color}).draw();
            break;
            
        case "primary":
            Graph.gridColor({primary:color}).draw();
            break;

        case "secondary":
            Graph.gridColor({secondary:color}).draw();
            break;

        case "xPrimary":
            Graph.gridColor({x:{primary:color}}).draw();
            break;

        case "yPrimary":
            Graph.gridColor({y:{primary:color}}).draw();
            break;
 
        case "xSecondary":
            Graph.gridColor({x:{secondary:color}}).draw();
            break;

        case "ySecondary":
            Graph.gridColor({y:{secondary:color}}).draw();
            break;
 
    }
}

function changeGridOpacity(e){
    const target = document.querySelector("#gridTarget").value;
    const value = parseFloat(e.target.value);

    switch(target){
        case "all":
            Graph.gridOpacity({grid:value}).draw();
            break;
            
        case "primary":
            Graph.gridOpacity({primary:value}).draw();
            break;

        case "secondary":
            Graph.gridOpacity({secondary:value}).draw();
            break;

        case "xPrimary":
            Graph.gridOpacity({x:{primary:value}}).draw();
            break;

        case "yPrimary":
            Graph.gridOpacity({y:{primary:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.gridOpacity({x:{secondary:value}}).draw();
            break;

        case "ySecondary":
            Graph.gridOpacity({y:{secondary:value}}).draw();
            break;
 
    }
}

function changeGridWidth(e){
    const target = document.querySelector("#gridTarget").value;
    const value = parseInt(e.target.value);

    switch(target){
        case "all":
            Graph.gridWidth({grid:value}).draw();
            break;
            
        case "primary":
            Graph.gridWidth({primary:value}).draw();
            break;

        case "secondary":
            Graph.gridWidth({secondary:value}).draw();
            break;

        case "xPrimary":
            Graph.gridWidth({x:{primary:value}}).draw();
            break;

        case "yPrimary":
            Graph.gridWidth({y:{primary:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.gridWidth({x:{secondary:value}}).draw();
            break;

        case "ySecondary":
            Graph.gridWidth({y:{secondary:value}}).draw();
            break;
 
    }
}

function changeGridStyle(e){
    const target = document.querySelector("#gridTarget").value;
    const value = e.target.value;

    switch(target){
        case "all":
            Graph.gridStyle({grid:value}).draw();
            break;
            
        case "primary":
            Graph.gridStyle({primary:value}).draw();
            break;

        case "secondary":
            Graph.gridStyle({secondary:value}).draw();
            break;

        case "xPrimary":
            Graph.gridStyle({x:{primary:value}}).draw();
            break;

        case "yPrimary":
            Graph.gridStyle({y:{primary:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.gridStyle({x:{secondary:value}}).draw();
            break;

        case "ySecondary":
            Graph.gridStyle({y:{secondary:value}}).draw();
            break;
    }
}

function changeGridDensity(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    value = value>-1?value:"auto";
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{density:value}}).draw();
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{density:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{density:value}}).draw();
            break;

        case "ySecondary":
            Graph.secondaryGrid({y:{density:value}}).draw();
            break;
    }
}

function changeGridSpacing(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{minSpacing:value}}).draw();
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{minSpacing:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{minSpacing:value}}).draw();
            break;

        case "ySecondary":
            Graph.secondaryGrid({x:{minSpacing:value}}).draw();
            break;
    }
}

function changeGridMaxDensity(e){
    const target = document.querySelector("#gridTarget").value;
    let value = parseInt(e.target.value);
    
    switch(target){
        case "all":
            Graph.secondaryGrid({grid:{maxDensity:value}}).draw();
            break;

        case "secondary":
            Graph.secondaryGrid({grid:{maxDensity:value}}).draw();
            break;
 
        case "xSecondary":
            Graph.secondaryGrid({x:{maxDensity:value}}).draw();
            break;

        case "ySecondary":
            Graph.secondaryGrid({x:{maxDensity:value}}).draw();
            break;
    }
}

function enableSecondaryAxis(e){
    const target = e.target.id;
    const checked = e.target.checked;

    if(target === "enableSecondaryX")
        Graph.secondaryAxisEnable({x:checked}).draw();
    if(target === "enableSecondaryY")
        Graph.secondaryAxisEnable({y:checked}).draw();
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

    Graph.secondaryAxisDomain(secondaryDomain).draw();
}

function changeSecondaryAxisColor(e){
    const target = document.querySelector("#colorToSecondary").value;
    const color = e.target.value;
    switch(target){
        case "All":
            Graph.secondaryAxisColor({axis:color}).draw();
            break;
        case "xAxis":
            Graph.secondaryAxisColor({xAxis:color}).draw();
            break;
        case "yAxis":
            Graph.secondaryAxisColor({yAxis:color}).draw();
            break;
        case "xBase":
            Graph.secondaryAxisColor({base:{x:color}}).draw();
            break;
        case "yBase":
            Graph.secondaryAxisColor({base:{y:color}}).draw();
            break;
        case "xTick":
            Graph.secondaryAxisColor({tick:{x:color}}).draw();
            break;
        case "yTick":
            Graph.secondaryAxisColor({tick:{y:color}}).draw();
            break;
        case "xText":
            Graph.secondaryAxisColor({text:{x:color}}).draw();
            break;
        case "yText":
            Graph.secondaryAxisColor({text:{y:color}}).draw();
            break;
    }
}

function changeSecondaryAxisOpacity(e){
    const target = document.querySelector("#opacityToSecondary").value;
    const opacity = e.target.value;
    switch(target){
        case "All":
            Graph.secondaryAxisOpacity({axis:opacity}).draw();
            break;
        case "xAxis":
            Graph.secondaryAxisOpacity({xAxis:opacity}).draw();
            break;
        case "yAxis":
            Graph.secondaryAxisOpacity({yAxis:opacity}).draw();
            break;
        case "xBase":
            Graph.secondaryAxisOpacity({base:{x:opacity}}).draw();
            break;
        case "yBase":
            Graph.secondaryAxisOpacity({base:{y:opacity}}).draw();
            break;
        case "xTick":
            Graph.secondaryAxisOpacity({tick:{x:opacity}}).draw();
            break;
        case "yTick":
            Graph.secondaryAxisOpacity({tick:{y:opacity}}).draw();
            break;
        case "xText":
            Graph.secondaryAxisOpacity({text:{x:opacity}}).draw();
            break;
        case "yText":
            Graph.secondaryAxisOpacity({text:{y:opacity}}).draw();
            break;
    }
}

function changeSecondaryUnits(e){
    const axis = e.target.id;
    const unit = e.target.value;

    switch(axis){
        case "secondaryXUnits":
            Graph.secondaryAxisUnits({x:unit}).draw();
            break;
        
        case "secondaryYUnits":
            Graph.secondaryAxisUnits({y:unit}).draw();
            break;
    }
}

function changeSecondaryAxisWidth(e){
    const target = document.querySelector("#widthToSecondary").value;
    const value = e.target.value;

    switch(target){
        case "xBase":
            Graph.secondaryAxisBase({x:{width:value}}).draw();
            break;

        case "yBase":
            Graph.secondaryAxisBase({y:{width:value}}).draw();
            break;

        case "xTicks":
            Graph.secondaryAxisTicks({x:{width:value}}).draw();
            break;

        case "yTicks":
            Graph.secondaryAxisTicks({y:{width:value}}).draw();
            break;
    }
}

function changeSecondaryTickSize(e){
    const target = e.target.id;
    const value = parseFloat(e.target.value);

    if(target === "secondaryXTickSize")
        Graph.secondaryAxisTicks({x:{size:value}}).draw();
    if(target === "secondaryYTickSize")
        Graph.secondaryAxisTicks({y:{size:value}}).draw();
}

function changeSecondaryTickFont(e){
    const target = document.querySelector("#tickFontForSecondary").value;
    const font = e.target.value;

    if(target === "x")
        Graph.secondaryAxisText({x:{font}}).draw();
    if(target === "y")
        Graph.secondaryAxisText({y:{font}}).draw();
}

function changeSecondaryAxisTextSize(e){
    const size = `${e.target.value}px`;
    const target = e.target.id;

    if(target === "secondaryXTextSize")
        Graph.secondaryAxisText({x:{size}}).draw();
    if(target === "secondaryYTextSize")
        Graph.secondaryAxisText({y:{size}}).draw();
}

function changeSecondaryTicks(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "secondaryXTicks")
        Graph.secondaryAxisTicks({x:{ticks:value===-1?"auto":value}}).draw();
    if(target === "secondaryYTicks")
        Graph.secondaryAxisTicks({y:{ticks:value===-1?"auto":value}}).draw();
}

function changeSecondarySpacing(e){
    const target = e.target.id;
    const value = parseInt(e.target.value);

    if(target === "secondaryXSpacing")
        Graph.secondaryAxisTicks({x:{minSpacing : value}}).draw();
    if(target === "secondaryYSpacing")
        Graph.secondaryAxisTicks({y:{minSpacing : value}}).draw();
}

function changePolarGrid(e){
    const value = parseInt(e.target.value);
    Graph.polarGrid(value).draw();
}

function changeAxisType(e){
    const type = e.target.value;
    Graph.axisType(type).draw();
}

function changeSecondaryAxisType(e){
    const target = document.querySelector("#secondaryXAxisType").checked?"x":"y";
    const type = e.target.value;

    if(target === "x")
        Graph.secondaryAxisType({x:type}).draw();
    if(target === "y")
        Graph.secondaryAxisType({y:type}).draw();
}

function changeAspectRatio(){
    const ratio = parseFloat(document.querySelector("#aspectRatio").value);
    const anchor = parseFloat(document.querySelector("#anchor").value);
    const target = document.querySelector("#target").value;
    const sourse = document.querySelector("#sourse").value;

    Graph.aspectRatio({ratio, anchor, target, sourse}).draw();
}

function changePointerMove(){
    const target = document.querySelector("#pointerMove").checked ? "move" : "zoom"
    const enable = document.querySelector("#pointerEnable").checked;
    const pointerCapture = document.querySelector("#pointerCapture").checked;
    const delay = parseInt(document.querySelector("#pointerDelay").value);
    const defaultCursor = document.querySelector("#defaultCursor").value;
    const hoverCursor = document.querySelector("#hoverCursor").value;
    const moveCursor = document.querySelector("#moveCursor").value;
    const strength = parseFloat(document.querySelector("#pointerStrength").value);
    const anchor = document.querySelector("#pointerAnchor").value;
    const background = document.querySelector("#pointerBackgroundColor").value;
    const borderColor = document.querySelector("#pointerBorderColor").value;
    const opacity = document.querySelector("#pointerBackgroundOpacity").value;
    const borderOpacity = document.querySelector("#pointerBorderOpacity").value;
    const borderWidth = document.querySelector("#pointerWidth").value;
    const type = document.querySelector("#pointerZoomType").value;

    if(target === "move")
        Graph.pointerMove({enable, delay, pointerCapture, defaultCursor, hoverCursor, moveCursor});
    if(target === "zoom")
        Graph.pointerZoom({enable, pointerCapture, delay, defaultCursor, hoverCursor, moveCursor, type, anchor, strength, rect:{background, borderColor, borderOpacity, borderWidth, opacity}});
}

function changeResizeEvent(){
    const enable = document.querySelector("#resizeEnable").checked;
    const preserveAspectRatio = document.querySelector("#resizePreserve").checked;
    const delay = parseFloat(document.querySelector("#resizeDelay").value);
    const anchorX = parseFloat(document.querySelector("#resizeAnchorX").value);
    const anchorY = parseFloat(document.querySelector("#resizeAnchorY").value);

    Graph.containerResize({enable, preserveAspectRatio, delay, anchor:[anchorX,anchorY]});
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
    document.querySelector("#aspectRatio").addEventListener("input", changeAspectRatio);
    document.querySelector("#anchor").addEventListener("input", changeAspectRatio);
    document.querySelector("#sourse").addEventListener("change", changeAspectRatio);
    document.querySelector("#target").addEventListener("change", changeAspectRatio);
    document.querySelector("#pointerEnable").addEventListener("change", changePointerMove);
    document.querySelector("#pointerCapture").addEventListener("change", changePointerMove);
    document.querySelector("#pointerDelay").addEventListener("input", changePointerMove);
    document.querySelector("#defaultCursor").addEventListener("input", changePointerMove);
    document.querySelector("#hoverCursor").addEventListener("input", changePointerMove);
    document.querySelector("#moveCursor").addEventListener("input", changePointerMove);
    document.querySelector("#pointerStrength").addEventListener("input", changePointerMove);
    document.querySelector("#pointerAnchor").addEventListener("change", changePointerMove);
    document.querySelector("#pointerBackgroundColor").addEventListener("input", changePointerMove);
    document.querySelector("#pointerBackgroundOpacity").addEventListener("input", changePointerMove);
    document.querySelector("#pointerBorderColor").addEventListener("input", changePointerMove);
    document.querySelector("#pointerBorderOpacity").addEventListener("input", changePointerMove);
    document.querySelector("#pointerZoomType").addEventListener("change", changePointerMove);
    document.querySelector("#pointerWidth").addEventListener("input", changePointerMove);
    document.querySelector("#resizeEnable").addEventListener("change", changeResizeEvent);
    document.querySelector("#resizePreserve").addEventListener("change", changeResizeEvent);
    document.querySelector("#resizeDelay").addEventListener("input", changeResizeEvent);
    document.querySelector("#resizeAnchorX").addEventListener("input", changeResizeEvent);
    document.querySelector("#resizeAnchorY").addEventListener("input", changeResizeEvent);
}
main();