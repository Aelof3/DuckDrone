import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel4 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(90,100%,50%)';

        this.pos = {x:1450,y:0,z:150};
        
        this.groundsettings = {
            bodyGeometry:{x:500, y:0.25, z:250},
            color: 0xfc2a51
        }

        this.platforms = [
            {
                pos: {x:0,y:150,z:this.groundsettings.bodyGeometry.z / 2},
                dimensions: {x:500,y:300,z:5},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:-150,y:150,z:( ( 5 * this.groundsettings.bodyGeometry.z ) / 6 - this.groundsettings.bodyGeometry.z / 2 )},
                dimensions: {x:25,y:300,z:( this.groundsettings.bodyGeometry.z / 3 )},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:0,y:150,z:( 3 * this.groundsettings.bodyGeometry.z / 6 - this.groundsettings.bodyGeometry.z / 2 )},
                dimensions: {x:25,y:300,z:( this.groundsettings.bodyGeometry.z / 3 )},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:150,y:150,z:( this.groundsettings.bodyGeometry.z / 6 - this.groundsettings.bodyGeometry.z / 2 )},
                dimensions: {x:25,y:300,z:( this.groundsettings.bodyGeometry.z / 3 )},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:this.groundsettings.bodyGeometry.x / 2,y:150,z:0},
                dimensions: {x:5,y:300,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:125,y:300,z:0},
                dimensions: {x:250,y:5,z:this.groundsettings.bodyGeometry.z},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:200,y:21,z:0},
                dimensions: {x:this.groundsettings.bodyGeometry.z / 3,y:40,z:this.groundsettings.bodyGeometry.z / 3},
                color: 'hsl(120,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
}