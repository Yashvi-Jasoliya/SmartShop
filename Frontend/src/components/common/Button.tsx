import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "danger";
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	children,
	className = "",
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary:
			"bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
		outline:
			"border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
	};

	const sizeStyles = {
		sm: "text-sm px-3 py-1.5",
		md: "text-sm px-4 py-2",
		lg: "text-base px-6 py-3",
	};

	const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

	return (
		<button className={buttonClasses} {...props}>
			{children}
		</button>
	);
};

export default Button;
