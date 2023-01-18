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
        font : "",
        color : "#000000",
        opacity : 1,
        filled : true,
        position : "start",
        enable : false    
    }
}

function toggleLabel(e){
    const target = labels[`${e.target.className.split(" ")[0]}`];
    target.enable = e.target.checked;
    Graph.title(target);
}

function changeLabelText(e){
    const target = labels[`${e.target.className.split(" ")[0]}`];
    const text =  e.target.value;
    target.text = text;
    Graph.title(target);
}

function toggleLabelFilled(e){
    const target = labels[`${e.target.className.split(" ")[0]}`];
    target.filled = e.target.checked;
    Graph.title(target);
}




//---------------------------------------------

function main(){
    document.querySelector("#bgcolor").addEventListener("input", changeBackgroundColor);
    document.querySelector("#bgopacity").addEventListener("input", changeOpacity);
    document.querySelector("#enableTitle").addEventListener("change", toggleLabel);
    document.querySelector("#title").addEventListener("input", changeLabelText);
    document.querySelector("#fillTitle").addEventListener("change", toggleLabelFilled);
}

main();