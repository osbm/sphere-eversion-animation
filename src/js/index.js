import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
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
//const dummy = { dummyProp : 0};

//const dummyController = gui.add(dummy, 'dummyProp', 0.0, 1);

const guiTimeFolder = gui.addFolder('Time')
guiTimeFolder.add(thurstonsSphere.parameters, 'time', 0.0, 1.0).listen();
guiTimeFolder.add(thurstonsSphere.parameters, 'speed', 1, 150).step(1);
guiTimeFolder.add(thurstonsSphere.parameters, 'pauseTime');
guiTimeFolder.add(thurstonsSphere.parameters, 'automaticRotation');
guiTimeFolder.open();

const guiAlgorithm = gui.addFolder('Algorithm')
guiAlgorithm.add(thurstonsSphere.parameters, 'num_strips', 1, 20).step(1);
guiAlgorithm.open();

const guiDetail = gui.addFolder('Detail');
guiDetail.add(thurstonsSphere.parameters, 'u_count', 1, 100).step(1);
guiDetail.add(thurstonsSphere.parameters, 'v_count', 1, 100).step(1);
guiDetail.open();

const guiRender = gui.addFolder('Render');
guiRender.add(thurstonsSphere.parameters, 'u_min', 0, 1).step(0.01);
guiRender.add(thurstonsSphere.parameters, 'u_max', 0, 1).step(0.01);
guiRender.add(thurstonsSphere.parameters, 'v_min', 0, 1).step(0.01);
guiRender.add(thurstonsSphere.parameters, 'v_max', 0, 1).step(0.01);
guiRender.add(thurstonsSphere.parameters, 'complete_mirror');
guiRender.open();

const guiMaterialFolder = gui.addFolder('Material');
guiMaterialFolder.add(thurstonsSphere.parameters, 'material_opacity', 0, 1);
guiMaterialFolder.add(thurstonsSphere.parameters, 'flatShading');
guiMaterialFolder.add(thurstonsSphere.parameters, 'show_wireframe');
guiMaterialFolder.open();


// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);
    thurstonsSphere.animationTick();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
