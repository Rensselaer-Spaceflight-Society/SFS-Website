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
}

class ThreeParallax{
    constructor(parentDOM: HTMLElement){

        /*
        IMPORTANT NEED TO DEFINE PARTICLE COUNTS HERE
        this is like defining info and really important
        -------------------------------------------------
        */

        this.targetParticles = 1000;
        this.LERP_SPEED = 0.01;

        /*
        -------------------------------------------------
        */

        // globe animation stuff
        // this.animPath = new GlbPath();

        // container to attach the threejs canvas to- this will essentially determine
        // the dimensions of the the stuff
        this.container = parentDOM;
        this.dimesions = new THREE.Vector2(
            this.container.offsetWidth,
            this.container.offsetHeight,
        );

        this.spawn_plane = {
            position: new THREE.Vector3(0, 0, -50),
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

        let light = new THREE.AmbientLight("white", 0.3);

        this.scene.add(light);

        this.particles = new THREE.BufferGeometry();
        let positions = [];
        this.velocities = [];
        for(let i = 0; i < this.targetParticles; i++){
            // Random position within this.spawn_plane
            let x = Math.random() * this.spawn_plane.perp_radius - this.spawn_plane.perp_radius / 2;
            let y = Math.random() * this.spawn_plane.perp_radius - this.spawn_plane.perp_radius / 2;
            let z = Math.random() * this.spawn_plane.perp_radius;
            let pos_vec = new THREE.Vector3(x,y,z).add(this.spawn_plane.position);
            console.log(pos_vec)

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
        let pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, opacity: 0.3, map: sprite });

        let points = new THREE.Points(this.particles, pointsMaterial);
        this.camera.add(points);

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
            Update function for 3d model:
        --------------------------------------
        */

        let delta = document.scrollingElement?.scrollTop;

        // use path class



        /*
        --------------------------------------
        */

        this.particles.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera)
    }
}

export { ThreeParallax };