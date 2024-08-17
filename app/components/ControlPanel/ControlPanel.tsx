"use client"

import styles from "./ControlPanel.module.css";
import { useState, useEffect } from 'react';
import Slider from "./Slider/Slider.tsx";
import Dropdown from "./Dropdown/Dropdown.tsx";
import RandomControls from "./ControlSets/RandomControls.tsx";
import SmoothControls from "./ControlSets/SmoothControls.tsx";
import FbmControls from "./ControlSets/FbmControls.tsx";
import DomainControls from "./ControlSets/DomainControls.tsx";
import { parameters } from "../../scripts/Parameters.tsx";

export default function ControlPanel() {

	// Noise type
	const noiseTypes = [
		"Random",
		"Smooth",
		"FBM",
		"Domain distorted"
	];

	const [controlSet, updateControlSet] = useState(0);
	
	return (
		<div className={styles.main}>
			<div className={styles.controlContainer}>
				<Dropdown
					className={styles.noiseType}
					label="Noise type"
					initialValue="Random"
					options={noiseTypes}
					update={updateControlSet}
				/>
				{controlSet == 0 && <RandomControls className={styles.controlSet} />}
				{controlSet == 1 && <SmoothControls className={styles.controlSet} />}
				{controlSet == 2 && <FbmControls className={styles.controlSet} />}
				{controlSet == 3 && <DomainControls className={styles.controlSet} />}
			</div>
		</div>
	);
}
