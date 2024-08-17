"use client"

import styles from "./page.module.css";
import Noise from "./components/Noise.tsx";
import ControlPanel from "./components/ControlPanel/ControlPanel.tsx";

export default function Home() {

	const width = Math.floor(0.8 * window.innerWidth);
	const height = window.innerHeight;
	
	return (
		<div className={styles.main}>
			<Noise className={styles.noise} canvasWidth={width} canvasHeight={height} />
			<ControlPanel className={styles.controlPanel} />
		</div>
	);
}
