import DuckDroneLevel1 from './levels/DuckDroneLevel1.js';
import DuckDroneLevel2 from './levels/DuckDroneLevel2.js';
import DuckDroneLevel3 from './levels/DuckDroneLevel3.js';
import DuckDroneLevel4 from './levels/DuckDroneLevel4.js';
import DuckDroneLevel5 from './levels/DuckDroneLevel5.js';
import DuckDroneLevel6 from './levels/DuckDroneLevel6.js';
import DuckDroneLevel7 from './levels/DuckDroneLevel7.js';
import DuckDroneLevel8 from './levels/DuckDroneLevel8.js';
import DuckDroneLevel9 from './levels/DuckDroneLevel9.js';
import DuckDroneLevel10 from './levels/DuckDroneLevel10.js';

export default class DuckDroneLevelManager{
    constructor( data ){
        this.settings = data.settings;
        this.world = data.world;
        this.scene = data.scene;

        this.loadedLevels = [];
        this.currentLevel = 'level1';
        
        this.levels = {
            level1: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel1( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level2' } );
                }
            },
            level2: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel2( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level3' } );
                }
            },
            level3: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel3( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level4' } );
                }
            },
            level4: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel4( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level5' } );
                }
            },
            level5: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel5( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level6' } );
                }
            },
            level6: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel6( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level7' } );
                }
            },
            level7: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel7( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level8' } );
                }
            },
            level8: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel8( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level9' } );
                }
            },
            level9: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel9( settings )
                },
                next: ( )=>{
                    this.send( { level: 'level10' } );
                }
            },
            level10: {
                level: null,
                levelLoader: ( settings )=>{
                    return new DuckDroneLevel10( settings )
                },
                next: ( )=>{
                    window.dispatchEvent( new CustomEvent( "quacksalot", { detail: { quack: "quack" } } ) );  
                }
            },
        }

        this.init( );
    }

    init( ){
        this.setupEventHandlers( );
        
        this.send( { level: 'level1' } );
    }

    setupEventHandlers( ){
        window.addEventListener( "loadLevel", ( e )=>{
            this.loadLevel( e.detail.level )
        }, false );
    }

    send( data ){
        window.dispatchEvent( new CustomEvent( "loadLevel", { detail: data } ) );
    }

    levelLoaded( ){
        window.dispatchEvent( new CustomEvent( "levelLoaded" ) );
    }

    loadLevel( level ){
        if ( level === "next" ) {
            window.DuckDroneEndOfLevel.map( platform => platform.isEndOfLevel = false );
            this.levels[this.currentLevel].next( );
        } else {
            this.levels[level].level = this.levels[level].levelLoader( {world:this.world,scene:this.scene,settings:this.settings} );
            this.levels[level].level.load( );
            this.levels[this.currentLevel].level.onComplete( );
            this.currentLevel = level;
            this.levelLoaded( );
        }
    }

    loop( ){
        for ( let level in this.levels ){
            if ( this.levels[level].level ) this.levels[level].level.loop( );
        }
    }
}
