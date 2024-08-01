import * as THREE from 'three';

export default class BackgroundMusic {
    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add( this.listener );
        this.sound = new THREE.Audio( this.listener );
        this.audioLoader = new THREE.AudioLoader();
    }

    loadSound(soundFile) {
        this.audioLoader.load( soundFile, (buffer) => {
            this.sound.setBuffer( buffer );
            this.sound.setLoop( true );
            this.sound.setVolume( 0.5 );
            this.sound.play();
        });
    }

    changeVolume(newVolume)
    {
        this.sound.setVolume(newVolume)
    }

    togglePlayPause(playFlag) {
        if(playFlag) {
            this.sound.play();
        }
        else {
            this.sound.pause();
        }
    }

}
