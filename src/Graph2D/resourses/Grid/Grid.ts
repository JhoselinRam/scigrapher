import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Grid, Grid_Modifier, Grid_Property } from "./Grid_Types";
import PrimaryGrid from "./Primary/Grid_Primary.js";
import SecondaryGrid from "./Secondary/Grid_Secondary.js";

function Grid(props : Method_Generator) : Grid {
    const primaryGrid = PrimaryGrid({...props, getMinMaxCoords});
    const secondaryGrid = SecondaryGrid({...props, getMinMaxCoords});

//----------------- Draw ----------------------

    function draw(){
        const [xMin, xMax, yMin, yMax] = getMinMaxCoords();
        primaryGrid.draw(xMin, xMax, yMin, yMax);
        secondaryGrid.draw(xMin, xMax, yMin, yMax);
        
    }

//---------------------------------------------
//----------- Get Min Max Coords --------------

function getMinMaxCoords() : [number, number, number, number]{
    let xStart = 0;
    let xEnd = props.state.context.clientRect.width;
    let yStart = 0;
    let yEnd = props.state.context.clientRect.height;
    const secondaryXEnabled = props.state.axisObj.secondary.height>0? 1 : 0;
    const secondaryYEnabled = props.state.axisObj.secondary.width>0? 1 : 0;

    switch(props.state.axis.position){
        case "bottom-left":
            xStart = props.state.margin.x.start + props.state.axisObj.primary.width;
            xEnd = xEnd - secondaryYEnabled*(props.state.margin.x.end + props.state.axisObj.secondary.width);
            yStart = secondaryXEnabled*(props.state.margin.y.end + props.state.axisObj.secondary.height);
            yEnd = yEnd - props.state.margin.y.start - props.state.axisObj.primary.height;
            break;

        case "bottom-right":
            xStart = secondaryYEnabled*(props.state.margin.x.start + props.state.axisObj.secondary.width);
            xEnd = xEnd - props.state.margin.x.end - props.state.axisObj.primary.width;
            yStart = secondaryXEnabled*(props.state.margin.y.end + props.state.axisObj.secondary.height);
            yEnd = yEnd - props.state.margin.y.start - props.state.axisObj.primary.height;
            break;
        
        case "top-left":
            xStart = props.state.margin.x.start + props.state.axisObj.primary.width;
            xEnd = xEnd - secondaryYEnabled*(props.state.margin.x.end + props.state.axisObj.secondary.width);
            yStart = props.state.margin.y.end + props.state.axisObj.primary.height;
            yEnd = yEnd - secondaryXEnabled*(props.state.margin.y.start + props.state.axisObj.secondary.height);

            break;

        case "top-right":
            xStart = secondaryYEnabled*(props.state.margin.x.start + props.state.axisObj.secondary.width);
            xEnd = xEnd - props.state.margin.x.end - props.state.axisObj.primary.width;
            yStart = props.state.margin.y.end + props.state.axisObj.primary.height;
            yEnd = yEnd - secondaryXEnabled*(props.state.margin.y.start + props.state.axisObj.secondary.height);
            break;
    }

    return [xStart, xEnd, yStart, yEnd];
}

//---------------------------------------------

















//---------- Customization Methods ------------
//----------------- Color ---------------------

    function gridColor(color : Grid_Modifier<string>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function gridColor(arg : void) : Grid_Property<string>;
    function gridColor(color : Grid_Modifier<string> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Grid_Property<string> | undefined{
        if(typeof color === "undefined" && callback == null)
            return {
                x : {
                    primary : props.state.grid.primary.x.color,
                    secondary : props.state.grid.secondary.x.color
                },
                y : {
                    primary : props.state.grid.primary.y.color,
                    secondary : props.state.grid.secondary.y.color
                }
            }

        if(typeof color === "object"){
            if(color.grid === null && color.primary===null && color.secondary===null && color.x===null && color.y===null) return props.graphHandler;

            if(color.grid != null){
                props.state.grid.primary.x.color = color.grid;
                props.state.grid.primary.y.color = color.grid;
                props.state.grid.secondary.x.color = color.grid;
                props.state.grid.secondary.y.color = color.grid;
            }
            if(color.primary != null){
                props.state.grid.primary.x.color = color.primary;
                props.state.grid.primary.y.color = color.primary;
            }
            if(color.secondary != null){
                props.state.grid.secondary.x.color = color.secondary;
                props.state.grid.secondary.y.color = color.secondary;
            }
            if(color.x?.primary != null) props.state.grid.primary.x.color = color.x.primary;
            if(color.y?.primary != null) props.state.grid.primary.y.color = color.y.primary;
            if(color.x?.secondary != null) props.state.grid.secondary.x.color = color.x.secondary;
            if(color.y?.secondary != null) props.state.grid.secondary.y.color = color.y.secondary;



            if(callback != null) callback(props.graphHandler);
            props.state.dirty.client = true;

            return props.graphHandler;
        }
    }

//---------------------------------------------
//---------------- Opacity --------------------

    function gridOpacity(opacity : Grid_Modifier<number>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function gridOpacity(arg : void) : Grid_Property<number>;
    function gridOpacity(opacity : Grid_Modifier<number> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Grid_Property<number> | undefined{
        if(typeof opacity === "undefined" && callback == null)
            return {
                x : {
                    primary : props.state.grid.primary.x.opacity,
                    secondary : props.state.grid.secondary.x.opacity
                },
                y : {
                    primary : props.state.grid.primary.y.opacity,
                    secondary : props.state.grid.secondary.y.opacity
                }
            }

        if(typeof opacity === "object"){
            if(opacity.grid === null && opacity.primary===null && opacity.secondary===null && opacity.x===null && opacity.y===null) return props.graphHandler;

            if(opacity.grid != null){
                const newOpacity = opacity.grid<0?0:(opacity.grid>1?1:opacity.grid);
                props.state.grid.primary.x.opacity = newOpacity;
                props.state.grid.primary.y.opacity = newOpacity;
                props.state.grid.secondary.x.opacity = newOpacity;
                props.state.grid.secondary.y.opacity = newOpacity;
            }
            if(opacity.primary != null){
                const newOpacity = opacity.primary<0?0:(opacity.primary>1?1:opacity.primary);
                props.state.grid.primary.x.opacity = newOpacity;
                props.state.grid.primary.y.opacity = newOpacity;
            }
            if(opacity.secondary != null){
                const newOpacity = opacity.secondary<0?0:(opacity.secondary>1?1:opacity.secondary);
                props.state.grid.secondary.x.opacity = newOpacity;
                props.state.grid.secondary.y.opacity = newOpacity;
            }
            if(opacity.x?.primary != null) props.state.grid.primary.x.opacity = opacity.x.primary<0?0:(opacity.x.primary>1?1:opacity.x.primary);
            if(opacity.x?.secondary != null) props.state.grid.secondary.x.opacity = opacity.x.secondary<0?0:(opacity.x.secondary>1?1:opacity.x.secondary);
            if(opacity.y?.primary != null) props.state.grid.primary.y.opacity = opacity.y.primary<0?0:(opacity.y.primary>1?1:opacity.y.primary);
            if(opacity.y?.secondary != null) props.state.grid.secondary.y.opacity = opacity.y.secondary<0?0:(opacity.y.secondary>1?1:opacity.y.secondary);
            


            if(callback != null) callback(props.graphHandler);
            props.state.dirty.client = true;

            return props.graphHandler;
        }
    }

//---------------------------------------------
//----------------- Style ---------------------

function gridStyle(style : Grid_Modifier<string>, callback?:(handler?:Graph2D)=>void) : Graph2D;
function gridStyle(arg : void) : Grid_Property<string>;
function gridStyle(style : Grid_Modifier<string> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Grid_Property<string> | undefined{
    if(typeof style === "undefined" && callback == null)
        return {
            x : {
                primary : props.state.grid.primary.x.style,
                secondary : props.state.grid.secondary.x.style
            },
            y : {
                primary : props.state.grid.primary.y.style,
                secondary : props.state.grid.secondary.y.style
            }
        }

    if(typeof style === "object"){
        if(style.grid === null && style.primary===null && style.secondary===null && style.x===null && style.y===null) return props.graphHandler;

        if(style.grid != null){
            props.state.grid.primary.x.style = style.grid;
            props.state.grid.primary.y.style = style.grid;
            props.state.grid.secondary.x.style = style.grid;
            props.state.grid.secondary.y.style = style.grid;
        }
        if(style.primary != null){
            props.state.grid.primary.x.style = style.primary;
            props.state.grid.primary.y.style = style.primary;
        }
        if(style.secondary != null){
            props.state.grid.secondary.x.style = style.secondary;
            props.state.grid.secondary.y.style = style.secondary;
        }
        if(style.x?.primary != null) props.state.grid.primary.x.style = style.x.primary;
        if(style.y?.primary != null) props.state.grid.primary.y.style = style.y.primary;
        if(style.x?.secondary != null) props.state.grid.secondary.x.style = style.x.secondary;
        if(style.y?.secondary != null) props.state.grid.secondary.y.style = style.y.secondary;



        if(callback != null) callback(props.graphHandler);
        props.state.dirty.client = true;

        return props.graphHandler;
    }
}

//---------------------------------------------
//----------------- Width ---------------------

function gridWidth(width : Grid_Modifier<number>, callback?:(handler?:Graph2D)=>void) : Graph2D;
function gridWidth(arg : void) : Grid_Property<number>;
function gridWidth(width : Grid_Modifier<number> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Grid_Property<number> | undefined{
    if(typeof width === "undefined" && callback == null)
        return {
            x : {
                primary : props.state.grid.primary.x.width,
                secondary : props.state.grid.secondary.x.width
            },
            y : {
                primary : props.state.grid.primary.y.width,
                secondary : props.state.grid.secondary.y.width
            }
        }

    if(typeof width === "object"){
        if(width.grid === null && width.primary===null && width.secondary===null && width.x===null && width.y===null) return props.graphHandler;

        if(width.grid != null){
            props.state.grid.primary.x.width = width.grid;
            props.state.grid.primary.y.width = width.grid;
            props.state.grid.secondary.x.width = width.grid;
            props.state.grid.secondary.y.width = width.grid;
        }
        if(width.primary != null){
            props.state.grid.primary.x.width = width.primary;
            props.state.grid.primary.y.width = width.primary;
        }
        if(width.secondary != null){
            props.state.grid.secondary.x.width = width.secondary;
            props.state.grid.secondary.y.width = width.secondary;
        }
        if(width.x?.primary != null) props.state.grid.primary.x.width = width.x.primary;
        if(width.y?.primary != null) props.state.grid.primary.y.width = width.y.primary;
        if(width.x?.secondary != null) props.state.grid.secondary.x.width = width.x.secondary;
        if(width.y?.secondary != null) props.state.grid.secondary.y.width = width.y.secondary;


        if(callback != null) callback(props.graphHandler);
        props.state.dirty.client = true;

        return props.graphHandler;
    }
}

//---------------------------------------------
//---------------------------------------------

    function polarGrid(density : number, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function polarGrid(arg : void) : number;
    function polarGrid(density : number | void, callback?:(handler?:Graph2D)=>void) : Graph2D | number | undefined{
        if(typeof density === "undefined" && callback == null)
            return props.state.grid.polarGrid;

        if(typeof density === "number"){
            if(density === props.state.grid.polarGrid) return props.graphHandler;

            props.state.grid.polarGrid = density;


            if(callback != null) callback(props.graphHandler);
            props.state.dirty.client = true;
            
            return props.graphHandler;
        }
    }

//---------------------------------------------


    return {
        draw,
        gridColor,
        gridOpacity, 
        gridStyle,
        gridWidth,
        primaryGrid : primaryGrid.primaryGrid,
        secondaryGrid : secondaryGrid.secondaryGrid,
        polarGrid
    }

}

export default Grid;