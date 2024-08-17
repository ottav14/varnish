"use client";

import React, { useRef, useEffect } from 'react';
import { parameters } from "../scripts/Parameters.tsx";

let time = 0;

export default function Noise({ children, canvasWidth, canvasHeight }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas.getContext('webgl2');

		if (!gl) {
			console.error('WebGL 2.0 not supported');
			return;
		}

		// Set the clear color to black and clear the canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Vertex shader program
		const vertexShaderSource = `
		attribute vec4 a_position;
		void main() {
			gl_Position = a_position;
		}
		`;

		// Fragment shader program
		const fragmentShaderSource = `
		precision mediump float;

		uniform vec2 resolution;
		uniform float time;
		uniform float zoom;
		uniform int noiseType;

		float hash(vec2 p) {
			const vec2 PRIME = vec2(0.7386, 0.3855);
			p = fract(p * PRIME);
			p += dot(p, p.yx + vec2(21.0, 9.0));
			return fract((p.x + p.y) * p.x * 4.1);
		}

		float smoothNoise(vec2 p) {
			
			vec2 id = floor(p);
			vec2 pos = fract(p);

			pos = pos*pos*(3.-2.*pos);
			
			float tl = hash(id);
			float tr = hash(id + vec2(1., 0.));
			float bl = hash(id + vec2(0., 1.));
			float br = hash(id + vec2(1., 1.));

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

			vec2 uv = 2.*gl_FragCoord.xy / resolution - 1.;
			uv += vec2(time, 0.);
			uv *= zoom;

			float val = 0.;

			if(noiseType == 1) {
				val = smoothNoise(uv);
			}
			else if(noiseType == 2) {
				val = fbm(uv);
			}
			else if(noiseType == 3) {
				val = dd(uv);
			}	
			else {
				val = hash(uv);
			}

			vec3 col = vec3(val);

			gl_FragColor = vec4(col, 1.); 
		}
		`;

		// Compile shader
		const compileShader = (source, type) => {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error(gl.getShaderInfoLog(shader));
				gl.deleteShader(shader);
				return null;
			}
			return shader;
		};

		const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

		// Create and link program
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error('Program failed to link');
			return;
		}

		gl.useProgram(shaderProgram);

		// Define vertices for a triangle
		const vertices = new Float32Array([
				-1.0,  1.0,
				-1.0, -1.0, 
				1.0,  1.0,
				1.0, -1.0
		]);

		// Create and bind buffer
		const buffer = gl.createBuffer();

		// Get attribute location 
		const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');

		// Get uniform locations
		const resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
		const timeLocation = gl.getUniformLocation(shaderProgram, "time");
		const timestepLocation = gl.getUniformLocation(shaderProgram, "timestep");
		const zoomLocation = gl.getUniformLocation(shaderProgram, "zoom");
		const noiseTypeLocation = gl.getUniformLocation(shaderProgram, "noiseType");

		function render() {

			gl.useProgram(shaderProgram);

			// Set position attribute
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			// Update uniform values
			const timeStep = Number(parameters.get("Timestep"));
			if(timeStep)
				time += timeStep;

			// Set uniform values
			gl.uniform2f(
					resolutionLocation,
					canvasWidth,
					canvasHeight
					);

			gl.uniform1f(
					timeLocation,
					time
					);
	
			gl.uniform1f(
					zoomLocation,
					parameters.get("Zoom")
					);					

			
			gl.uniform1i(
					noiseTypeLocation,
					parameters.get("Noise type")
					);					


			// Draw the quad 
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

			requestAnimationFrame(render);

		}

		render();

	}, []); 


	return (
			<canvas
				ref={canvasRef}
				width={canvasWidth}
				height={canvasHeight}
				style={{ border: '1px solid black' }}
			/>
		   );
};


