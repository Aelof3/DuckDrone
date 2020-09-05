import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel5 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(120,100%,50%)';

        this.pos = {x:1650,y:0,z:-250};
        
        this.groundsettings = {
            bodyGeometry:{x:250, y:0.25, z:500},
            color: 0xfc2a51
        }
        let sd = this.getSD(this.groundsettings.bodyGeometry.x,this.groundsettings.bodyGeometry.z);
        this.platforms = [
            {
                pos: {x:0,y:150,z:0},
                dimensions: {x:300,y:300,z:25},
                color: 'hsl(150,100%,50%)',
                type: 4,
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:21,z:-200},
                dimensions: {x:sd / 3,y:40,z:sd / 3},
                color: 'hsl(150,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
    alsoLoop( ){
       this.levelObjects[0].body.rotateY( 0.01 );
       this.levelObjects[0].physicsBody.quaternion.copy(this.levelObjects[0].body.quaternion);
    }
}