export default class DuckDroneGUI{
    constructor( data ){
        this.el = document.getElementById( "gui" );
        this.keys = data.ship.keys;
        this.settings = data.settings;
        this.musicOn = null;
        this.levelManager = data.levelManager;
        this.ship = data.ship;

        this.shipBody = {
            velocity:{x:0,y:0,z:0},
            force:{x:0,y:0,z:0}
        }

        this.keys.reverse();
        
        for ( let i=0; i<this.keys.length; i++ ) this.keys[i].reverse();
        
        this.init( );
    }

    init(){
        this.buildHTML( );
    }

    keyboardKeys( ){
        let rows = ``
        for( let i=0; i<this.keys.length;i++ ){
            
            let s1 = `<div class="keybinds--keyboard--row">`;
            for (let k=0; k<this.keys[i].length;k++ ){
                s1 += `<div class="keybinds--keyboard--key ${ this.checkEngines( this.keys[i][k] ) ? `activeClass`: ``}">${ this.keys[i][k] }</div>`;
            }
            s1 += `</div>`
            rows += s1
        }
        return rows;
    }

    buildHTML( ){
        this.el.innerHTML = `<div id="gui--left">
                                <div class="gui--category">
                                    <p>Keybinds:</p>
                                    <div class="keybinds--wrap">
                                        <div class="keybinds--keyboard">
                                            ${this.keyboardKeys()}
                                        </div>
                                        <br>
                                        <p>Engines All Toggle: SPACEBAR</p>
                                        ${this.getThrottle()}
                                        <p class="${this.keyCheck("control") ? `activeClass`: ``}">Reverse: CTRL</p>
                                        <p>Mode: ${this.settings.ship.engines.mode}</p>
                                        <p>Reset: BACKSPACE</p>
                                        <p>Menu: ESC</p>
                                    </div>
                                </div>
                            </div>
                            ${this.debugCheck()}
                            <div id="gui--right">
                                <div class="gui--category">
                                    <p>Level: ${this.levelManager.currentLevel.replace('level','')}/10</p>
                                    <p>Resets: ${this.getResets()}</p>
                                    <p>Time Spent: ${this.getTimeSpent()}</p>
                                    <p>QUACKS: ${this.ship.duckQuacks}</p>
                                    ${this.getDebug()}
                                </div>
                            </div>
                            `;
    }

    debugCheck( ){
        if ( !this.settings.debug ) return '';
        return `<div class="debugMode">DEBUG MODE</div>`;
    }

    getDebug( ){
        if ( !this.settings.debug ) return '';
        return `<p>Velocity: x: ${Math.floor(this.shipBody.velocity.x)} | y: ${Math.floor(this.shipBody.velocity.y)} | z: ${Math.floor(this.shipBody.velocity.z)}</p>
                <p>Force: x: ${Math.floor(this.shipBody.force.x)} | y: ${Math.floor(this.shipBody.force.y)} | z: ${Math.floor(this.shipBody.force.z)}</p>`;
    }

    getThrottle( ){
        if ( this.settings.ship.engines.mode === 'individual' ) return '';
        return `<p class="${this.keyCheck("shift") ? `activeClass`: ``}">Throttle: SHIFT</p>`;
    }

    getResets( ){
        return this.ship.resets + this.ship.duckViewedPage;
    }

    getPower( ){
        return `x:${parseInt(this.ship.physicsBody.velocity.x)},y:${parseInt(this.ship.physicsBody.velocity.y)},z:${parseInt(this.ship.physicsBody.velocity.z)}`
    }

    getTimeSpent( ){
        let seconds = parseInt(this.ship.duckTimeSpent + this.ship.duckTimer.getElapsedTime( ));
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    checkEngines( key ){
        for ( let i=0; i<this.ship.engines.length; i++ ){
            if ( key === this.ship.engines[i].key && this.ship.engines[i].on ) return true;
        }
        return false;
    }

    keyCheck( key ){
        if ( key === "shift" && this.ship.throttleOn ) return true;
        if ( key === "control" && this.ship.reverseToggle ) return true;
        return false;
    }

    loop( data ){
        this.ship = data.ship;
        this.shipBody = data.shipBody;
        this.musicOn = data.musicOn;
        this.levelManager = data.levelManager;
        this.buildHTML( );
    }
}