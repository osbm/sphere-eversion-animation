import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

import { getGeometry } from './getGeometry.js';
// var result = getGeometry(0.0)
// console.log(result.length);
// console.log(result);
var scene = new THREE.Scene();
const gui = new GUI();


var obj = {
    pauseTime: true,
    time: 0,
}

gui.add(obj, 'time', 0, 1).listen();
gui.add(obj, 'pauseTime')

// set scene background color to rgb(20, 25, 40)
scene.background = new THREE.Color(0x141928);


const light = new THREE.PointLight(0xffffff, 10)
light.position.set(10, 10, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );


var camera = new THREE.PerspectiveCamera(
    75, // fov = field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // this is the near clipping plane
    1000 // this is the far clipping plane
);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;


// add a plane with color and outline
var geometry = new THREE.SphereGeometry(1, 32, 32);
var front_material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    // wireframe: true,
    side: THREE.FrontSide,
    opacity: 0.5,
});

var back_material = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    // wireframe: true,
    side: THREE.BackSide,
    opacity: 0.5,
});

var wireframe_material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    wireframe: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    // opacity: 0.5,
});

var inner_sphere = new THREE.Mesh(geometry, back_material);
var outer_sphere = new THREE.Mesh(geometry, front_material);
var wireframe = new THREE.Mesh(geometry, wireframe_material);


scene.add(inner_sphere);
scene.add(outer_sphere);
scene.add(wireframe);


camera.position.z = 5;

// var sphere_geometry = inner_sphere.geometry.getAttribute('position');
// console.log(sphere_geometry.array);

// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);

    var coordinates = getGeometry(obj.time);

    var polyshape = new THREE.Shape(coordinates.map((coord) => {
        return new THREE.Vector2(coord.x, coord.y);
    }));

    var geometry = new THREE.ShapeGeometry(polyshape);

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates.map(coord => [coord.x, coord.y, coord.z]).flat(), 3))



    inner_sphere.geometry = geometry;
    outer_sphere.geometry = geometry;
    wireframe.geometry = geometry;


    // Rotate the cube
    inner_sphere.rotation.y += 0.01;
    outer_sphere.rotation.y += 0.01;
    wireframe.rotation.y += 0.01;
    
    if (obj.pauseTime == false) {
        obj.time = (obj.time + 0.005) % 1;
    }

    renderer.render(scene, camera);
}

// Start the animation loop
animate();
