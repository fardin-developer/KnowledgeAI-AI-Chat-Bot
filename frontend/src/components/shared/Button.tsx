import "./Button.css";

type Props = {
	buttonLabel: string;
	type: "button" | "submit" | "reset";
	className?: string;
};

const Button = (props: Props) => {
	return (
		<button type={props.type} className={props.className}>
			{props.buttonLabel}
		</button>
	);
};

export default Button;
