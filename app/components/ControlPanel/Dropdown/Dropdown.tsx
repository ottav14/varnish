"use client";

import React, { useState, useEffect } from 'react';
import { updateParameter } from "../../../scripts/Parameters.tsx";
import styles from "./Dropdown.module.css";

export default function Dropdown({ children, label, options, update }) {

	const [value, setValue] = useState(0); 
	const [isOpen, setIsOpen] = useState(false);
	
	useEffect(() => {
		updateParameter(label, value);
	}, []);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	}

	const handleItemSelect = (option) => {
		setValue(option);
		setIsOpen(false);
		updateParameter(label, option);
		update(option);
	}
	
	const DropdownItem = ({ itemLabel, clickFunction }) => {
		return (
			<button className={styles.dropdownItem} onClick={clickFunction}>
				{itemLabel}
			</button>
		);
	}
	
	return(

		<div className={styles.main}>
			<p className={styles.dropdownLabel}>{label}</p>
			<DropdownItem itemLabel={options[value]} clickFunction={toggleDropdown} />
			{isOpen &&
				<div className={styles.dropdownContent}>
					{options.map((_, i) => {
						return ( 
							<>
								{i != value &&
								<DropdownItem itemLabel={options[i]} clickFunction={() => handleItemSelect(i)} /> }
							</>
						);
					})}
				</div>
			}
		</div>

	);

}
