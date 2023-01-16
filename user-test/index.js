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





//---------------------------------------------

function main(){
    document.querySelector("#bgcolor").addEventListener("input", changeBackgroundColor);
    document.querySelector("#bgopacity").addEventListener("input", changeOpacity);
}

main();