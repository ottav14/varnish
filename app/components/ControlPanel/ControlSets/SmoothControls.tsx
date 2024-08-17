import Slider from "../Slider/Slider.tsx";
import styles from "./Controls.module.css";

const SmoothControls = () => {

	// Zoom
	const zoomMin = 0.1;
	const zoomMax = 1000;
	const zoomStep = 0.1;
	const zoomInitial = 50;

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

export default SmoothControls;
