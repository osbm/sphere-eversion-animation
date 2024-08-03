import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ThurstonsSphere from './ThurstonsSphere';

import Ground from './scene/objects/Ground';
import Lights from './scene/objects/Lights';
import Scene from './scene/components/Scene';
import BackgroundMusic from './scene/components/BackgroundMusic';

import backgroundMusicFile from '../BackgroundMusic.mp3';
import { setupGuiControls } from './gui';

// set up the scene
var sceneObject = new Scene();
var scene = sceneObject.getScene(); 

// // set up the light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(10, 10, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add( ambientLight );

const thurstonsSphere = new ThurstonsSphere({u_count: 20, v_count: 20});
thurstonsSphere.addToScene(scene);

const groundObject = new Ground(scene);
const lights = new Lights(scene);

// set up the camera
var camera = new THREE.PerspectiveCamera(
    75, // fov = field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.001, // this is the near clipping plane
    1000 // this is the far clipping plane
);
camera.position.z = 0.25;
camera.position.x = 0.25;
camera.position.y = 0.10;

// set up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const backgroundMusic  = new BackgroundMusic(camera);
backgroundMusic.loadSound(backgroundMusicFile);

console.log('Test logging!')

// set up the orbit controls
var orbit_controls = new OrbitControls(camera, renderer.domElement);

setupGuiControls({
    thurstonsSphere,
    backgroundMusic, 
    sceneObject,
    groundObject,
});

// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);
    thurstonsSphere.animationTick();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
