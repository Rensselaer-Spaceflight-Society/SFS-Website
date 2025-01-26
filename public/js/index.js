import { STLCanvas } from "./stl_canvas.js";

const STL_NAME = "Rover.stl";

// Three.js Mesh
function RoverAnimation(model){
    model.rotation.z += 0.05;
    model.rotation.x = -Math.PI/2;
}

function attachCanvas(elem){
    let stl_canvas = new STLCanvas(elem, 500, 500, STL_NAME, RoverAnimation);
}

let stl_canvas_main = document.getElementById("stl_canvas_main");

if(stl_canvas_main != null){
    attachCanvas(stl_canvas_main);
}