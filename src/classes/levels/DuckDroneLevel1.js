import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel1 extends DuckDroneLevel{
    constructor( data ){
        super( data );
        
        this.color = 'hsl(0,100%,50%)';

        this.pos = {x:0,y:0,z:0};

        this.groundsettings = this.settings.ground;
        
        this.platforms = [
            {
                pos: {x:-200,y:21,z:0},
                dimensions: {x:75,y:40,z:this.groundsettings.bodyGeometry.z / 3},
                color: 'hsl(30,100%,50%)',
                isEndOfLevel: false
            },
            {
                pos: {x:200,y:21,z:0},
                dimensions: {x:75,y:40,z:this.groundsettings.bodyGeometry.z / 3},
                color: 'hsl(30,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
}