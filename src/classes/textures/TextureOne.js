import * as THREE from "three";

export default class TextureOne{
    constructor( ){
        
        this.clock = new THREE.Clock;  
        this.clock.start( );
        
        // https://www.shadertoy.com/view/Xs2GDd
        this.fragShader = `#ifdef GL_ES
                            precision mediump float;
                            #endif
    
                            #define PI 3.14159265359
    
                            uniform vec2 u_resolution;
                            uniform float u_time;

                            varying vec4 vwPos;
                            varying vec4 vlPos;
    
                            vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
                            vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
                            vec3 col3 = vec3(0.867, 0.910, 0.247); // red

                            float disk(vec2 r, vec2 center, float radius) {
                                return 1.0 - smoothstep( radius-0.008, radius+0.008, length(r-center));
                            }


                            void main(){
                                float t = u_time*2.;
                                vec2 r = (2.0*gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
                                r *= 1.0 + 0.05*sin(r.x*5.+u_time) + 0.05*sin(r.y*3.+u_time);
                                r *= 1.0 + 0.2*length(r);
                                float side = 0.5;
                                vec2 r2 = mod(r, side);
                                vec2 r3 = r2-side/2.;
                                float i = floor(r.x/side)+2.;
                                float j = floor(r.y/side)+4.;
                                float ii = r.x/side+2.;
                                float jj = r.y/side+4.;	
                                
                                vec3 pix = vec3(1.0);
                                
                                float rad, disks;
                                    
                                rad = 0.15 + 0.05*sin(t+ii*jj);
                                disks = disk(r3, vec2(0.,0.), rad);
                                pix = mix(pix, col2, disks);

                                float speed = 2.0;
                                float tt = u_time*speed+0.1*i+0.08*j;
                                float stopEveryAngle = PI/2.0;
                                float stopRatio = 0.7;
                                float t1 = (floor(tt) + smoothstep(0.0, 1.0-stopRatio, fract(tt)) )*stopEveryAngle;
                                    
                                float x = -0.07*cos(t1+i);
                                float y = 0.055*(sin(t1+j)+cos(t1+i));
                                rad = 0.1 + 0.05*sin(t+i+j);
                                disks = disk(r3, vec2(x,y), rad);
                                pix = mix(pix, col1, disks);
                                
                                rad = 0.2 + 0.05*sin(t*(1.0+0.01*i));
                                disks = disk(r3, vec2(0.,0.), rad);
                                pix += 0.2*col3*disks * sin(t+i*j+i);

                                pix -= smoothstep(0.3, 5.5, length(r));	

                                gl_FragColor = vec4( pix, 1.00 );
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
      }
  
      return new THREE.ShaderMaterial( {
        uniforms: uniforms,
        fragmentShader: this.fragShader,
        vertexShader: this.vertShader
      } );
  
    }
  
  }
  