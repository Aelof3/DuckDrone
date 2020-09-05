import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import DuckDroneTerrainObject from './DuckDroneTerrainObject.js';

export default class DuckDroneLevel{
    constructor( data ){
        this.scene = data.scene;
        this.world = data.world;
        this.level = data.level || 'level1';
        this.pos = data.pos;
        this.quat = data.quat || {x:0,y:0,z:0,w:1};
        this.settings = data.settings;
        this.groundsettings = data.groundsettings;
        this.levelObjects = [];
        this.platforms = [];
        this.ground = null;
        this.spiralMat = null;
        this.color = null;
        this.stopLoop = false;
        this.loader = null;
    }
    init( ){
        this.setupGround( );

        for ( let i=0; i<this.platforms.length; i++){
            this.setupPlatform( this.platforms[i] );
        }
        
        this.onCreate( );
    }
    setupGround( ){
         // geometry
        let geometry = new THREE.BoxGeometry( this.groundsettings.bodyGeometry.x, this.groundsettings.bodyGeometry.y, this.groundsettings.bodyGeometry.z );
        
        // material
        let material = new THREE.MeshPhongMaterial( {
            color: this.color
        });
        
        // mesh
        this.ground = new THREE.Mesh( geometry, material );
        this.ground.receiveShadow = true;
        this.ground.position.copy( new THREE.Vector3( this.pos.x, this.pos.y, this.pos.z ) );

        // Ground physics
        this.groundPhysicsBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3( this.pos.x, this.pos.y, this.pos.z ),
            quaternion: new CANNON.Quaternion( this.quat.x, this.quat.y, this.quat.z, this.quat.w ),
            shape: new CANNON.Box( new CANNON.Vec3( this.groundsettings.bodyGeometry.x / 2, this.groundsettings.bodyGeometry.y / 2, this.groundsettings.bodyGeometry.z / 2 ) )
        });
        
    }

    load( ){
        this.scene.add( this.ground );
        this.world.addBody(this.groundPhysicsBody);
        window.DuckDroneEndOfLevel = this.levelObjects.filter( obj => obj.isEndOfLevel );
    }

    getSD( a,b ){
        return ( a < b ) ? a : b;
    }

    setupPlatform( platform ){

        let data = {
            pos: platform.pos,
            dimensions: platform.dimensions,
            color: platform.color,
            isEndOfLevel: platform.isEndOfLevel,
            world: this.world,
            scene: this.scene,
            settings: this.settings,
            ground: this.ground
        }

        let p = new DuckDroneTerrainObject( data );
        this.levelObjects.push( p );

    }

    onCreate( ){
        return;
    }

    onComplete( ){
        this.stopLoop = true;
        this.onEnd( );
    }

    onEnd( ){
        return;
    }

    alsoLoop( ){
        return;
    }

    loop( ){
        if ( !this.stopLoop ) this.alsoLoop( );
        
        for ( let i=0;i<this.levelObjects.length;i++ ){
            this.levelObjects[i].loop( );
        }
    }
}