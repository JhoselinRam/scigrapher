import { Graph2D } from "../../../../Graph2D/Graph2D_Types";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Draw_Data_Callback, Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_State, Vector_Property_Generator } from "../../Vector_Field_Types";

export interface Draw_Vector {
    drawData : Draw_Data_Callback
}

export interface Vector_Draw_Dynamic {
    context : CanvasRenderingContext2D,
    dataState : Vector_Field_State,
    dataHandler : Vector_Field,
    graphHandler : Graph2D,
    meshX : Field_Property<number>,
    meshY : Field_Property<number>,
    dataX : Field_Property<number>,
    dataY : Field_Property<number>,
    xScale : Mapping,
    yScale : Mapping,
    scale : number,
    normalized : boolean,
    maxLenght : number
}

export interface Vector_Draw_Static extends Omit<Vector_Draw_Dynamic, "dataState" | "dataHandler" | "graphHandler"> {
    color : string,
    opacity : number,
    style : string,
    width : number
}

export interface Get_Scale {
    meshX : Field_Property<number>,
    meshY : Field_Property<number>,
    dataX : Field_Property<number>,
    dataY : Field_Property<number>,
    maxLength : number,
    xScale : Mapping,
    yScale : Mapping,
}

export interface Vector_Extract_Property<T> {
    vectorX : number, 
    vectorY : number, 
    positionX : number, 
    positionY : number, 
    i : number, 
    j : number, 
    valuesX : Field_Property<number>, 
    valuesY : Field_Property<number>, 
    meshX : Field_Property<number>, 
    meshY : Field_Property<number>, 
    dataHandler : Vector_Field, 
    graphHandler : Graph2D,
    container : Vector_Property_Generator<T>
}