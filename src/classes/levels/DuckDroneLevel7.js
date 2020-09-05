import DuckDroneLevel from '../DuckDroneLevel.js';
import * as THREE from 'three';

export default class DuckDroneLevel7 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(180,100%,50%)';

        this.pos = {x:700,y:0,z:-450};
        
        this.groundsettings = {
            bodyGeometry:{x:250, y:0.25, z:250},
            color: 0xfc2a51
        }
        
        let sd = this.getSD(this.groundsettings.bodyGeometry.x,this.groundsettings.bodyGeometry.z);

        this.platforms = [
            {
                pos: {x:0,y:150,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(210,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:-150,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(210,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:150,y:0,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(210,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:-150,y:0,z:0},
                dimensions: {x:25,y:25,z:350},
                color: 'hsl(210,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:21,z:0},
                dimensions: {x:sd / 3,y:40,z:sd / 3},
                color: 'hsl(210,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }

    onCreate( ){
        this.rotater = new THREE.Group();
        this.ground.add( this.rotater );
        for(let i=0;i<this.levelObjects.length;i++){
            if ( !this.levelObjects[i].isEndOfLevel ) this.rotater.add( this.levelObjects[i].body );
        }
    }

    alsoLoop( ){
        this.rotater.rotateZ(0.01);
        for(let i=0;i<this.levelObjects.length;i++){
            this.levelObjects[i].physicsBody.position.copy(this.levelObjects[i].body.getWorldPosition());
            this.levelObjects[i].physicsBody.quaternion.copy(this.levelObjects[i].body.quaternion);
        }
     }
}