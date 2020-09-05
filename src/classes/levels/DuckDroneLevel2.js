import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel2 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(30,100%,50%)';

        this.pos = {x:500,y:0,z:0};

        this.groundsettings = {
            bodyGeometry:{x:500, y:0.25, z:100},
            color: 0xfc2a51
        }

        this.platforms = [
            {
                pos: {x:-50,y:101,z:0},
                dimensions: {x:75,y:200,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(60,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:200,y:21,z:0},
                dimensions: {x:this.groundsettings.bodyGeometry.z / 3,y:40,z:this.groundsettings.bodyGeometry.z / 3},
                color: 'hsl(60,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
}