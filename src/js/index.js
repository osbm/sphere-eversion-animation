import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import ThurstonsSphere from './ThurstonsSphere';

import Ground from './scene/objects/Ground';
import Lights from './scene/objects/Lights';
import Scene from './scene/components/Scene';

// set up the scene
var sceneObject = new Scene();
var scene = sceneObject.getScene(); 

const backgoundParameters = {
    backgroundColor: 0x34254d,
    fogAmount: 0.55, 
    floorColor: 0xa17e24,
    showFloor: true
}
// // set up the light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(10, 10, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add( ambientLight );

const thurstonsSphere = new ThurstonsSphere({u_count: 20, v_count: 20});
thurstonsSphere.addToScene(scene);

const ground = new Ground(scene);
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

// set up the orbit controls
var orbit_controls = new OrbitControls(camera, renderer.domElement);

// set up the gui for setting the parameters
const gui = new GUI();

const guiTimeFolder = gui.addFolder('Time')
guiTimeFolder.add(thurstonsSphere.parameters, 'time', 0.0, 1.0).step(0.001).listen();
guiTimeFolder.add(thurstonsSphere.parameters, 'speed', 0.0, 150).step(0.1);
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

const guiMaterialFolder = gui.addFolder('Sphere Material');
guiMaterialFolder.add(thurstonsSphere.parameters, 'material_opacity', 0, 1).onChange(() => thurstonsSphere.updateSphereMaterial());
guiMaterialFolder.add(thurstonsSphere.parameters, 'flatShading').onChange(() => thurstonsSphere.updateSphereMaterial());
guiMaterialFolder.add(thurstonsSphere.parameters, 'show_wireframe').onChange(() => thurstonsSphere.updateSphereMaterial());
guiMaterialFolder.open();

const guiSphereColors = guiMaterialFolder.addFolder('Colors'); 

guiSphereColors.addColor(thurstonsSphere.parameters, 'inner_sphere_color').onChange(() => thurstonsSphere.updateSphereMaterial());
guiSphereColors.addColor(thurstonsSphere.parameters, 'outer_sphere_color').onChange(() => thurstonsSphere.updateSphereMaterial());
guiSphereColors.addColor(thurstonsSphere.parameters, 'wireframe_color').onChange(() => thurstonsSphere.updateSphereMaterial());

guiSphereColors.open();

const backgroundFolder = gui.addFolder('Background');
backgroundFolder.addColor(backgoundParameters, 'backgroundColor').onChange(( newColor ) => { sceneObject.updateBackground(newColor, backgoundParameters.fogAmount) })
backgroundFolder.add(backgoundParameters, 'fogAmount', 0, 10).step(0.01).onChange(( newFogAmount ) => { sceneObject.updateBackground(backgoundParameters.backgroundColor, newFogAmount) })
backgroundFolder.addColor(backgoundParameters, 'floorColor').onChange(( newColor ) => { ground.changeColor(newColor) })
backgroundFolder.add(backgoundParameters, 'showFloor').onChange((newDisplayFlag) => { ground.toggleShowGround(newDisplayFlag) });

backgroundFolder.open();

gui.close();


// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);
    thurstonsSphere.animationTick();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
