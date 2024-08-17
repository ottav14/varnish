import Slider from "../Slider/Slider.tsx";
import styles from "./Controls.module.css";

const RandomControls = () => {

	// Zoom
	const zoomMin = 0.001;
	const zoomMax = 100;
	const zoomStep = 0.001;
	const zoomInitial = 20;

	// Timestep
	const timestepMin = 0;
	const timestepMax = 0.01;
	const timestepStep = 0.000001;
	const timestepInitial = 0;

	return (
		<>
			<Slider 
				className={styles.zoom}
				sliderLabel="Zoom"
				min={zoomMin}
				max={zoomMax}
				step={zoomStep}
				initialValue={zoomInitial}
			 />
			<Slider 
				className={styles.timestep}
				sliderLabel="Timestep"
				min={timestepMin}
				max={timestepMax}
				step={timestepStep}
				initialValue={timestepInitial}
			 />
		</>
	);
}

export default RandomControls;
