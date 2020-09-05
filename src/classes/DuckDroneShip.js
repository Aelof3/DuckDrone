import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import DuckDroneShipEngine from './DuckDroneShipEngine.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class DuckDroneShip{

    constructor( data ){

        this.settings = data.settings;
        this.world = data.world;
        this.scene = data.scene;

        this.physicsBody = null;

        this.geometry = null;

        this.material = null;

        this.throttleOn = false;
        this.reverseToggle = false;

        this.shipBody = null;

        this.resetPosition = null;
        this.resetQuaternion = null;

        this.spaceship = null;
        this.rocketSoundOn = false;

        this.keys = this.settings.keys;
        
        // retrieve local stats, or start fresh
        this.duckViewedPage = parseInt(localStorage.duckViewedPage) || -1;
        this.resets = parseInt(localStorage.duckResets) || 0;
        this.duckTimer = new THREE.Clock;
        this.duckTimeSpent = parseInt(localStorage.duckTimeSpent) || 0;
        this.duckQuacks = parseInt(localStorage.duckQuacks) || 0;
        
        this.isReset = false;

        this.setupComplete = false;
        this.endGame = false;

        this.spaceToggle = false;
        this.engineGlow = null;
        
        this.raycasterY = null;

        this.wasd = {
            w:0,
            a:0,
            s:0,
            d:0
        }

        this.engines = [];
        this.init();
    }

    init( ){
        this.duckViewedPage ++;
        localStorage.duckViewedPage = this.duckViewedPage;
        this.material = new THREE.MeshPhongMaterial( {
            transparent: true,
            opacity: 0,
        });
        
        this.geometry = new THREE.BoxGeometry( this.settings.ship.bodyGeometry.x, this.settings.ship.bodyGeometry.y, this.settings.ship.bodyGeometry.z );

        this.body = new THREE.Mesh( this.geometry, this.material );
    
        if ( this.settings.rocketFire ){
            this.engineGlow = new THREE.SpotLight( 0xaaaaaa, 20, 100 );
            this.engineGlow.angle = Math.PI / 3;
            this.engineGlow.penumbra = 1;
            this.engineGlow.decay = 2;
            this.engineGlow.castShadow = false;
            this.engineGlow.receiveShadow = false;
            this.engineGlow.position.set( 0,-15,0);
            
            let engineGlowTarget = new THREE.Object3D();
            engineGlowTarget.position.set( 0,-35,0);
            this.body.add(engineGlowTarget);
            this.body.add(this.engineGlow);
            this.engineGlow.target = engineGlowTarget;
        }

        this.rocketAudio = new Audio(`./src/assets/sounds/rocket.mp3`)
        this.rocketAudio.loop = true;


        this.scene.add( this.body );
        
        this.scene.updateMatrixWorld( );

        let originVector = this.body.getWorldPosition( );
        let directionVectorY = new THREE.Vector3( this.body.matrixWorld.elements[4], this.body.matrixWorld.elements[5], this.body.matrixWorld.elements[6] );
        let directionVectorYn = new THREE.Vector3();
        directionVectorYn.copy( directionVectorY ).negate( );

        this.raycasterY = new THREE.Raycaster( originVector, directionVectorY, 0, 25 );
        this.raycasterYn = new THREE.Raycaster( originVector, directionVectorYn, 0, 25 );

        this.quackInterval = setInterval( ( )=>{
            this.quackHandler( );
        }, THREE.MathUtils.randInt(10000,20000) );

        this.setupEngines( );
        this.setupEventHandlers( );
        this.setupPhysics( );   
        this.setupDuck( );
        this.setupComplete = true;
    }

    quackHandler( ){
        // random quacks
        let x = THREE.MathUtils.randInt(1,4);
        let audio = new Audio(`./src/assets/sounds/duck${x}.mp3`)
        if ( this.settings.sound ) audio.play();
        this.duckQuacks ++;
        localStorage.duckQuacks = this.duckQuacks;
    }

    rocketSoundHandler( ){
        if ( this.spaceToggle && this.rocketAudio.paused && !this.rocketSoundOn ) {
            //console.log('rocketon')
            this.rocketSoundOn = true;
            if ( this.settings.sound ) this.rocketAudio.play();   
        } else if ( !this.spaceToggle && !this.rocketAudio.paused && this.rocketSoundOn ) {
            //console.log('rocketoff')
            this.rocketSoundOn = false;
            if ( this.settings.sound ) this.rocketAudio.pause();
        }
    }
    
    setupDuck( ){
        // load duck model
        let self = this;
        this.loader = new GLTFLoader( );
        this.loader.load( './src/assets/models/Duck.gltf', function( gltf ){
            self.duckObj = gltf;
            gltf.scene.scale.set( 20,20,20 );
            gltf.scene.traverse(function (obj) {
                if (obj.isMesh) {
                    obj.castShadow = true;
                } 
            });
            gltf.scene.position.set( 0,(-self.settings.ship.bodyGeometry.y / 2),0 );
            self.body.add( gltf.scene );
        } );
    }

    findIntersection( ){
        // check -y vector of duck for intersect with an endoflevel object
        let originVector = this.body.getWorldPosition( );
        let directionVectorY = new THREE.Vector3( this.body.matrixWorld.elements[4], this.body.matrixWorld.elements[5], this.body.matrixWorld.elements[6] );
        let directionVectorYn = new THREE.Vector3();
        directionVectorYn.copy( directionVectorY ).negate( );

        this.raycasterYn.set( originVector, directionVectorYn );

        for (let i=0;i<window.DuckDroneEndOfLevel.length;i++){
            let intersectYn = this.raycasterYn.intersectObject( window.DuckDroneEndOfLevel[i].body );
            if ( intersectYn.length > 0 ){
                this.setCheckpoint( window.DuckDroneEndOfLevel[i] );
                window.dispatchEvent( new CustomEvent( "loadLevel", { detail: { level: "next" } } ) );
            }
        }
    }

    setCheckpoint( platform ){
        let platPos = platform.body.getWorldPosition( );
        
        let pX = platPos.x;
        let pY = platPos.y + ( platform.dimensions.y / 2 ) + 20;
        let pZ = platPos.z;
        this.resetPosition.copy( new THREE.Vector3( pX, pY, pZ ) );
    }

    setCheckpointQuat( ){
        let platform = window.DuckDroneEndOfLevel[0];
        let platPos = platform.body.getWorldPosition( );
        
        let p1X = platPos.x;
        let p1Y = platPos.y;
        let p1Z = platPos.z;

        let o = new THREE.Object3D();
        o.position.copy( this.resetPosition );
        o.lookAt( p1X,p1Y,p1Z );
        o.rotateY( THREE.MathUtils.degToRad( -90 ) );
        this.resetQuaternion.copy( o.quaternion );
        this.reset( );
    }

    setupPhysics( ){
        this.physicsBody = new CANNON.Body({
            mass: 1, // kg
            position: new CANNON.Vec3( this.settings.ship.startPos.x, this.settings.ship.startPos.y, this.settings.ship.startPos.z), // m
            shape: new CANNON.Box( new CANNON.Vec3( this.settings.ship.bodyGeometry.x / 2, this.settings.ship.bodyGeometry.y / 2, this.settings.ship.bodyGeometry.z / 2 ) ),
            linearDamping: 0.1,
            angularDamping: 0.3,
            type: CANNON.Body.DYNAMIC,
            restitution:0 
        });
        this.world.addBody( this.physicsBody );

        this.resetPosition = this.physicsBody.initPosition;
        this.resetQuaternion = this.physicsBody.initQuaternion;
    }
    
    setupEventHandlers( ){
        
        window.addEventListener( 'keydown', ( e ) => {
            this.keyDownHandler( e.key.toLowerCase( ), e );
        }, false );
        window.addEventListener( 'keyup', ( e ) => {
            this.keyUpHandler( e.key.toLowerCase( ), e );
        }, false );
        window.addEventListener( "quacksalot", ( e )=>{
            if ( !this.endGame ){
                this.endGame = true;
                alert( 'the end... for now' );
            }
        }, false );
        window.addEventListener( "levelLoaded", ( e )=>{
            this.setCheckpointQuat( );
        }, false );
    }

    keyDownHandler( key, e ){
        for ( let i=0; i < this.engines.length; i++ ){
            if ( this.engines[i].key === key ) {
                e.preventDefault();
                if ( this.settings.ship.engines.mode === "throttle" ) {
                    this.engines[i].engineToggle( !this.engines[i].on );
                } else if ( this.settings.ship.engines.mode === "individual" ) { 
                    this.engines[i].engineToggle( true );
                } else if ( this.settings.ship.engines.mode === "individualtoggle" ) { 
                    this.engines[i].engineToggle( !this.engines[i].on );
                }
            }
        }
        if ( key === "arrowright" || key === "arrowleft" || key === "arrowdown" || key === "arrowup" || key === "]" ){
            this.debugHandler( key );
        }
        if ( key === " " ){
            this.spaceToggle = ( this.settings.ship.engines.mode === "throttle" ) ? !this.spaceToggle : true;

            for ( let i=0; i < this.engines.length; i++ ){
                if ( this.settings.ship.engines.mode === "throttle" ) {
                    this.engines[i].engineToggle( this.spaceToggle ); 
                }
                if ( this.settings.ship.engines.mode !== "throttle" ){
                    this.engines[i].engineToggle( true );
                }
            }
            this.rocketSoundHandler( );
        }
        if ( key === "backspace" ){
            e.preventDefault();
            this.isReset = true;
        }
        if ( key === "shift" ){
            if ( this.settings.ship.engines.mode === "throttle" ){
                this.throttleOn = !this.throttleOn; 
                this.toggleThrottle( this.throttleOn );
            }
        }
        if ( key === "control" ){
            this.reverseToggle = !this.reverseToggle;
        }
    }

    debugHandler( key ){
        if ( !this.settings.debug ) return;
        
        let velocity = 75;
        if ( key === "arrowup" ){
            this.physicsBody.velocity.x = velocity;
        }
        if ( key === "arrowdown" ){
            this.physicsBody.velocity.x = -velocity;
        }
        if ( key === "arrowleft" ){
            this.physicsBody.velocity.z = -velocity;
        }
        if ( key === "arrowright" ){
            this.physicsBody.velocity.z = velocity;
        }
        if ( key === "]" ){
            let p = new THREE.Vector3().copy( window.DuckDroneEndOfLevel[0].body.getWorldPosition() )
            p.y += window.DuckDroneEndOfLevel[0].dimensions.y / 2 + 25
            this.physicsBody.position.copy( p );
        }
        
        this.physicsBody.quaternion.copy( this.physicsBody.initQuaternion );
        this.physicsBody.angularVelocity.copy( this.physicsBody.initAngularVelocity );
    }

    keyUpHandler( key, e ){
        for ( let i=0; i < this.engines.length; i++ ){
            if ( this.engines[i].key === key && this.settings.ship.engines.mode !== "throttle" ) this.engines[i].engineToggle( false );
            if ( key === " " ){
                if ( this.settings.ship.engines.mode !== "throttle" && this.settings.ship.engines.mode !== "individualtoggle" ){ 
                    this.engines[i].engineToggle( false ); 
                } else if ( this.settings.ship.engines.mode !== "throttle" ){ 
                    this.engines[i].engineToggle( false ); 
                }
            }
        }

        if ( key === " " ){
            if ( this.settings.ship.engines.mode !== "throttle" ) {
                this.spaceToggle = false;
                this.rocketSoundHandler( );
            }
        }
    }

    setupEngines( ){
        
        let engineGeo = this.settings.ship.engineGeometry;

        for ( let i=0; i < this.keys.length; i++ ){
            let rowInterval = this.settings.ship.bodyGeometry.z / this.keys.length;

            let rowOffset = i * rowInterval + ( rowInterval / 2 ) - ( this.settings.ship.bodyGeometry.z / 2 );

            let keyInterval = this.settings.ship.bodyGeometry.x / this.keys[i].length;

            for ( let k=0; k < this.keys[i].length; k++ ){

                let keyOffset = k * keyInterval + ( keyInterval / 2 ) - ( this.settings.ship.bodyGeometry.x / 2 );

                let engineData = {
                    key: this.keys[i][k],
                    on: false,
                    color: this.settings.ship.color,
                    position: { x:keyOffset, y:(-this.settings.ship.bodyGeometry.y / 2 + 4), z: rowOffset },
                    geometry: { x:engineGeo.x, y:engineGeo.y, z:engineGeo.z },
                    settings: this.settings,
                    row: i
                }
                
                let engine = new DuckDroneShipEngine( engineData );

                this.engines.push( engine );

                this.body.add( engine.body );
            }
        }
    }

    toggleThrottle( toggleState ){
        this.throttleOn = toggleState;
    }

    reset( ){
        this.toggleThrottle( false );

        this.resets++;
        localStorage.duckResets = this.resets;

        this.reverseToggle = false;

        this.physicsBody.position.copy( this.resetPosition );
        this.physicsBody.quaternion.copy( this.resetQuaternion );

        this.physicsBody.velocity.copy( new CANNON.Vec3( 0, 0, 0 ) );
        this.physicsBody.angularVelocity.copy( this.physicsBody.initAngularVelocity );
        this.physicsBody.torque.copy( new CANNON.Vec3( 0, 0, 0 ) );
        this.physicsBody.force.copy( new CANNON.Vec3( 0, 0, 0 ) );
        this.physicsBody.inertia.copy( new CANNON.Vec3( 0, 0, 0 ) );
        
        this.body.quaternion.copy( this.physicsBody.quaternion );
        this.body.position.copy( this.physicsBody.position )

        for ( let i=0; i<this.engines.length; i++ ){
            this.engines[i].engineOff( );
        }
    }

    engineOn( engine ){
        // check for throttle if throttle mode
        if ( this.settings.ship.engines.mode === "throttle" && !this.throttleOn ) return;

        let r = ( this.reverseToggle ) ? -1 : 1;
        let pos = engine.body.position;
        this.physicsBody.applyLocalForce( new CANNON.Vec3( 0, this.settings.ship.engines.engineStrength * r, 0 ), new CANNON.Vec3( pos.x, pos.y, pos.z ) );
    }

    clampMovement( ){
        // set max speed to the setting
        let force = this.physicsBody.force;
        let velocity = this.physicsBody.velocity;
        this.physicsBody.force.copy( new CANNON.Vec3( THREE.MathUtils.clamp(force.x,-this.settings.ship.clampRange,this.settings.ship.clampRange),THREE.MathUtils.clamp(force.y,-this.settings.ship.clampRange,this.settings.ship.clampRange),THREE.MathUtils.clamp(force.z,-this.settings.ship.clampRange,this.settings.ship.clampRange) ) );
        this.physicsBody.velocity.copy( new CANNON.Vec3( THREE.MathUtils.clamp(velocity.x,-this.settings.ship.clampRange,this.settings.ship.clampRange),THREE.MathUtils.clamp(velocity.y,-this.settings.ship.clampRange,this.settings.ship.clampRange),THREE.MathUtils.clamp(velocity.z,-this.settings.ship.clampRange,this.settings.ship.clampRange) ) );
    }

    loop( ){

        if ( !this.setupComplete ) return;

        if ( this.isReset ) {
            this.isReset = false;
            this.reset( );
            this.body.updateMatrixWorld( );
        }
        
        // check for landing on level end
        this.findIntersection( );

        // update amount of time spent in game
        localStorage.duckTimeSpent = parseInt( this.duckTimeSpent + this.duckTimer.getElapsedTime( ) );

        // update objects with their rigidbodies
        this.body.position.copy( this.physicsBody.position );
        this.body.quaternion.copy( this.physicsBody.quaternion );
        
        // engines loop
        let anyEnginesOn = false;
        for ( let i=0; i<this.engines.length; i++ ){
            
            this.engines[i].loop( { throttleOn: this.throttleOn } );

            if ( this.engines[i].on ){
                anyEnginesOn = true;
                this.engineOn( this.engines[i] );
            }
        }
        if ( anyEnginesOn ) {
            if ( this.settings.rocketFire ) this.engineGlow.visible = true;
        } else {
            if ( this.settings.rocketFire ) this.engineGlow.visible = false;
        }
        this.clampMovement( );

    }
    
}