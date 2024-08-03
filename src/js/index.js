import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ThurstonsSphere from './ThurstonsSphere';

import Ground from './scene/objects/Ground';
import Lights from './scene/objects/Lights';
import Scene from './scene/components/Scene';
import BackgroundMusic from './scene/components/BackgroundMusic';

import backgroundMusicFile from '../BackgroundMusic.mp3';
import { setupGuiControls } from './gui';
import { getCamera } from './scene/components/camera';

// set up the scene
var sceneObject = new Scene();
var scene = sceneObject.getScene(); 

const thurstonsSphere = new ThurstonsSphere({u_count: 20, v_count: 20});
thurstonsSphere.addToScene(scene);

const groundObject = new Ground(scene);
new Lights(scene);

const camera = getCamera(); 

// set up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const backgroundMusic  = new BackgroundMusic(camera);
backgroundMusic.loadSound(backgroundMusicFile);

// set up the orbit controls
new OrbitControls(camera, renderer.domElement);

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
