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

const titleObj = {
    text : "",
    font : "",
    color : "",
    opacity : 1,
    filled : true,
    position : "start",
    enabled : false
}

function toggleTitle(){
    titleObj.enabled = !titleObj.enabled;
    Graph.title(titleObj);
}

function changeTitle(e){
    const text =  e.target.value;
    titleObj.text = text;
    Graph.title(titleObj);
}




//---------------------------------------------

function main(){
    document.querySelector("#bgcolor").addEventListener("input", changeBackgroundColor);
    document.querySelector("#bgopacity").addEventListener("input", changeOpacity);
    document.querySelector("#enableTitle").addEventListener("change", toggleTitle);
    document.querySelector("#title").addEventListener("input", changeTitle);
}

main();