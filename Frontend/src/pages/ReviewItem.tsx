import React from "react";
import { Review } from "../types/types";
import StarRating from "../components/common/startRating";

interface ReviewItemProps {
	review: Review;
	showStatus?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
	review,
	showStatus = false,
}) => {
	const date = new Date(review.date).toLocaleDateString();

	return (
		<div className="border-b border-gray-200 py-4 last:border-b-0">
			<div className="flex items-start justify-between">
				<div>
					<h4 className="text-lg font-medium">{review.userName}</h4>
					<div className="flex items-center mt-1">
						<StarRating rating={review.rating} size="sm" />
						<span className="ml-2 text-sm text-gray-500">
							{date}
						</span>
					</div>
				</div>

				{showStatus && (
					<div
						className={`px-2 py-1 rounded text-sm ${
							review.isGenuine
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{review.isGenuine ? "Genuine" : "Fake"}
					</div>
				)}
			</div>

			<p className="mt-2 text-gray-700">{review.comment}</p>
		</div>
	);
};

export default ReviewItem;
