import React from "react";

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	onChange?: (rating: number) => void;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxRating = 5,
	onChange,
	size = "md",
	className = "",
}) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	};

	const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

	return (
		<div className={`flex items-center ${className}`}>
			{stars.map((star) => (
				<Star
					key={star}
					filled={star <= rating}
					onClick={onChange ? () => onChange(star) : undefined}
					size={sizeClasses[size]}
					interactive={!!onChange}
				/>
			))}
		</div>
	);
};

interface StarProps {
	filled: boolean;
	onClick?: () => void;
	size: string;
	interactive: boolean;
}

const Star: React.FC<StarProps> = ({ filled, onClick, size, interactive }) => {
	return (
		<svg
			className={`${size} ${
				filled ? "text-yellow-400" : "text-gray-300"
			} ${interactive ? "cursor-pointer" : ""}`}
			fill="currentColor"
			viewBox="0 0 20 20"
			onClick={onClick}
		>
			<path
				d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0
        00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364
        1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0
        00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1
        0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
        00.951-.69l1.07-3.292z"
			/>
		</svg>
	);
};

export default StarRating;
