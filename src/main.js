import '../static/assets/css/style.css';
import DuckDroneSettings from './classes/DuckDroneSettings.js';
import DuckDroneMenu from './classes/DuckDroneMenu.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// search for clear in the url parameters, if present clear the localStorage then redirect to base url
let urlParams = new URLSearchParams(window.location.search);
if ( urlParams.has( "clear" ) ) {
    window.localStorage.clear( );
    location.href = window.location.origin;
}

let settings = null;

// check for saved settings, otherwise load defaults
if ( urlParams.has( "paintbucket" ) ){
    settings = new DuckDroneSettings( );
    settings.debug = true;
} else {
    settings = ( localStorage.DuckDroneSettings ) ? JSON.parse(localStorage.DuckDroneSettings) : new DuckDroneSettings( );
    settings.debug = false;
}

if ( settings.debug ) {
    window.stats = new Stats();
    window.localStorage.clear( );
}

let menu = new DuckDroneMenu( settings );

menu.init( );

if ( settings.debug ) {
    document.body.appendChild(window.stats.dom);
    window.stats.dom.setAttribute('style','position: fixed; bottom: 0px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;');
}
