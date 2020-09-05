import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevel10 extends DuckDroneLevel{
    constructor( data ){
        super( data );

        this.color = 'hsl(270,100%,50%)';

        this.pos = {x:0,y:0,z:-3500};
        
        this.groundsettings = {
            bodyGeometry:{x:50, y:0.25, z:50},
            color: 0xfc2a51
        }

        let sd = this.getSD(this.groundsettings.bodyGeometry.x,this.groundsettings.bodyGeometry.z);
        this.platforms = [
            {
                pos: {x:0,y:21,z:0},
                dimensions: {x:25,y:40,z:25},
                color: 'hsl(300,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
}