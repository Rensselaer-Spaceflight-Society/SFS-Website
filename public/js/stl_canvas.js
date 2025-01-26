import * as THREE from "three";
import { STLLoader } from 'three/addons/loaders/STLLoader';
import { OrbitControls } from "three/examples/jsm/Addons.js";

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
    constructor(parent, h, w, model_name){
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
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
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(-7.5,0,-30);
        this.camera.lookAt(0,0,0);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
        
        this.scene.add(this.camera);
        
        parent.appendChild(this.renderer.domElement);
        
        this.loader = new STLLoader();

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( 5, 10, 7.5 );
        this.scene.add(dirLight);

        this.scene.add(this.controls);
        this.loader.load(`./assets/3d/${model_name}`, (geometry) => {

            let stl_material = new THREE.MeshPhysicalMaterial({
                color: 0xd3d3d3,
            });

            this.model = new THREE.Mesh(geometry, stl_material);

            this.scene.add(this.model);

            this.model.rotation.set(-Math.PI/2,0,0);
            this.model.position.set(5, 0, 0);
            this.renderer.setAnimationLoop(() => {

                // animation stuff here
                this.controls.update();

                this.renderer.render(this.scene, this.camera);  
            });

            this.renderer.render(this.scene, this.camera);

            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total*100) + `% loaded of model ${model_name}`);
            },
            (err) => {
                console.error(err);
            }
        );
    }
};

export { STLCanvas };