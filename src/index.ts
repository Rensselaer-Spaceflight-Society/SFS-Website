import { ThreeParallax } from "./parallax.js";

if(document.getElementById("parallaxContainer") == null){
    let tempContainer = new HTMLDivElement();
    tempContainer.id = "parallaxContainer";
    document.appendChild(tempContainer);
}

const ContainerGraphic = document.getElementById("parallaxContainer");

if(ContainerGraphic == null) throw Error("No container found for graphic.");

const MainGraphic = new ThreeParallax(ContainerGraphic);