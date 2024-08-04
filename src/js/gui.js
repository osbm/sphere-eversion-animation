import { showModal } from './infoModal';
import { GUI } from 'lil-gui';

const aboutInfo = {
    About(){
        showModal(); 
    }
}

const audioParameters = {
    musicOn: false,
    musicVolume: 0.5
}

const backgoundParameters = {
    backgroundColor: 0x34254d,
    fogAmount: 0.55, 
    floorColor: 0xa17e24,
    showFloor: true
}

export const setupGuiControls = ({
    thurstonsSphere,
    backgroundMusic, 
    sceneObject,
    groundObject,
}) => {
    // set up the gui for setting the parameters
    const gui = new GUI({ title: 'Menu'});

    gui.add(aboutInfo, 'About');

    const guiMusicFolder = gui.addFolder('Background Music')

    guiMusicFolder.add(audioParameters, 'musicOn').onChange( newFlag => { backgroundMusic.togglePlayPause(newFlag); });
    guiMusicFolder.add(audioParameters, 'musicVolume', 0.0, 1.0).step(0.1).onChange( newValue => { backgroundMusic.changeVolume(newValue); });

    guiMusicFolder.open()

    const guiTimeFolder = gui.addFolder('Time')
    guiTimeFolder.add(thurstonsSphere.parameters, 'time', 0.0, 1.0).step(0.001).listen();
    guiTimeFolder.add(thurstonsSphere.parameters, 'speed', 0.0, 500).step(0.1);
    guiTimeFolder.add(thurstonsSphere.parameters, 'pauseTime');
    guiTimeFolder.add(thurstonsSphere.parameters, 'automaticRotation');
    guiTimeFolder.open();

    const guiAlgorithm = gui.addFolder('Algorithm')
    guiAlgorithm.add(thurstonsSphere.parameters, 'num_strips', 1, 20).step(1);
    guiAlgorithm.open();

    const guiDetail = gui.addFolder('Detail');
    guiDetail.add(thurstonsSphere.parameters, 'u_count', 1, 100).step(1);
    guiDetail.add(thurstonsSphere.parameters, 'v_count', 1, 100).step(1);
    guiDetail.open();

    const guiRender = gui.addFolder('Render');
    guiRender.add(thurstonsSphere.parameters, 'u_min', 0, 1).step(0.01);
    guiRender.add(thurstonsSphere.parameters, 'u_max', 0, 1).step(0.01);
    guiRender.add(thurstonsSphere.parameters, 'v_min', 0, 1).step(0.01);
    guiRender.add(thurstonsSphere.parameters, 'v_max', 0, 1).step(0.01);
    guiRender.add(thurstonsSphere.parameters, 'complete_mirror');
    guiRender.open();

    const guiMaterialFolder = gui.addFolder('Sphere Material');
    guiMaterialFolder.add(thurstonsSphere.parameters, 'material_opacity', 0, 1).onChange(() => thurstonsSphere.updateSphereMaterial());
    guiMaterialFolder.add(thurstonsSphere.parameters, 'flatShading').onChange(() => thurstonsSphere.updateSphereMaterial());
    guiMaterialFolder.add(thurstonsSphere.parameters, 'show_wireframe').onChange(() => thurstonsSphere.updateSphereMaterial());
    guiMaterialFolder.open();

    const guiSphereColors = guiMaterialFolder.addFolder('Colors'); 

    guiSphereColors.addColor(thurstonsSphere.parameters, 'inner_sphere_color').onChange(() => thurstonsSphere.updateSphereMaterial());
    guiSphereColors.addColor(thurstonsSphere.parameters, 'outer_sphere_color').onChange(() => thurstonsSphere.updateSphereMaterial());
    guiSphereColors.addColor(thurstonsSphere.parameters, 'wireframe_color').onChange(() => thurstonsSphere.updateSphereMaterial());

    guiSphereColors.open();

    const backgroundFolder = gui.addFolder('Background');
    backgroundFolder.addColor(backgoundParameters, 'backgroundColor').onChange(( newColor ) => { sceneObject.updateBackground(newColor, backgoundParameters.fogAmount) })
    backgroundFolder.add(backgoundParameters, 'fogAmount', 0, 10).step(0.01).onChange(( newFogAmount ) => { sceneObject.updateBackground(backgoundParameters.backgroundColor, newFogAmount) })
    backgroundFolder.addColor(backgoundParameters, 'floorColor').onChange(( newColor ) => { groundObject.changeColor(newColor) })
    backgroundFolder.add(backgoundParameters, 'showFloor').onChange((newDisplayFlag) => { groundObject.toggleShowGround(newDisplayFlag) });

    backgroundFolder.open();

    gui.open();
}
;

