import { Graph2D } from "../dist/lib/index.js";
const Graph = Graph2D(document.querySelector(".graph"));

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

    Graph.domain(domain);
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
}

main();