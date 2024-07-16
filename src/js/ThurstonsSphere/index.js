import * as THREE from 'three';
import { getGeometry } from "./getGeometry.js";
import { get_geometry_from_coordinates, complete_mirror } from "./geometryHelpers.js";

const defaultParameters = {
    
    pauseTime: false,
    time: 0.0,
    timeForward: true,
    speed: 15.0, 
    num_strips: 6,
    u_min: 0,
    u_max: 1,
    u_count: 12,
    v_min: 0,
    v_max: 1,
    v_count: 12,
    automaticRotation: false,
    material_opacity: 0.7,
    flatShading: false,
    show_wireframe: false,
    complete_mirror: true,
}

const SCALE = 0.1;

export default class ThurstonsSphere {

    constructor(parameters) {
        this.parameters = { ...defaultParameters, ...parameters }; 

        this.geometry = new THREE.SphereGeometry(1, 32, 32);

        this.inner_sphere = new THREE.Mesh(this.geometry);
        this.outer_sphere = new THREE.Mesh(this.geometryl);
        this.wireframe = new THREE.Mesh(this.geometry);

        this.updateSphereMaterial();
        this.updateSphereGeometry();

        this.inner_sphere.scale.setX(SCALE);
        this.inner_sphere.scale.setY(SCALE);
        this.inner_sphere.scale.setZ(SCALE);

        this.outer_sphere.scale.setX(SCALE);
        this.outer_sphere.scale.setY(SCALE);
        this.outer_sphere.scale.setZ(SCALE);

        this.wireframe.scale.setX(SCALE);
        this.wireframe.scale.setY(SCALE);
        this.wireframe.scale.setZ(SCALE);

        this.inner_sphere.rotation.x -= Math.PI / 4;
        this.outer_sphere.rotation.x -= Math.PI / 4;
        this.wireframe.rotation.x -= Math.PI / 4;    

        this.outer_sphere.castShadow = true;
        this.inner_sphere.castShadow = true;


    }

    addToScene(scene) {
        scene.add(this.inner_sphere);
        scene.add(this.outer_sphere);
        scene.add(this.wireframe);
    }

    updateSphereMaterial(){

        this.inner_sphere.material = new THREE.MeshPhongMaterial({
            color: 0xffd44e,
            side: THREE.FrontSide,
            transparent: true,
            opacity: this.parameters.material_opacity,
            flatShading: this.parameters.flatShading,
        });

        
        this.outer_sphere.material  = new THREE.MeshPhongMaterial({
            color: 0x931450,
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

        const { pauseTime, time, speed} = this.parameters;
        if(!pauseTime)
        {
            let { timeForward } = this.parameters;

            const timeDelta = (timeForward ? speed : -(speed)) * 0.0001;
            
            let newTime = time + timeDelta;
    
            if(newTime > 1.0){
                timeForward = false;
                newTime = 1.0;
            }
            if(newTime < 0.0){
                timeForward = true;
                newTime = 0.0; 
            }
            this.parameters.time = newTime; 
            this.parameters.timeForward = timeForward;
        }

        this.updateSphereMaterial();
        this.updateSphereGeometry();


        if (this.parameters.automaticRotation) {
            this.inner_sphere.rotation.y += 0.01;
            this.outer_sphere.rotation.y += 0.01;
            this.wireframe.rotation.y += 0.01;    
        }
    }
}