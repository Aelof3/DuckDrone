import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel3 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(60,100%,50%)';

        this.pos = {x:1000,y:0,z:0};
        
        this.groundsettings = {
            bodyGeometry:{x:500, y:0.25, z:250},
            color: 0xfc2a51
        }

        this.platforms = [
            {
                pos: {x:-140,y:150,z:0},
                dimensions: {x:25,y:180,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(90,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:75,y:250,z:0},
                dimensions: {x:400,y:20,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(90,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:300,y:150,z:0},
                dimensions: {x:75,y:300,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(90,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:200,y:21,z:0},
                dimensions: {x:this.groundsettings.bodyGeometry.z / 3,y:40,z:this.groundsettings.bodyGeometry.z / 3},
                color: 'hsl(90,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
}