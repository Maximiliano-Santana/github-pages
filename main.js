import './style.css';

import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import gsap from 'gsap';
import GUI from 'lil-gui';
import Stats from 'stats.js';


//Stats
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

//------------------------- Variables 

const rotationSpeed = 0.1;

const models = [
    {
        model: '4 side',
        url: '/models/tent4side.glb'
    },
]

const fabrics = [
    {
        name: '1',
    },
    {
        name: '2',
    },
    {
        name: '3',
    },
    {
        name: '4',
    },
    {
        name: '5',
    },
    {
        name: '6',
    },
    {
        name: '7',
    },
    {
        name: '8',
    },
    {
        name: '9',
    },
    {
        name: '10',
    },
]

const colors = [
    {
        name: 'Aquamarine',
        url: '/colors/com_aquamarine.png'
    },
    {
        name: 'Aussie Green',
        url: '/colors/com_aussie_green.png'
    },
    {
        name: 'Sanstone',
        url: '/colors/com_sandstone.png'
    },
    {
        name: 'Silver',
        url: '/colors/com_silver.png'
    },

]

//-------------------------------- Utils ----------------------------------------------------------
//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Resize

window.addEventListener('resize', ()=>{
    //Update Sizes 
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Update Material
});

//------------------------------ Loaders --------------------------------------------------

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

loadingManager.onLoad = ()=>{
    console.log(colors)
}

const metalMatcap = textureLoader.load('/textures/MetalMatcap2.jpg')
metalMatcap.flipY = true

let tentFourSide = null;
gltfLoader.load('/models/tent4side.glb', (gltf)=>{
    tentFourSide = gltf.scene
    for (const child of tentFourSide.children){
        if(child.name === 'pole_1' || child.name === 'pole_2' || child.name === 'pole_3' || child.name === 'pole_4'){
            child.material = new THREE.MeshMatcapMaterial({
                matcap: metalMatcap,
                roughness: 0,
            })
        } 
    }
    updateMaterials();

    scene.add(tentFourSide)
})

for (let i = 0 ; i < colors.length; i++){
    textureLoader.load(colors[i].url, (texture)=>{
        texture.generateMipmaps = true
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(25, 25);
        colors[i].texture = texture;
    })
}



//--------------------------------------------- Setup ----------------------------

//Scene 
const scene = new THREE.Scene();
// scene.fog = new THREE.Fog(new THREE.Color('#000000'), 1, 40);

//Camera 
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.01, 100);
camera.position.set(20, 30, 30);

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha:true,
    antialias: true,
}); 

renderer.setClearAlpha = 0;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const orbitControl = new OrbitControls(camera, canvas);
orbitControl.enableDamping = true;
renderer.setClearColor(new THREE.Color('white'))  

//-------------------------------------------- Objects


//--------------------------------------- Lil gui
const gui = new GUI();

const options = {};
let optionColorList = [];
for (const color of colors){
    optionColorList.push(color.name)
}

const colorsController = gui.add(options, 'Color', optionColorList);

colorsController.onChange((selectedOption) => {
    for (const color of colors){
        if(color.name === selectedOption){
            updateMaterials(color.texture);
        }
    }
});

let optionFabricList = [];
for (const fabric of fabrics){
    optionFabricList.push(fabric.name);
}

const fabricController = gui.add(options, 'Fabric', optionFabricList);


//-------------------------------------------- Animation ----------------------------------

//Animate

const clock = new THREE.Clock();
let previousTime = 0;

const tick = ()=>{
    stats.begin()

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //
    // tentFourSide. += elapsedTime;
    if(tentFourSide){
        tentFourSide.rotation.y += deltaTime*rotationSpeed;
    }

    //Update controls 
    orbitControl.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
    stats.end()
} 

console.timeEnd('Threejs')
tick();

//----------------------------------------- Functions
const updateMaterials = (map = null)=>{
    for (const child of tentFourSide.children){
        if(child.name == 'membrane_1_top'){
            child.material = new THREE.MeshBasicMaterial({
                map: map,
                side: THREE.DoubleSide,
                color: map ? 'white' : 'lightgray',
            });
        }
    }
}