"use client";

import React, { useState, useEffect } from 'react';
import { HuePicker } from 'react-color';
import { updateParameter } from "../../../scripts/Parameters.tsx";
import styles from "./ColorPicker.module.css";

const ColorPicker = ({ label }) => {

	const [color, setColor] = useState('#fff'); 
	
	useEffect(() => {
		updateParameter(label, color);
	}, []);

	const handleColorChange = (newColor) => {
		setColor(newColor.hex);
		updateParameter(label, newColor);
	}
	
	return(

		<div className={styles.main}>
			<p className={styles.colorPickerLabel}>{label}</p>
			<HuePicker 
				onChange={handleColorChange}
			/>
		</div>

	);

};

export default ColorPicker;
