import * as THREE from "three";
import { GLTFLoader } from "three/addons/Addons.js";

class STLCanvas{
    /*
    -----TYPING-----
    parent; HTMLElement,
    h: number,
    w: number,
    model_name:
    string,
    animate_model: Function(model: THREE.Mesh) => void
    */
    constructor(parent, h, w, model_name, animate_model){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(
            w,
            h
        );
        this.camera = new THREE.PerspectiveCamera(
            70,
            w/h,
            0.1,
            1000
        );
        this.scene = new THREE.Scene();

        this.scene.add(this.camera);

        parent.appendChild(this.renderer.domElement);  
        
        this.loader = new GLTFLoader();
        this.loader.load(`./assets/3d/${model_name}`, (loader_data) => {

            this.model = loader_data.scene;

            this.scene.add(this.model);

            this.renderer.setAnimationLoop(() => {

                // animation stuff here
                animate_model(this.model);

                this.renderer.render(this.scene, this.camera);  
            });

            this.renderer.render(this.scene, this.camera);

            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total*100) + `% loaded of model ${model_name}`);
            },
            (err) => {
                console.error(`Error %d.`, err.code);
            }
        );
    }
};

export { STLCanvas };