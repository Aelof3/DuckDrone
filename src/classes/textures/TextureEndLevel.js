import * as THREE from "three";

export default class TextureEndLevel{
    constructor( ){
        
        this.clock = new THREE.Clock;  
        this.clock.start( );
        
        // https://www.shadertoy.com/view/MtsfD7
        this.fragShader = `#ifdef GL_ES
                            precision mediump float;
                            #endif
    
                            #define PI 3.14159265359
    
                            uniform vec2 u_resolution;
                            uniform float u_time;
                            uniform float frequency;

                            varying vec4 vwPos;
                            varying vec4 vlPos;
    
                            // from iq
                            float expStep( float x, float k, float n ){
                                return exp( -k*pow( x, n ) );
                            }

                            mat2 rot( float rads ){
                                return mat2( cos( rads ), sin( rads ), -sin( rads ), cos( rads ) );
                            }

                            void main(){
                                vec2 p = ( -2. * vlPos.xz - vlPos.xz ) / vwPos.x;
                                p = rot( u_time * .35 ) * p;
                                p = vec2( p.x, -p.y ) + .15;
                                
                                float r = length( p );
                                float a = atan( p.y, p.x );
                                a += 2. * sin( a );
                                float coord = fract( a / PI + expStep( r, 1., .5 ) * frequency + 1.6 * u_time );
                                vec3 col = mix( vec3( .1, 0.9, .25 ), vec3( .4, 0., .6 ), step( .6, coord ) );
                                
                                col *= pow( r, .65 ) * 1.75;

                                gl_FragColor = vec4( col, 1.00 );
                            }`;
                        
        this.vertShader = `varying vec4 vwPos;
                           varying vec4 vlPos;

                            void main( ) {
                                vlPos = vec4( position, 1. ); // local position
                                vwPos = modelMatrix * vlPos; // world position

                                gl_Position = projectionMatrix *
                                            modelViewMatrix *
                                            vlPos;
                            }`;
    }
  
    generateMaterial( ) {

      let uniforms = {
          u_resolution: { type: 'vec2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
          u_time: {type: 'float', value: this.clock.getElapsedTime() },
          frequency: {type: 'float', value: 18.0 }
      }
  
      return new THREE.ShaderMaterial( {
        uniforms: uniforms,
        fragmentShader: this.fragShader,
        vertexShader: this.vertShader
      } );
  
    }
  
  }
  