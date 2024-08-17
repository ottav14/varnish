import { initShaderProgram, drawScene } from './shader.js';
import { initBuffers } from './buffers.js';

// Init WebGL canvas
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  console.error('WebGL not supported');
}


document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

// Vertex shader program
const vsSource = `
	attribute vec4 aVertexPosition;
	void main() {
		gl_Position = aVertexPosition;
	}
`;

// Fragment shader program
const fsSource = `	
	precision mediump float;
	uniform vec2 resolution;
	uniform float time;


	float hash21(vec2 st) {
   		return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
	}
	
	float smoothNoise(vec2 p) {
		
		vec2 id = floor(p);
		vec2 pos = fract(p);

		pos = pos*pos*(3.-2.*pos);
		
		float tl = hash21(id);
		float tr = hash21(id + vec2(1., 0.));
		float bl = hash21(id + vec2(0., 1.));
		float br = hash21(id + vec2(1., 1.));

		return mix(
			mix(tl, bl, pos.y),
			mix(tr, br, pos.y),
			pos.x
		);  

	}

	float fbm(vec2 p) {    
		const int numOctaves = 8;
		float zoomRate = 2.;
		float strengthRate = .8;
		float zoom = .5;
		float strength = .2;
		float result = 0.;
    	for(int i=0; i<numOctaves; i++) {
			result += strength * smoothNoise(zoom * p); 
			zoom *= zoomRate;
			strength *= strengthRate;
    	}
    	return min(result, 1.);
	}

	float dd(vec2 p) {

    	vec2 q = vec2(fbm(p + vec2(1.0,1.0)),
                      fbm(p + vec2(5.2,1.3)));

    	vec2 r = vec2(fbm(p + 4.0*q + .1*time*vec2(1.7,9.2)),
                      fbm(p + 4.0*q + .1*time*vec2(8.3,2.8)));

    	return fbm(p + 4.0*r);


	}

	void main() {
		vec2 uv = gl_FragCoord.xy / resolution;

		vec3 palette[4];

		palette[0] = vec3(188., 236., 224.) / 255.;
		palette[1] = vec3(54., 238., 224.) / 255.;
		palette[2] = vec3(246., 82., 160.) / 255.;
		palette[3] = vec3(76., 82., 112.) / 255.;

		float val = 4.*dd(uv + vec2(time, 0.));
		int ix = int(val);

		vec3 col = vec3(0.);

		for(int i=0;i<3;i++) {
			if(i == ix) {
				float t = fract(fract(3.*fract(val)));
				col = mix(palette[i], palette[i+1], t);
			}
		}
	

		gl_FragColor = vec4(col, 1.0);
	}
`;



// Init shader program
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const buffers = initBuffers(gl);

const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
  },
  uniformLocations: {
	resolution: gl.getUniformLocation(shaderProgram, "resolution"),
	time: gl.getUniformLocation(shaderProgram, "time"),
  },
};

function render() {

	drawScene(gl, programInfo, buffers);

	requestAnimationFrame(render);
}

render();

