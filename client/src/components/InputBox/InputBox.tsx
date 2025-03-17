import React from "react";
import classes from "./InputBox.module.css";

interface InputBoxProps {
	type: string,
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	autoComplete?: string;
	label: string;
	required: boolean;
}

const InputBox: React.FC<InputBoxProps> = (props: InputBoxProps) => {

	return (
		<div className={classes["input-box"]}>
			<input  
			type={props.type}
			required={props.required}
			value={props.value}
			onChange={props.onChange}
			placeholder={props.placeholder}
			autoComplete={props.autoComplete}
			/>
			<label>{props.label}</label>
		</div>
	);
}

export default InputBox;