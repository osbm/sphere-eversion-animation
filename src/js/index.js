import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import { getGeometry } from "./ThurstonsSphere/getGeometry.js";

// set up the scene
var scene = new THREE.Scene();


// set up the gui for setting the parameters
const gui = new GUI();
var obj = {
    pauseTime: true,
    time: 0.5,
    num_strips: 8,
    u_min: 0,
    u_max: 1,
    u_count: 12,
    v_min: 0,
    v_max: 1,
    v_count: 12,
    automaticRotation: false,
    material_opacity: 0.7,
    flatShading: false,
    show_wireframe: true,
    complete_mirror: true,

}

gui.add(obj, 'time', 0, 1).listen();
gui.add(obj, 'pauseTime');
gui.add(obj, 'num_strips', 1, 20).step(1);
gui.add(obj, 'u_min', 0, 1).step(0.01);
gui.add(obj, 'u_max', 0, 1).step(0.01);
gui.add(obj, 'u_count', 1, 100).step(1);
gui.add(obj, 'v_min', 0, 1).step(0.01);
gui.add(obj, 'v_max', 0, 1).step(0.01);
gui.add(obj, 'v_count', 1, 100).step(1);
gui.add(obj, 'material_opacity', 0, 1);
gui.add(obj, 'flatShading');
gui.add(obj, 'show_wireframe');
gui.add(obj, 'automaticRotation');
gui.add(obj, 'complete_mirror');




// set scene background color to rgb(20, 25, 40)
scene.background = new THREE.Color(0x141928);

// // set up the light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(10, 10, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add( ambientLight );


// set up the camera
var camera = new THREE.PerspectiveCamera(
    75, // fov = field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // this is the near clipping plane
    1000 // this is the far clipping plane
);

// set up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// set up the orbit controls
var orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;


// add a plane with color and outline
var geometry = new THREE.SphereGeometry(1, 32, 32);
var front_material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    // wireframe: true,
    side: THREE.FrontSide,
    transparent: true,
    opacity: obj.material_opacity,
    // flatShading: false,
});

var back_material = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    // wireframe: true,
    side: THREE.BackSide,
    transparent: true,
    opacity: obj.material_opacity,
    // flatShading: false,
});

var wireframe_material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    opacity: 0.1,
    transparent: true,
    side: THREE.DoubleSide,
});

var inner_sphere = new THREE.Mesh(geometry, back_material);
var outer_sphere = new THREE.Mesh(geometry, front_material);
var wireframe = new THREE.Mesh(geometry, wireframe_material);


scene.add(inner_sphere);
scene.add(outer_sphere);
scene.add(wireframe);


camera.position.z = 3;


function get_geometry_from_coordinates(coordinates) {
    var geometry = new THREE.BufferGeometry();

    var indices = [];
    var v_count = obj.v_count;
    var u_count = obj.u_count;
    for (var i = 0; i < u_count; i++) {
        for (var j = 0; j < v_count; j++) {
            var index = i * (v_count +1) + j;
            indices.push(index, index + 1, index + v_count+1);
            indices.push(index + v_count+1, index + 1, index + v_count+1 + 1);
        }
    }
    coordinates = coordinates.map(coord => [coord.x, coord.y, coord.z]).flat()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3))
    geometry.setIndex(indices);
    return geometry;
}


function complete_mirror(geometry) {
    // first mirror the geometry 
    var geometry_clone = geometry.clone();
    // geometry_clone.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
    // instead of mirroring, jusr rotate the geometry by 180 degrees
    geometry_clone.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));

    // merge the two geometries
    var merged = BufferGeometryUtils.mergeGeometries([geometry, geometry_clone]);
    
    // now i have apple slice of the sphere. I just need to copy rotate it by some angle and merge it with the original geometry
    var angle = 2 * Math.PI / obj.num_strips;

    var num_rotataions = obj.num_strips - 1;
    var rotated_geometry = merged.clone();
    for (var i = 0; i < num_rotataions; i++) {
        rotated_geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(angle));
        merged = BufferGeometryUtils.mergeGeometries([merged, rotated_geometry]);
    }

    return merged;
}

// Create a simple animation loop
function animate() {
    requestAnimationFrame(animate);

    var time;
    if (obj.pauseTime == false) {
        time = Math.sin( Date.now() / 1500 ) / 2 + 0.5;
        obj.time = time;
    } 
    else {
        time = obj.time;
    }

    var coordinates = getGeometry(
        time,
        obj.num_strips,
        obj.u_min,
        obj.u_max,
        obj.u_count,
        obj.v_min,
        obj.v_max,
        obj.v_count
    );
    var geometry = get_geometry_from_coordinates(coordinates);
    if (obj.complete_mirror) {
        geometry = complete_mirror(geometry);
    }
    geometry.computeVertexNormals();


    var front_material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        // wireframe: true,
        side: THREE.FrontSide,
        transparent: true,
        opacity: obj.material_opacity,
        flatShading: obj.flatShading,
    });
    
    var back_material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        // wireframe: true,
        side: THREE.BackSide,
        transparent: true,
        opacity: obj.material_opacity,
        flatShading: obj.flatShading,
    });

    var wireframe_material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        opacity: obj.show_wireframe ? 1 : 0,
        transparent: true,
        side: THREE.DoubleSide,
    });

    inner_sphere.material = back_material;
    outer_sphere.material = front_material;
    wireframe.material = wireframe_material;



    inner_sphere.geometry = geometry;
    outer_sphere.geometry = geometry;
    wireframe.geometry = geometry;


    if (obj.automaticRotation) {
        // // Rotate the cube
        inner_sphere.rotation.y += 0.01;
        outer_sphere.rotation.y += 0.01;
        wireframe.rotation.y += 0.01;    
    }
    
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
