import * as THREE from 'three';

export default class DuckDroneShipEngine {
    constructor( data ){
        this.settings = data.settings;
        this.key = data.key;
        this.on = data.on;
        this.color = data.color;
        this.position = data.position;
        this.geo = data.geometry;
        this.row = data.row;
        this.geometry = null;
        this.material = null;
        this.body = null;

        this.clock = new THREE.Clock;

        this.fire = null;

        this.fireGeometry = null;
        this.fireMaterial = null;

        this.fireset = false;

        this.throttleOn = false;
        this.init();
    }

    init( ){

        let r = ( this.geo.x < this.geo.z ) ? ( this.geo.x / 2 ) : ( this.geo.z / 2 );
        // geometry
        this.geometry = new THREE.CylinderGeometry( r, r, this.geo.y, 32 );
        
        // material
        this.material = new THREE.MeshPhongMaterial( {
            color: this.color
        });
        
        this.body = new THREE.Mesh( this.geometry, this.material );
        this.body.castShadow = false;
        this.body.receiveShadow = false;
        this.body.position.set( this.position.x, this.position.y, this.position.z );
        this.fireSetup( );
    }

    fireSetup( ){
        this.fireGeometry = new THREE.ConeGeometry( 2, 2, 32 );
        
        // material
        this.fireMaterial = new THREE.MeshPhongMaterial( {
            color: 0xffA500,
            visible: true,
            flatShading: true,
            emissive: 0xffA500,
            emissiveIntensity: 5
        });

        this.fire = new THREE.Mesh( this.fireGeometry, this.fireMaterial );

        this.fire.rotateZ( THREE.MathUtils.degToRad( 180 ) );
        this.fire.position.set( 0, -5, 0 );
        this.body.add( this.fire );
        
        this.fire.visible = false;
    }

    engineChangeState( toggle ){
        this.on = toggle;
        this.body.material.color = ( this.on ) ? new THREE.Color( 0x00ff00 ) : new THREE.Color( this.color );
    }

    fireAnim( ){

        this.fire.visible = ( ( this.throttleOn || this.settings.ship.engines.mode === "individual" ) && this.on );
        
        if ( !this.throttleOn && ( this.settings.ship.engines.mode === "throttle" ) ) return;

        if ( !this.settings.rocketFire ) return;
        
        let t = this.clock.getElapsedTime( );
        let d = THREE.MathUtils.randFloat( 0.45, 1 );
        if ( t < d ) {
            
            let m = t * THREE.MathUtils.randInt( 1, 4 ) * THREE.MathUtils.randInt( 10, 7 );
            
            this.fire.scale.x = 1;
            this.fire.position.set( 0, - t * m -3, 0 );
            this.fire.scale.y = t * m;
            this.fire.scale.z = 1;
        } else {
            this.clock.stop( );
            this.clock.start( );
        }
    }

    engineOn( ){
        this.engineChangeState( true );
    }

    engineToggle( toggle ){
        this.engineChangeState( toggle );
    }

    engineOff( ){
        this.engineChangeState( false );
    }

    keydownHandler( ){
        // check for a toggle mode, otherwise keydown = engine on
        this.engineToggle( ( this.settings.ship.engines.mode === "individualtoggle" ) ? !this.on : true );
    }

    loop( data ){
        this.throttleOn = data.throttleOn;
        this.fireAnim( );
    }

    keyupHandler( ){
        // if a toggle mode all engine on logic is handled on key down
        if ( this.settings.ship.engines.mode === "individualtoggle" || this.settings.ship.engines.mode === "throttle" ) return;
        this.engineToggle( false );
    }
}