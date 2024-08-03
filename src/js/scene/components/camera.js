import * as THREE from 'three';

let camera = null; 

export function getCamera()
{
    if(camera) { 
        return camera; 
    }

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        0.001, 
        1000
    );
    camera.position.z = 0.25;
    camera.position.x = 0.25;
    camera.position.y = 0.10;
    return camera;
    
}



