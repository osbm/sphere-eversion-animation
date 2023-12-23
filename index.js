import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();

// set scene background color to rgb(20, 25, 40)
scene.background = new THREE.Color(0x141928);

var camera = new THREE.PerspectiveCamera(
    75, // fov = field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // this is the near clipping plane
    1000 // this is the far clipping plane
);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// var geometry = new THREE.BoxGeometry();
// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// add a plane with color and outline
var geometry = new THREE.PlaneGeometry(5, 5, 5);
var green = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
    opacity: 0.5,
});

var blue = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: false,
    opacity: 0.5,
});


var plane1 = new THREE.Mesh(geometry, green);


// now add another plane that is blue and is exactly the same as the first plane but rotated 180 degrees so that it looks like 1 plane that is blue on one side and green on the other
var plane2 = new THREE.Mesh(geometry, blue);


plane2.rotation.y = Math.PI;



scene.add(plane1);
scene.add(plane2);


camera.position.z = 5;

// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    plane1.rotation.y += 0.01;
    plane2.rotation.y += 0.01;
    

    renderer.render(scene, camera);
}

// Start the animation loop
animate();
