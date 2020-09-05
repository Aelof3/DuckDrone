import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';


export default class DuckDroneLevelEditor{
    constructor( data ){
        this.cameraPersp = null;
        this.cameraOrtho = null;
        this.currentCamera = null;
        this.scene = null;
        this.renderer = null;
        this.control = null;
        this.orbit = null;
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = null;
        this.info = document.getElementById( "info" );
        this.platforms = [];
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    
        this.aspect = window.innerWidth / window.innerHeight;
    
        this.cameraPersp = new THREE.PerspectiveCamera( 50, this.aspect, 0.01, 30000 );
        this.cameraOrtho = new THREE.OrthographicCamera( - 600 * this.aspect, 600 * this.aspect, 600, - 600, 0.01, 30000 );
        this.currentCamera = this.cameraPersp;
    
        this.currentCamera.position.set( 1000, 500, 1000 );
        this.currentCamera.lookAt( 0, 200, 0 );
    
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.GridHelper( 10000, 100 ) );
    
        var light = new THREE.DirectionalLight( 0xffffff, 2 );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );
    
    
        this.orbit = new OrbitControls( this.currentCamera, this.renderer.domElement );
        this.orbit.update();
    
        this.control = new TransformControls( this.currentCamera, this.renderer.domElement );        
    
        this.scene.add( this.control );
    
        this.setupGround( );

        this.setupEndPlatform( );

        this.raycaster = new THREE.Raycaster();
    
        this.setupEventHandlers( );

        this.guiSetup( );

        this.render();
    
    }
    
    setupGround( ){
        var geometry = new THREE.BoxBufferGeometry( 500, 0.25, 250 );
        var material = new THREE.MeshPhongMaterial( { 
            color: 0xaaaaaa,
            transparent: true,
            flatShading: true,
        } );
    
        // add edges
        let edges = new THREE.EdgesGeometry(geometry);
        let edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xaa00aa,
            linewidth: 20
        });
        let edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        
        this.ground = new THREE.Mesh( geometry, material );

        this.ground.add( edgesMesh );
        this.ground.position.set( 0, 0, 0 )
        this.scene.add( this.ground );

        this.control.attach( this.ground );

    }

    addPlatform( data ){

        let d = data || {
            d: {x:THREE.MathUtils.randInt( 10, 200 ),y:THREE.MathUtils.randInt( 10, 200 ),z:THREE.MathUtils.randInt( 10, 200 )},
            p: {x:0,y:0,z:300},
            q: {x:0,y:0,z:0,w:1}
        }
        let boxX = d.d.x;
        let boxY = d.d.y;
        let boxZ = d.d.z;

        let posX = d.p.x;
        let posY = d.p.y;
        let posZ = d.p.z;

        let qX = d.q.x;
        let qY = d.q.y;
        let qZ = d.q.z;
        let qW = d.q.w;

        var geometry = new THREE.BoxBufferGeometry( boxX, boxY, boxZ );
        var material = new THREE.MeshPhongMaterial( { 
            color: 0xaaaaaa,
            transparent: true,
            flatShading: true,
        } );
    
        // add edges
        let edges = new THREE.EdgesGeometry(geometry);
        let edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xaa00aa,
            linewidth: 10
        });
        let edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        
        let platform = new THREE.Mesh( geometry, material );

        platform.add( edgesMesh );
        
        this.platforms.push( platform );

        this.scene.add( platform );

        platform.position.set( posX, posY, posZ );
        platform.quaternion.set( qX, qY, qZ, qW );

    }

    setupEndPlatform( ){
        var geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );
        var material = new THREE.MeshPhongMaterial( { 
            color: 0x00ff00,
            transparent: true,
            flatShading: true,
        } );
    
        // add edges
        let edges = new THREE.EdgesGeometry(geometry);
        let edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xaa00aa,
            linewidth: 10
        });
        let edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        
        this.endPlatform = new THREE.Mesh( geometry, material );

        this.endPlatform.add( edgesMesh );
        
        //this.platforms.push( this.endPlatform );
        this.endPlatform.position.set( 0, 21, 0 );
        this.scene.add( this.endPlatform );

    }

    setupEventHandlers( ){
        let self = this;

        this.orbit.addEventListener( 'change', this.render );

        this.control.addEventListener( 'change', this.render );

        this.control.addEventListener( 'dragging-changed', function( event ) {
    
            self.orbit.enabled = ! event.value;
    
        } );
    
        window.addEventListener( 'resize', function(e){self.onWindowResize(e)}, false );
    
        window.addEventListener( 'keydown', function( event ) {

            switch ( event.key.toLowerCase() ) {
    
                case "q": // Q
                    self.control.setSpace( self.control.space === "local" ? "world" : "local" );
                    break;
    
                case "shift": // Shift
                    self.control.setTranslationSnap( 100 );
                    self.control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                    self.control.setScaleSnap( 0.25 );
                    break;
    
                case "w": // W
                    self.control.setMode( "translate" );
                    break;
    
                case "delete": // del
                    self.deleteObject( );
                    break;
    
                case "e": // E
                    self.control.setMode( "rotate" );
                    break;
    
                case "p": // P
                    self.addPlatform( );
                    break;
    
                case "r": // R
                    self.control.setMode( "scale" );
                    break;
    
                case "c": // C
                    var position = self.currentCamera.position.clone();
    
                    self.currentCamera = self.currentCamera.isPerspectiveCamera ? self.cameraOrtho : self.cameraPersp;
                    self.currentCamera.position.copy( position );
    
                    self.orbit.object = self.currentCamera;
                    self.control.camera = self.currentCamera;
    
                    self.currentCamera.lookAt( self.orbit.target.x, self.orbit.target.y, self.orbit.target.z );
                    self.onWindowResize();
                    break;
    
                case "v": // V
                    var randomFoV = Math.random() + 0.1;
                    var randomZoom = Math.random() + 0.1;
    
                    self.cameraPersp.fov = randomFoV * 160;
                    self.cameraOrtho.bottom = - randomFoV * 500;
                    self.cameraOrtho.top = randomFoV * 500;
    
                    self.cameraPersp.zoom = randomZoom * 5;
                    self.cameraOrtho.zoom = randomZoom * 5;
                    self.onWindowResize();
                    break;
    
                case "+":
                case "=": // +, =, num+
                    self.control.setSize( self.control.size + 0.1 );
                    break;
    
                case "-":
                case "_": // -, _, num-
                    self.control.setSize( Math.max( self.control.size - 0.1, 0.1 ) );
                    break;
    
                case "x": // X
                    self.control.showX = ! self.control.showX;
                    break;
    
                case "y": // Y
                    self.control.showY = ! self.control.showY;
                    break;
    
                case "z": // Z
                    self.control.showZ = ! self.control.showZ;
                    break;
    
                case " ": // Spacebar
                    self.control.enabled = ! self.control.enabled;
                    break;

                case "!": // Exclamation mark
                    self.generateFileContents( );
                    break;

                case "@": // At sign
                    self.setupLoadData( );
                    break;
    
            }
    
        } );
        this.renderer.domElement.addEventListener( 'mousemove', function(e){self.onDocumentMouseMove(e)}, false );
        this.renderer.domElement.addEventListener( 'click', function(e){self.onMouseClick(e)}, false );
    
        this.renderer.domElement.addEventListener( 'keyup', function( event ) {
    
            switch ( event.keyCode ) {
    
                case 16: // Shift
                    self.control.setTranslationSnap( null );
                    self.control.setRotationSnap( null );
                    self.control.setScaleSnap( null );
                    break;
    
            }
    
        } );
    }

    deleteObject( ){
        let obj = this.control.object;
        if ( obj.uuid === this.ground.uuid ) return;
        if ( obj.uuid === this.endPlatform.uuid ) return;
        this.control.detach();
        obj.geometry.dispose();
        obj.material.dispose();
        this.scene.remove( obj );

        this.platforms = this.platforms.filter( p => p.uuid !== obj.uuid );
    }

    onWindowResize() {
    
        this.aspect = window.innerWidth / window.innerHeight;
    
        this.cameraPersp.aspect = this.aspect;
        this.cameraPersp.updateProjectionMatrix();
    
        this.cameraOrtho.left = this.cameraOrtho.bottom * this.aspect;
        this.cameraOrtho.right = this.cameraOrtho.top * this.aspect;
        this.cameraOrtho.updateProjectionMatrix();
    
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    
        this.render();
    
    }
    
    onDocumentMouseMove( event ) {
    
        event.preventDefault();
    
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }
    
    onMouseClick( event ){
        if ( this.INTERSECTED && this.INTERSECTED.type.toLowerCase() === "mesh" ) {
            this.control.attach( this.INTERSECTED );
        }
    }

    guiSetup(){
        this.keybinds = this.h2e(`<div>"W" translate | "E" rotate | "R" scale | "+/-" adjust size | "Q" toggle world/local space |  "Shift" snap to grid<br>
                                        "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled | "C" toggle camera | "V" random zoom<br><br>
                                        "P" add platform | "DELETE" delete selected platform<br>
                                        "!" download code | "@" load level
                                    </div>`);
        this.info.appendChild( this.keybinds );
    }

    render() {

        if ( !this.renderer ) return;

        requestAnimationFrame( ()=>{
            this.render( );
        } );

        if ( this.raycaster ){
            this.raycaster.setFromCamera( this.mouse, this.currentCamera );
    
            var intersects = this.raycaster.intersectObjects( this.scene.children );
    
            if ( intersects.length > 0 ) {
    
                if ( this.INTERSECTED != intersects[ 0 ].object ) {

                    this.INTERSECTED = intersects[ 0 ].object;
    
                }
    
            } else {
                this.INTERSECTED = null;
            }
        }
    
        this.renderer.render( this.scene, this.currentCamera );
    
    }

    generateFileContents( ){

        let pl = this.platforms.map( plat => {
            return { 
                d: {x:plat.geometry.parameters.width,y:plat.geometry.parameters.height,z:plat.geometry.parameters.depth},
                p: {x:plat.position.x,y:plat.position.y,z:plat.position.z},
                q: {x:plat.quaternion.x,y:plat.quaternion.y,z:plat.quaternion.z,w:plat.quaternion.w}
            }
        } );

        let data = btoa( JSON.stringify( {
            ground: {
                p:{x:this.ground.position.x,y:this.ground.position.y,z:this.ground.position.z},
                q:{x:this.ground.quaternion.x,y:this.ground.quaternion.y,z:this.ground.quaternion.z,w:this.ground.quaternion.w},
                d:this.ground.geometry.parameters
            },
            endPlatform: {
                p:{x:this.endPlatform.position.x,y:this.endPlatform.position.y,z:this.endPlatform.position.z},
                q:{x:this.endPlatform.quaternion.x,y:this.endPlatform.quaternion.y,z:this.endPlatform.quaternion.z,w:this.endPlatform.quaternion.w},
                d:this.endPlatform.geometry.parameters
            },
            platforms: pl
        } ) );

        let platforms = ``;

        for ( let i=0;i<this.platforms.length;i++){
            platforms += `{
                            pos: {x:${this.platforms[i].position.x},y:${this.platforms[i].position.y},z:${this.platforms[i].position.z}},
                            quat: {x:${this.platforms[i].quaternion.x},y:${this.platforms[i].quaternion.y},z:${this.platforms[i].quaternion.z},w:${this.platforms[i].quaternion.w}},
                            dimensions: {x:${this.platforms[i].geometry.parameters.width},y:${this.platforms[i].geometry.parameters.height},z:${this.platforms[i].geometry.parameters.depth}},
                            color: 'hsl(60,100%,50%)',
                            isEndOfLevel: false
                        },`
        }

        let contents = `import DuckDroneLevel from '../DuckDroneLevel.js';

export default class DuckDroneLevelNUMBER extends DuckDroneLevel{
    constructor( data ){
        super( data );

        // add to levels folder --- ./src/classes/levels/DuckDroneLevelNUMBER.js

        this.color = 'hsl(30,100%,50%)';

        this.pos = {x:500,y:0,z:0}; // CHANGE ME

        this.groundsettings = {
            bodyGeometry:{x:${this.ground.geometry.parameters.width}, y:${this.ground.geometry.parameters.height}, z:${this.ground.geometry.parameters.depth}},
            color: 0xfc2a51
        }

        this.platforms = [
            ${platforms}
            {
                pos: {x:${this.endPlatform.position.x},y:${this.endPlatform.position.y},z:${this.endPlatform.position.z}},
                dimensions: {x:${this.endPlatform.geometry.parameters.width}, y:${this.endPlatform.geometry.parameters.height}, z:${this.endPlatform.geometry.parameters.depth}},
                color: 'hsl(60,100%,50%)',
                isEndOfLevel: true
            },
        ];
        this.init( );
    }
    // add onCreate to run code right after the level is created. Good for starting moving pieces
    // add onEnd to run code after the level is beaten. Good for removing barriers or walls you had preventing improper access to the level end
    // add alsoLoop to include code in the render loop
    // editor save string - ${data}
}`;
        
        let filename = `DuckDroneLevelNUMBER.js`;

        this.download( filename, contents );

    }

    loadData( data ){
        let d = this.parseLoadData( data );
        console.log( d );
        this.ground.geometry.parameters.width = d.ground.d.width;
        this.ground.geometry.parameters.height = d.ground.d.height;
        this.ground.geometry.parameters.depth = d.ground.d.depth;

        this.ground.position.copy( new THREE.Vector3( d.ground.p.x,d.ground.p.y,d.ground.p.z ) );
        this.ground.quaternion.copy( new THREE.Quaternion( d.ground.q.x, d.ground.q.y, d.ground.q.z, d.ground.q.w ) );

        this.endPlatform.geometry.parameters.width = d.endPlatform.d.width;
        this.endPlatform.geometry.parameters.height = d.endPlatform.d.height;
        this.endPlatform.geometry.parameters.depth = d.endPlatform.d.depth;

        this.endPlatform.position.copy( new THREE.Vector3( d.endPlatform.p.x,d.endPlatform.p.y,d.endPlatform.p.z ) );
        this.endPlatform.quaternion.copy( new THREE.Quaternion( d.endPlatform.q.x, d.endPlatform.q.y, d.endPlatform.q.z, d.endPlatform.q.w ) );

        this.control.detach();

        for (let i=0;i<this.platforms.length;i++){
            this.platforms[i].geometry.dispose();
            this.platforms[i].material.dispose();
            this.scene.remove( this.platforms[i] );
        }

        this.platforms = [];
        for (let k=0;k<d.platforms.length;k++){
            this.addPlatform( d.platforms[k] );
        }

    }

    setupLoadData( ){
        let loaddata = prompt("Enter your load string, found at the bottom of your saved level file");
        this.loadData( loaddata );
    }

    parseLoadData( data ){
        return JSON.parse( atob( data ) );
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    h2e( html ) {
        // Turn text html into an element node, use is similar to jQuery $('<div class="jqueryclass"></div>') to create element
        let template = document.createElement( 'template' );
        html = html.trim( ); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
    
}
