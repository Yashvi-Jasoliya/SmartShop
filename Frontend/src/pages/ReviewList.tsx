import React from "react";
import { Review } from "../types/types";
import Card, { CardBody } from "../components/common/Card";
import ReviewItem from "./ReviewItem";

interface ReviewListProps {
	reviews: Review[];
	showStatus?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
	reviews = [],
	showStatus = false,
}) => {
	if (reviews.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No reviews yet. Be the first to leave a review!
			</div>
		);
	}

	return (
		<Card>
			<CardBody>
				<h3 className="text-lg font-medium mb-4">
					{reviews.length}{" "}
					{reviews.length === 1 ? "Review" : "Reviews"}
				</h3>
				<div className="divide-y divide-gray-200">
					{reviews.map((review) => (
						<ReviewItem
							key={review.id}
							review={review}
							showStatus={showStatus}
						/>
					))}
				</div>
			</CardBody>
		</Card>
	);
};

export default ReviewList;
