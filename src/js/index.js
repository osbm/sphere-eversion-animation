import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import ThurstonsSphere from './ThurstonsSphere';

// set up the scene
var scene = new THREE.Scene();

// set scene background color to rgb(20, 25, 40)
scene.background = new THREE.Color(0x141928);

// // set up the light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(10, 10, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add( ambientLight );

const thurstonsSphere = new ThurstonsSphere();
thurstonsSphere.addToScene(scene);

// set up the camera
var camera = new THREE.PerspectiveCamera(
    75, // fov = field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // this is the near clipping plane
    1000 // this is the far clipping plane
);
camera.position.z = 3;

// set up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set up the orbit controls
var orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;

// set up the gui for setting the parameters
const gui = new GUI();
gui.add(thurstonsSphere.parameters, 'time', 0, 1).listen();
gui.add(thurstonsSphere.parameters, 'num_strips', 1, 20).step(1);
gui.add(thurstonsSphere.parameters, 'u_min', 0, 1).step(0.01);
gui.add(thurstonsSphere.parameters, 'u_max', 0, 1).step(0.01);
gui.add(thurstonsSphere.parameters, 'u_count', 1, 100).step(1);
gui.add(thurstonsSphere.parameters, 'v_min', 0, 1).step(0.01);
gui.add(thurstonsSphere.parameters, 'v_max', 0, 1).step(0.01);
gui.add(thurstonsSphere.parameters, 'v_count', 1, 100).step(1);
gui.add(thurstonsSphere.parameters, 'material_opacity', 0, 1);
gui.add(thurstonsSphere.parameters, 'flatShading');
gui.add(thurstonsSphere.parameters, 'show_wireframe');
gui.add(thurstonsSphere.parameters, 'automaticRotation');
gui.add(thurstonsSphere.parameters, 'complete_mirror');
gui.add(thurstonsSphere.parameters, 'pauseTime');


// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);
    thurstonsSphere.animationTick();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
