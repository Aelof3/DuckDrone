import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'cannon-es';
import DuckDroneShip from './DuckDroneShip.js';
import DuckDroneGUI from './DuckDroneGUI.js';
import DuckDroneLevelManager from './DuckDroneLevelManager.js';

export default class DuckDroneApp{
    constructor( settings ){
        this.ship = null;
        this.renderer = null;
        this.scene = null;
        this.light = null;
        this.camera = null;
        this.tempcamera = null;
        this.controls = null;
        this.world = null;
        this.gui = null;
        this.cameraPositionHelper = null;
        this.levelManager = null;
        this.settings = settings;
        this.time = new THREE.Clock;
        this.fixedTimeStep = 1.0 / 60.0; // seconds
        this.maxSubSteps = 3;
        this.setupComplete = false;
    }

    init( ) {

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.outputEncoding = THREE.LinearEncoding;

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        document.querySelector('.renderer').appendChild( this.renderer.domElement );

        // scene
        this.scene = new THREE.Scene();
        if ( this.settings.debug ) this.scene.background = new THREE.Color(0x220022);
        // camera
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.set( -125, 125, -250 );

        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix( );
        
        // controls
        this.tempcamera = this.camera.clone( );
            
        this.controls = new OrbitControls( this.tempcamera, this.renderer.domElement );
        this.controls.enableKeys = false;
        
        // ambient
        this.scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );
        
        // light
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light.position.set( 0, 350, 0 );
        this.light.castShadow = true;
        this.light.shadow.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.0001, 1000 );
        this.scene.add( this.light.shadow.camera );
        
        this.light.shadow.mapSize.width = 512;  // default
        this.light.shadow.mapSize.height = 512; // default


        this.scene.add( this.light );
        
        this.music = new Audio( './src/assets/sounds/rough3.mp3');
        this.music.loop = true;
        this.music.muted = !this.settings.music;
        this.musicOn = false;
        this.handleMusic( );

        this.setup( );
    }

    setupPhysics(){
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(this.settings.gravity.x, this.settings.gravity.y, this.settings.gravity.z); // m/s²
    }

    setupShip(){
        let data = {
            settings: this.settings,
            world: this.world,
            scene: this.scene
        }

        this.ship = new DuckDroneShip( data );
        
    }

    setupLevels( ){

        let data = {
            settings: this.settings,
            world: this.world,
            scene: this.scene
        }

        this.levelManager = new DuckDroneLevelManager( data );

    }

    setup( ){
        this.setupEventHandlers( );

        this.setupPhysics( );

        this.setupLevels( );

        this.setupShip( );
        
        this.setupCameraPositionHelper( );

        this.gui = new DuckDroneGUI( { ship: this.ship, settings: this.settings, levelManager: this.levelManager, musicOn: this.musicOn } );

        this.setupComplete = true;

    }

    setupEventHandlers( ){
        window.onkeypress = ( e )=>{
            if ( e.key === "+" ) this.handleMusic( );
        }
    }

    handleMusic( ){
        this.musicOn = !this.musicOn;
        ( this.musicOn ) ? this.music.play() : this.music.pause();
    }

    setupCameraPositionHelper( ){
        let hgeo = new THREE.BoxBufferGeometry( 0.1,0.1,0.1 );
        let hmat = new THREE.MeshPhongMaterial( {
            transparent: true,
            opacity: 0,
        });
        
        this.cameraPositionHelper = new THREE.Mesh( hgeo, hmat );
        this.scene.add( this.cameraPositionHelper );
        this.cameraPositionHelper.add( this.camera );
    }

    animate() {
        requestAnimationFrame( ()=>{this.animate()} );

        this.music.muted = !this.settings.music;

        if ( !this.setupComplete || window.DuckDroneMenuToggle ) return;

        this.gui.loop( { ship: this.ship, shipBody: this.ship.physicsBody, levelManager: this.levelManager, musicOn: this.musicOn } );

        this.camera.copy( this.tempcamera );
        this.controls.update( );

        this.world.step( this.fixedTimeStep, this.time.getDelta(), this.maxSubSteps );

        this.ship.loop( );

        this.levelManager.loop( );

        this.cameraPositionHelper.position.copy( this.ship.body.position );

        this.renderer.render( this.scene, this.camera );
        
        if ( this.settings.debug ) window.stats.update();
    }
}