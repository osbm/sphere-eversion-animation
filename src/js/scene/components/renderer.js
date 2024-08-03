import * as THREE from 'three';

let renderer = null; 

export function getRenderer( animationLoop )
{
    if(renderer) { 
        return renderer; 
    }
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000);
    renderer.setAnimationLoop( animationLoop );
    document.body.appendChild( renderer.domElement );
    return renderer;
}


