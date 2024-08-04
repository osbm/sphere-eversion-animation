import * as THREE from 'three';

export default class {
    constructor(scene){

        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry( 100, 100),
            new THREE.MeshPhongMaterial( { color: 0xa17e24, specular: 0x101010 } )
        );
        this.plane.rotation.x = - Math.PI / 2;
        this.plane.position.y = -0.15;
        this.plane.receiveShadow = true;
        scene.add( this.plane );


        this.largePlane = new THREE.Mesh(
            new THREE.PlaneGeometry( 10000, 10000),
            new THREE.MeshPhongMaterial( { color: 0xa17e24, specular: 0x101010 } )
        );
        this.largePlane.rotation.x = - Math.PI / 2;
        this.largePlane.position.y = -0.18;
        this.largePlane.receiveShadow = false;
        scene.add( this.largePlane );

    }

    changeColor(newColor){
        this.plane.material.dispose();
        this.plane.material  = new THREE.MeshPhongMaterial({ color: newColor, specular: 0x101010 });

        this.largePlane.material.dispose();
        this.largePlane.material  = new THREE.MeshPhongMaterial({ color: newColor, specular: 0x101010 });
    }

    toggleShowGround(showGround){
        this.plane.visible = showGround;
        this.largePlane.visible = showGround;
    }
}
