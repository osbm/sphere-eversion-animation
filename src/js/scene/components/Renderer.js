import * as THREE from 'three';

export class Renderer {
    constructor(animationLoop) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.setClearColor(0x000000);
        //this.renderer.setAnimationLoop( animationLoop );
        document.body.appendChild( this.renderer.domElement );
    }

    getRenderer() {
        return this.renderer; 
    }

}