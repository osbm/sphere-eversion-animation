import * as THREE from 'three';

export default class  {
    constructor(scene){
        this.hemiLight = new THREE.HemisphereLight( 0x8d7c7c, 0x494966, 3 );
        scene.add( this.hemiLight );

        this.spotLight = new THREE.SpotLight();
        this.spotLight.intensity = 7;
        this.spotLight.angle = Math.PI / 16;
        this.spotLight.penumbra = 0.5;
        this.spotLight.castShadow = true;
        this.spotLight.position.set( - 1, 1, 1 );
        scene.add( this.spotLight );
    }
}
