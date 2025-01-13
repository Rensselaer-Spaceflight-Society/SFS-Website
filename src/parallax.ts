import * as THREE from "three";

/* 3d star graphic on main page, I call it a parallax because it's a responsive background
but it's more like just a 3d animation whose movement is dependent on scroll distance as well
as time elapsed. Additionally, it can rotate in a bunch of directions too */

interface ThreeParallax{

    targetParticles: number,
    particles: THREE.BufferGeometry,
    velocities: Array<THREE.Vector3Like>,
    container: HTMLElement,
    LERP_SPEED: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    dimesions: THREE.Vector2,
    earth: THREE.Mesh,
    infoCard: HTMLElement,
    /* this is the coordinate boundaries where the stars will spawn
    this will not be an actual plane, but just an imaginary representation */
    spawn_plane: {
        position: THREE.Vector3,
        // radius perpendicular to the x and y lines of symmetry
        perp_radius: number
    },
    // fog density - determines when stars fade out
    fog_value: number,
    camera: THREE.PerspectiveCamera,
    titleCard: HTMLElement,
}

class ThreeParallax{
    constructor(parentDOM: HTMLElement){

        /*
        IMPORTANT NEED TO DEFINE PARTICLE COUNTS HERE
        this is like defining info and really important
        -------------------------------------------------
        */

        this.targetParticles = 750;
        this.LERP_SPEED = 0.01;

        /*
        -------------------------------------------------
        */

        // container to attach the threejs canvas to- this will essentially determine
        // the dimensions of the the stuff
        this.container = parentDOM;
        this.dimesions = new THREE.Vector2(
            this.container.offsetWidth,
            this.container.offsetHeight,
        );

        this.spawn_plane = {
            position: new THREE.Vector3(0, 0, -100),
            perp_radius: 100,
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.dimesions.x, this.dimesions.y);
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("black");

        this.camera = new THREE.PerspectiveCamera(100, this.dimesions.x/this.dimesions.y, 0.1, 1000);
        this.camera.position.set(0,0,-10);
        this.camera.lookAt(0,0,0);

        this.scene.add(this.camera);

        // let light = new THREE.AmbientLight("white", 0.3);

        // this.scene.add(light);

        this.particles = new THREE.BufferGeometry();
        let positions = [];
        this.velocities = [];
        for(let i = 0; i < this.targetParticles; i++){
            // Random position within this.spawn_plane
            let x = Math.random() * this.spawn_plane.perp_radius - this.spawn_plane.perp_radius / 2;
            let y = Math.random() * this.spawn_plane.perp_radius - this.spawn_plane.perp_radius / 2;
            let z = Math.random() * this.spawn_plane.perp_radius + 50;
            let pos_vec = new THREE.Vector3(x,y,z).add(this.spawn_plane.position);

            let velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2, // x direction (random between -1 and 1)
                (Math.random() - 0.5) * 2, // y direction (random between -1 and 1)
                (Math.random() - 0.5) * 2  // z direction (random between -1 and 1)
            ).normalize();

            let speed = Math.random() * this.LERP_SPEED;
            velocity.multiplyScalar(speed);
            
            this.velocities.push(velocity);
            positions.push(pos_vec.x,pos_vec.y,pos_vec.z);
        }

        const sprite = new THREE.TextureLoader().load( '../assets/disc.png' );
		sprite.colorSpace = THREE.SRGBColorSpace;

        this.particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        let pointsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.25,
            opacity: 0.5,
            map: sprite,
            alphaTest: 0.1
        });

        let points = new THREE.Points(this.particles, pointsMaterial);
        this.camera.add(points);

        // globe animation stuff ------------------------------

        let loader = new THREE.TextureLoader();
        let albedoMap = loader.load("../assets/Albedo.jpg");
        let bumpMap = loader.load("../assets/Bump.jpg");
        albedoMap.colorSpace = THREE.SRGBColorSpace
        let earthGeo = new THREE.SphereGeometry(4, 64, 64)
        let earthMat = new THREE.MeshPhongMaterial({
          map: albedoMap,
          bumpMap: bumpMap,
          bumpScale: 0.01,
          shininess: 60,
        });
        this.earth = new THREE.Mesh(earthGeo, earthMat);
        this.earth.position.set(0,0,0);

        let LightForGlobe = new THREE.DirectionalLight(0xffffff, 2.0);
        LightForGlobe.position.set(0, 20, 0);
        LightForGlobe.lookAt(this.earth.position);
        this.camera.add(LightForGlobe);

        let cloudMap = loader.load("../assets/Clouds.png");
        let cloudsGeo = new THREE.SphereGeometry(4.1, 64, 64);
        let cloudsMat = new THREE.MeshStandardMaterial({
            alphaMap: cloudMap,
            transparent: true,
        });
        let clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
        this.earth.add(clouds);

        this.scene.add(this.earth);
        // ----------------------------------------------------

        this.titleCard = document.createElement("h3");
        this.titleCard.id = "canvasTitle"
        this.titleCard.classList.add("position-fixed");
        this.titleCard.innerText = "Rensselaer Spaceflight Society";
        this.container.appendChild(this.titleCard);

        this.infoCard = document.createElement("h5");
        this.infoCard.id = "canvasInfo"
        this.infoCard.classList.add("position-fixed");
        this.infoCard.innerText = "Some text/slogan here probably";
        this.container.appendChild(this.infoCard);

        this.renderer.setAnimationLoop(() => this._RAF());
    }

    _RAF = () => {

        let positions = this.particles.attributes.position.array;

        for (let i = 0; i < this.targetParticles; i++) {
            let idx = i * 3;
            
            // Update each position by adding the velocity vector
            positions[idx] += this.velocities[i].x;
            if(positions[idx] > 50 || positions[idx] < -50) positions[idx] = 0;
            positions[idx + 1] += this.velocities[i].y;
            if(positions[idx + 1] > 50 || positions[idx + 1] < -50) positions[idx + 1] = 0;
            positions[idx + 2] += this.velocities[i].z;
            if(positions[idx + 2] > 50 || positions[idx + 2] < -50) positions[idx + 2] = 0;
        }

        /*
            Update function for 3d model and camera:
        --------------------------------------
        */

        let delta = document.scrollingElement?.scrollTop;
        if(delta == undefined) delta = 0;

        this.earth.position.set(0, Math.min(Math.max(0, delta - window.innerHeight * 0.75), window.innerHeight * 0.75) * 0.02, 0);
        
        this.titleCard.style.right = `${Math.max(0, delta - 0.25 * window.innerHeight) * 0.2}rem`;
        this.infoCard.style.left = `${Math.max(0, delta - 0.25 * window.innerHeight) * 0.2}rem`;

        this.earth.rotation.set(0,0.01+delta * 0.001,0)
        /*
        --------------------------------------
        */

        this.particles.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera)
    }
}

export { ThreeParallax };