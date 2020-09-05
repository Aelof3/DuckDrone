import DuckDroneLevel from '../DuckDroneLevel.js';
import * as THREE from 'three';

export default class DuckDroneLevel9 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(240,100%,50%)';

        this.pos = {x:0,y:0,z:-900};
        
        this.groundsettings = {
            bodyGeometry:{x:250, y:0.25, z:250},
            color: 0xfc2a51
        }
        
        let sd = this.getSD(this.groundsettings.bodyGeometry.x,this.groundsettings.bodyGeometry.z);

        this.platforms = [
            {
                pos: {x:0,y:150,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:-150,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:150,y:0,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:-150,y:0,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:-125,y:150,z:0},
                dimensions: {x:25,y:300,z:25},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:125,y:150,z:0},
                dimensions: {x:25,y:300,z:25},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:150,z:-125},
                dimensions: {x:25,y:300,z:25},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:150,z:125},
                dimensions: {x:25,y:300,z:25},
                color: 'hsl(270,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:21,z:0},
                dimensions: {x:sd / 3,y:40,z:sd / 3},
                color: 'hsl(270,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }

    onCreate( ){
        this.rotaterH = new THREE.Group();
        this.rotaterV = new THREE.Group();
        this.ground.add( this.rotaterH );
        this.ground.add( this.rotaterV );
        
        this.rotaterH.add( this.levelObjects[0].body );
        this.rotaterH.add( this.levelObjects[1].body );
        this.rotaterH.add( this.levelObjects[2].body );
        this.rotaterH.add( this.levelObjects[3].body );

        this.rotaterV.add( this.levelObjects[4].body );
        this.rotaterV.add( this.levelObjects[5].body );
        this.rotaterV.add( this.levelObjects[6].body );
        this.rotaterV.add( this.levelObjects[7].body );
        
    }

    alsoLoop( ){
        this.rotaterH.rotateZ(0.01);
        this.rotaterV.rotateY(0.01);
        for(let i=0;i<this.levelObjects.length;i++){
            this.levelObjects[i].physicsBody.position.copy(this.levelObjects[i].body.getWorldPosition());
            this.levelObjects[i].physicsBody.quaternion.copy(this.levelObjects[i].body.quaternion);
        }
     }
}