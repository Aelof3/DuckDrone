import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import TextureEndLevel from './textures/TextureEndLevel.js';

export default class DuckDroneTerrainObject{
    constructor( data ){
        this.world = data.world;
        this.scene = data.scene;
        this.ground = data.ground;
        this.pos = data.pos;
        this.dimensions = data.dimensions;
        this.settings = data.settings;
        this.color = data.color || 0x00ff00;
        this.isEndOfLevel = data.isEndOfLevel;
        this.geometry = null;
        this.material = null;
        this.basemat = null;
        this.spiralMat = null;
        this.body = null;
        this.physicsBody = null;
        this.type = data.type || CANNON.Body.STATIC;


        this.init( );
    }
    init( ){
        this.createBox( );
    }
    createBox( ){
        this.geometry = new THREE.BoxBufferGeometry( this.dimensions.x, this.dimensions.y, this.dimensions.z );
        
        this.basemat = new THREE.MeshPhongMaterial( {
            color: this.color
        });

        if ( this.isEndOfLevel ){
            this.spiralMat = new TextureEndLevel( );
            this.material = this.spiralMat.generateMaterial( );
        } else {
            this.material = this.basemat;
        }
        
        this.body = new THREE.Mesh( this.geometry, this.material );
        this.body.position.copy( new THREE.Vector3( this.pos.x, this.pos.y, this.pos.z ) );
        this.body.receiveShadow = true;
        
        // add edges
        let edges = new THREE.EdgesGeometry(this.geometry);
        let edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 8
        });
        let edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        this.body.add( edgesMesh );

        this.ground.add( this.body );
        
        this.ground.updateMatrixWorld( );

        let pos = new THREE.Vector3();
        pos.copy( this.body.getWorldPosition( ) );

        // physics
        this.physicsBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3( pos.x, pos.y, pos.z ), // m
            shape: new CANNON.Box( new CANNON.Vec3( this.dimensions.x / 2, this.dimensions.y / 2, this.dimensions.z / 2 ) ),
            type: this.type
        });

        this.world.addBody( this.physicsBody );
    }
    loop( ){
        if ( this.isEndOfLevel ) {
            this.body.material = this.spiralMat.generateMaterial( );
        } else {
            this.body.material = this.basemat;
        }
    }
}