import * as THREE from 'three';

export default class {
    constructor(scene){
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry( 16, 16 ),
            new THREE.MeshPhongMaterial( { color: 0xa17e24, specular: 0x101010 } )
        );
        this.plane.rotation.x = - Math.PI / 2;
        this.plane.position.y = -0.15;
        this.plane.receiveShadow = true;
        scene.add( this.plane );
    }
}
