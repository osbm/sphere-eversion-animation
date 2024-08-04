import * as THREE from 'three';

export default class {
    constructor() {
        this.scene = new THREE.Scene();
        this.updateBackground(0x34254d, 0.55);
    }

    getScene() {
        return this.scene; 
    }

    updateBackground(newBackgroundColor, newFogAmount) {
        this.scene.background = new THREE.Color( newBackgroundColor );
        this.scene.fog = new THREE.FogExp2( newBackgroundColor, newFogAmount );
    }



} 


