"use client";

import React, { useState, useEffect } from 'react';
import { updateParameter } from "../../../scripts/Parameters.tsx";
import styles from "./Slider.module.css";

export default function Slider({ min = 0, max = 100, step = 1, initialValue = 50, sliderLabel= "Value" }) {

	const [value, setValue] = useState(initialValue); 
	
	useEffect(() => {
		updateParameter(sliderLabel, value);
	}, []);
	

	function handleChange(event) {
		setValue(Number(event.target.value));
		updateParameter(sliderLabel, value);
	}

	return(

		<div className={styles.main}>
			<p className={styles.sliderLabel}>
				{sliderLabel}
			</p>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={handleChange}
				className={styles.slider}
			/>
			<p className={styles.sliderValue}>
				{value}
			</p>
		</div>

	);

}
