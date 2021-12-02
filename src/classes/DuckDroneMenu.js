import DuckDroneApp from './DuckDroneApp.js';

export default class DuckDroneMenu{
    constructor( settings ){
        this.settings = settings;
        
        this.html = ``;
        this.activeApp = false;
        
        window.DuckDroneMenuToggle = false;

        this.el = document.getElementById("menu");        
        this.css = this.h2e(`<style></style>`);
        document.body.appendChild(this.css);
    }

    init(){
        this.randomMenuBG( );
        // save settings to localStorage 
        this.updateSettings();

        this.setupEventHandlers( );
        
        this.buildMenuItems( );
        
        // create menu of type main menu
        this.loadMenu( 0 );
        this.prevMenu = 0;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomMenuBG( ){
        let n = this.getRandomInt(1,22);
        this.css.innerHTML = `#menu::before{background-image: url(static/assets/images/duckbg${n}.jpg);}`
    }

    setupEventHandlers( ){
        window.addEventListener( 'keydown', ( e ) => {
            if ( e.key.toLowerCase( ) === "escape" && this.activeApp ){
                window.DuckDroneMenuToggle = !window.DuckDroneMenuToggle;
                this.toggleMenu( window.DuckDroneMenuToggle );
                this.loadMenu( 1 );
            }
        });
    }

    buildMenuItems( ){
        let self = this;

        this.menus = [
            {
                name: 'main menu',
                options: [
                    {
                        name: 'play game',
                        action: function( ){
                            self.prevMenu = 0;
                            self.toggleMenu( false );
                            window.DuckDroneMenuToggle = false;

                            self.activeApp = true;
                            
                            window.DuckDroneApp = new DuckDroneApp( self.settings );

                            window.DuckDroneApp.init();
                            window.DuckDroneApp.animate();
                        },
                        type: 'button',
                        el: self.h2e(`<div class="menuButton" id="playGame">play game</div>`)
                    },
                    {
                        name: 'options',
                        action: function( ){
                            self.loadMenu( 2 );
                            self.prevMenu = 0;
                        },
                        type: 'button',
                        el: self.h2e(`<div class="menuButton" id="options">options</div>`)
                    }
                ]
            },
            {
                name: 'game menu',
                options: [
                    {
                        name: 'exit to menu',
                        action: function( ){
                            location.reload( );
                        },
                        type: 'button',
                        el: self.h2e(`<div class="menuButton" id="exitToMenu">exit to menu</div>`)
                    },
                    {
                        name: 'options',
                        action: function( ){
                            self.loadMenu( 2 );
                            self.prevMenu = 1;
                        },
                        type: 'button',
                        el: self.h2e(`<div class="menuButton" id="options">options</div>`)
                    },
                    {
                        name: 'back',
                        action: function( ){
                            window.DuckDroneMenuToggle = !window.DuckDroneMenuToggle;
                            self.toggleMenu( window.DuckDroneMenuToggle );
                            self.loadMenu( 1 );
                        },
                        type: 'button',
                        el: self.h2e(`<div class="menuButton" id="back">back</div>`)
                    },
                ]
            },
            {
                name: 'options',
                options: [
                    {
                        name: 'sound',
                        type: 'checkbox',
                        action: function( ){
                            self.settings.sound = this.checked;
                            self.updateSettings( );
                        },
                        el: self.h2e(`<input name="settings-sound" id="settings-sound" type="checkbox" ${(self.settings.sound) ? 'checked="checked"':""} />`)
                    },
                    {
                        name: 'music',
                        type: 'checkbox',
                        action: function( ){
                            self.settings.music = this.checked;
                            self.updateSettings( );
                        },
                        el: self.h2e(`<input name="settings-music" id="settings-music" type="checkbox" ${(self.settings.music) ? 'checked="checked"':""} />`)
                    },
                    {
                        name: 'rocket fire animation',
                        type: 'checkbox',
                        action: function( ){
                            self.settings.rocketFire = this.checked;
                            self.updateSettings( );
                        },
                        el: self.h2e(`<input name="settings-rocketfire" id="settings-rocketfire" type="checkbox" ${(self.settings.rocketFire) ? 'checked="checked"':""} />`)
                    },
                    /* {
                        name: 'engine mode',
                        type: 'select',
                        action: function( ){
                            self.settings.ship.engines.mode = this.value;
                            self.updateSettings( );
                        },
                        el: self.h2e(`<select name="settings-engineMode" id="settings-engineMode">
                                            <option value="throttle" ${(self.settings.ship.engines.mode === "throttle") ? "selected='selected'":""}" >throttle</option>
                                            <option value="individual" ${(self.settings.ship.engines.mode === "individual") ? "selected='selected'":""}" >individual</option>
                                            <option value="individualtoggle" ${(self.settings.ship.engines.mode === "individualtoggle") ? "selected='selected'":""}" >individual toggle</option>
                                        </select>`)
                    }, */
                    /* {
                        name: 'engine max power',
                        type: 'number',
                        action: function( ){
                            self.settings.ship.clampRange = this.value;
                            console.log(self.settings)
                        },
                        el: self.h2e(`<input name="settings-engineMaxPower" id="settings-engineMaxPower" type="number" value="${self.settings.ship.clampRange}" />`)
                    }, */
                    /* {
                        name: 'engine strength',
                        type: 'number',
                        action: function( ){
                            self.settings.ship.engines.engineStrength = this.value;
                            self.updateSettings( );
                        },
                        el: self.h2e(`<input name="settings-engineStrength" id="settings-engineStrength" type="number" value="${self.settings.ship.engines.engineStrength}" />`)
                    }, */
                    /* {
                        name: 'keybind setup (1-8)',
                        type: 'number',
                        action: function( ){
                            let k = ( this.value <= 8 && this.value >= 1 ) ? this.value : 1;
                            self.settings.keynum = k;
                            self.settings.keys = self.settings.keyselect[`keys${k}`];
                            self.updateSettings( );
                            self.loadMenu( 2 );
                            self.prevMenu = 0;
                        },
                        el: self.h2e(`<input name="settings-keys" min=1 max=8 id="settings-keys" type="number" value="${self.settings.keynum}" />`)
                    }, */
                    {
                        name: 'back',
                        type: 'button',
                        action: function( ){
                            self.loadMenu( self.prevMenu );
                            self.prevMenu = 2;
                        },
                        el: self.h2e(`<div class="menuButton" id="back">back</div>`)
                    }
                ]
            }
        ]
    }

    loadMenu( menuNumber ){
        this.el.innerHTML = '';
        
        this.randomMenuBG( );

        let menu = this.menus[ menuNumber ];

        for(let i=0;i<menu.options.length;i++){
            
            let menuItemWrapper = this.h2e( `<div class="menuItemWrapper"></div>` );
            let menuItemLabel = this.h2e( `<label for="${menu.options[i].el.id}">${menu.options[i].name}</label>`);
                        
            this.el.appendChild( menuItemWrapper );
            
            if ( menu.options[i].type !== "button" ) {
                menuItemWrapper.appendChild( menuItemLabel );

                menu.options[i].el.onchange = menu.options[i].action;
            } else {
                menu.options[i].el.onclick = menu.options[i].action;
            }

            menuItemWrapper.appendChild( menu.options[i].el );

            if ( menu.options[i].el.id === "settings-keys" ){
                let keyEx = this.keyExample( this.settings.keynum );
                let keyEl = this.h2e(`<pre class="preMenu">${keyEx}</pre>`);
                menuItemWrapper.appendChild( keyEl );
            }

        }
    }

    updateSettings( ){
        localStorage.DuckDroneSettings = JSON.stringify( this.settings );
    }

    toggleMenu( toggle ){
        this.el.className = ( toggle ) ? "" : "menuToggle";
    }

    keyExample( n ){
        let keys = {
            1: `[ q ][ w ]\n[ a ][ s ]`,
            2: `[ w ][ s ]\n[ q ][ a ]`,
            3: `[ q ][ w ][ e ]\n[ a ][ s ][ d ]`,
            4: `[ q ][ w ][ e ]\n[ a ][ s ][ d ]\n[ z ][ x ][ c ]`,
            5: `[ q ][ w ][ e ][ r ]\n[ a ][ s ][ d ][ f ]\n[ z ][ x ][ c ][ v ]`,
            6: `[ q ][ w ][ e ][ r ][ t ][ y ][ u ]\n[ a ][ s ][ d ][ f ][ g ][ h ][ j ]\n[ z ][ x ][ c ][ v ][ b ][ n ][ m ]`,
            7: `[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ]\n[ q ][ w ][ e ][ r ][ t ][ y ][ u ]\n[ a ][ s ][ d ][ f ][ g ][ h ][ j ]\n[ z ][ x ][ c ][ v ][ b ][ n ][ m ]`,
            8: `[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ]\n[ q ][ w ][ e ][ r ][ t ][ y ][ u ][ i ][ o ][ p ]\n[ a ][ s ][ d ][ f ][ g ][ h ][ j ][ k ][ l ][ ; ]\n[ z ][ x ][ c ][ v ][ b ][ n ][ m ][ , ][ . ][ / ]`
        }

        return keys[n]

    }

    h2e( html ) {
        // Turn text html into an element node, use is similar to jQuery $('<div class="jqueryclass"></div>') to create element
        let template = document.createElement( 'template' );
        html = html.trim( ); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
}