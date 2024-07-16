import * as THREE from 'three';
import { getGeometry } from "./getGeometry.js";
import { get_geometry_from_coordinates, complete_mirror } from "./geometryHelpers.js";

const defaultParameters = {
    pauseTime: false,
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

export default class ThurstonsSphere {

    constructor(parameters) {
        this.parameters = { ...defaultParameters, ...parameters }; 

        this.geometry = new THREE.SphereGeometry(1, 32, 32);

        this.inner_sphere = new THREE.Mesh(this.geometry);
        this.outer_sphere = new THREE.Mesh(this.geometryl);
        this.wireframe = new THREE.Mesh(this.geometry);

        this.updateSphereMaterial();
        this.updateSphereGeometry();
    }

    addToScene(scene) {
        scene.add(this.inner_sphere);
        scene.add(this.outer_sphere);
        scene.add(this.wireframe);
    }

    updateSphereMaterial(){

        this.inner_sphere.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            side: THREE.FrontSide,
            transparent: true,
            opacity: this.parameters.material_opacity,
            flatShading: this.parameters.flatShading,
        });
        
        this.outer_sphere.material  = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            side: THREE.BackSide,
            transparent: true,
            opacity: this.parameters.material_opacity,
            flatShading: this.parameters.flatShading,
        });
    
        this.wireframe.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            opacity: this.parameters.show_wireframe ? 1 : 0,
            transparent: true,
            side: THREE.DoubleSide,
        });

    }

    updateSphereGeometry(){
        const coordinates = getGeometry(
            this.parameters.time,
            this.parameters.num_strips,
            this.parameters.u_min,
            this.parameters.u_max,
            this.parameters.u_count,
            this.parameters.v_min,
            this.parameters.v_max,
            this.parameters.v_count
        );
        let geometry = get_geometry_from_coordinates(coordinates, this.parameters);
        if (this.parameters.complete_mirror) {
            geometry = complete_mirror(geometry, this.parameters);
        }
        geometry.computeVertexNormals();

        this.inner_sphere.geometry = geometry;
        this.outer_sphere.geometry = geometry;
        this.wireframe.geometry = geometry;
    }

    animationTick(){
        let time;
        if (this.parameters.pauseTime == false) {
            time = Math.sin( Date.now() / 1500 ) / 2 + 0.5;
            this.parameters.time = time;
        } 
        else {
            time = this.parameters.time;
        }

        this.updateSphereMaterial();
        this.updateSphereGeometry();


        if (this.parameters.automaticRotation) {
            // // Rotate the cube
            this.inner_sphere.rotation.y += 0.01;
            this.outer_sphere.rotation.y += 0.01;
            this.wireframe.rotation.y += 0.01;    
        }
    }
}