import React, { useState, useEffect } from "react";
import Button from "../components/common/Button";
import {
	useCreateReviewMutation,
	useGetProductReviewsQuery,
} from "../redux/api/reviewAPI";
import { IReview } from "../types/api-types";
import StarRating from "../components/common/startRating";

interface ReviewFormProps {
	productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
	const [userName, setUserName] = useState("");
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const [createReview, { isLoading, isError, isSuccess }] =
		useCreateReviewMutation();

	const {
		data: reviews = [],
		isLoading: isReviewLoading,
		refetch,
	} = useGetProductReviewsQuery(productId);

	const [localReviews, setLocalReviews] = useState<IReview[]>([]);

	useEffect(() => {
		if (reviews) {
			setLocalReviews(reviews);
		}
	}, [reviews]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const reviewData: IReview = {
			productId,
			userName,
			rating,
			comment,
			date: new Date(),
		};

		try {
			const result = await createReview(reviewData).unwrap();
			setLocalReviews((prev) => [result, ...prev]);
			setUserName("");
			setRating(0);
			setComment("");
			refetch(); // ensure backend reviews are up to date
		} catch (error) {
			console.error("Failed to submit review:", error);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			{/* Review Form */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-8">
				<h2 className="text-xl font-semibold mb-4">Write a Review</h2>
				<form onSubmit={handleSubmit}>
					{isSuccess && (
						<div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
							Your review has been submitted! Thank you.
						</div>
					)}

					{isError && (
						<div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
							Failed to submit review. Please try again.
						</div>
					)}

					<div className="mb-4">
						<label
							htmlFor="userName"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Your Name
						</label>
						<input
							type="text"
							id="userName"
							required
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="mb-4">
						<span className="block text-sm font-medium text-gray-700 mb-1">
							Rating
						</span>
						<StarRating
							rating={rating}
							onChange={setRating}
							size="lg"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="comment"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Your Review
						</label>
						<textarea
							id="comment"
							required
							rows={4}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Share your thoughts about this product..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<Button
						type="submit"
						variant="primary"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Submitting..." : "Submit Review"}
					</Button>
				</form>
			</div>

			{/* Review List */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

				{isReviewLoading ? (
					<p className="text-gray-500">Loading reviews...</p>
				) : localReviews.length === 0 ? (
					<p className="text-gray-500 py-4">
						No reviews yet. Be the first to review!
					</p>
				) : (
					<div className="space-y-6">
						{localReviews.map((review) => (
							<div
								key={review.id || review.id || Math.random()}
								className="border-b border-gray-200 pb-6 last:border-0"
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900">
										{review.userName || "Anonymous"}
									</h4>
									<div className="flex items-center">
										<StarRating
											rating={review.rating || 0}
											size="sm"
										/>
										<span className="ml-2 text-sm text-gray-500">
											{review.date
												? new Date(
														review.date
												  ).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
												  )
												: "No date"}
										</span>
									</div>
								</div>
								<p className="text-gray-600">
									{review.comment || "No comment provided"}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ReviewForm;
