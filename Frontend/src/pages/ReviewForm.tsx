import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import Button from "../components/common/Button";
import {
	useCreateReviewMutation,
	useGetProductReviewsQuery,
} from "../redux/api/reviewAPI";
import { IReview } from "../types/api-types";
import StarRating from "../components/common/startRating";
import { FaMicrophone, FaMicrophoneSlash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";

interface ReviewFormProps {
	productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
	const [userName, setUserName] = useState("");
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const [localReviews, setLocalReviews] = useState<IReview[]>([]);
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<any>(null);

	const [selectedRating, setSelectedRating] = useState("all");

	const [createReview, { isLoading, isError, isSuccess }] =
		useCreateReviewMutation();

	const {
		data: reviews = [],
		isLoading: isReviewLoading,
		refetch,
	} = useGetProductReviewsQuery(productId);

	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const isLoggedIn = !!user;

	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			toast.error("Voice commands not supported in your browser");
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = false;
		recognition.lang = "en-US";
		recognitionRef.current = recognition;

		recognition.onresult = (event: any) => {
			const transcript =
				event.results[
					event.results.length - 1
				][0].transcript.toLowerCase();

			setComment((prev) => {
				const cleanTranscript =
					transcript === "period" ? "." : transcript;
				return prev ? `${prev} ${cleanTranscript}` : cleanTranscript;
			});
		};

		recognition.onerror = (event: any) => {
			if (event.error !== "aborted") {
				toast.error(`Voice error: ${event.error}`);
			}
			setIsListening(false);
		};

		return () => {
			recognition.stop();
		};
	}, []);

	useEffect(() => {
		if (!recognitionRef.current) return;

		if (isListening) {
			recognitionRef.current.start();
			toast.loading("Listening... Say your review", { id: "voice" });
		} else {
			recognitionRef.current.stop();
			toast.dismiss("voice");
		}
	}, [isListening]);

	const toggleListening = async () => {
		try {
			if (!isLoggedIn) {
				toast.error("login to add review by voice");
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			stream.getTracks().forEach((track) => track.stop());

			setIsListening((prev) => !prev);
		} catch (error) {
			toast.error(
				"Microphone access required. Enable it in your browser settings"
			);
			setIsListening(false);
		}
	};

	useEffect(() => {
		if (image) {
			const objectUrl = URL.createObjectURL(image);
			setPreview(objectUrl);

			return () => URL.revokeObjectURL(objectUrl);
		} else {
			setPreview(null);
		}
	}, [image]);

	useEffect(() => {
		if (reviews) {
			setLocalReviews(reviews);
		}
	}, [reviews]);

	useEffect(() => {
		if (user?.displayName) {
			setUserName(user.displayName);
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isLoggedIn) {
			navigate("/login");
			return;
		}

		if (rating === 0) {
			toast.error("Rating required");
			return;
		}

		const reviewData: IReview = {
			productId,
			userId: user?.uid,
			userName: user?.displayName || "Anonymous",
			rating,
			comment,
			date: new Date(),
			imageUrl: "/uploads",
		};

		try {
			const result = await createReview(reviewData).unwrap();
			setLocalReviews((prev) => [result, ...prev]);
			setRating(0);
			setComment("");
			setImage(image);
			toast.success("Review submitted successfully!");
			refetch();
		} catch (error: any) {
			console.error("Review submission error:", error);

			if (error.data?.message) {
				toast.error(error.data.message);
			} else if (error.status === 403) {
				toast.error("Please purchase the product first");
			} else {
				toast.error("Failed to submit review. Please try again.");
			}
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
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
							disabled={!!user?.displayName}
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

					<div className="mb-4 relative">
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
							onChange={(e) => {
								const value = e.target.value.trimStart();
								if (!/^\d+$/.test(value)) {
									setComment(value);
								}
							}}
							placeholder="Share your reviews about this product..."
							className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>

						<button
							type="button"
							onClick={toggleListening}
							className={`absolute bottom-2 right-2 p-1 rounded-full ${
								isListening
									? "bg-red-100 text-red-600 animate-pulse"
									: "bg-gray-100 text-gray-600"
							}`}
							aria-label={
								isListening
									? "Stop listening"
									: "Start voice input"
							}
						>
							{isListening ? (
								<FaMicrophone />
							) : (
								<FaMicrophoneSlash />
							)}
						</button>
					</div>

					<div className="mb-4">
						<label
							htmlFor="image"
							className="form-label flex items-center gap-2 cursor-pointer text-sm"
						>
							Image (optional)
							<FaUpload className="text-gray-400" />
						</label>
						<input
							id="image"
							type="file"
							accept="image/jpeg,image/jpg,image/png"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const validTypes = [
										"image/jpeg",
										"image/jpg",
										"image/png",
									];
									if (!validTypes.includes(file.type)) {
										toast.error(
											"Only JPG, JPEG, and PNG files are allowed."
										);
										e.target.value = "";
										return;
									}
									setImage(file);
								}
							}}
							className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:text-gray-500 file:font-semibold"
						/>
						{preview && (
							<div className="relative mt-2 inline-block">
								<img
									src={preview}
									alt="Preview"
									className="h-24 object-cover rounded border"
								/>
								<button
									type="button"
									onClick={() => {
										setImage(null);
										setPreview(null);
									}}
									className="absolute top-0 right-0 bg-white text-red-600 rounded-full shadow px-1.5 py-0.5 text-xs hover:bg-red-100"
									aria-label="Remove image"
									title="Remove image"
								>
									×
								</button>
							</div>
						)}
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
				<h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>

				{!isReviewLoading && reviews.length > 0 && (
					<div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-4">
						<div className="flex items-center gap-2">
							<label className="text-sm text-gray-600">
								Filter by:
							</label>
							<select
								value={selectedRating}
								onChange={(e) => {
									const ratingValue = e.target.value;
									setSelectedRating(ratingValue);
									if (ratingValue === "all") {
										setLocalReviews(reviews);
									} else {
										const filtered = reviews.filter(
											(r) =>
												r.rating ===
												parseInt(ratingValue)
										);
										setLocalReviews(
											filtered.length > 0 ? filtered : []
										);
									}
								}}
								className="border rounded px-2 py-1 text-sm"
							>
								<option value="all">All Ratings</option>
								<option value="5">5 Stars</option>
								<option value="4">4 Stars</option>
								<option value="3">3 Stars</option>
								<option value="2">2 Stars</option>
								<option value="1">1 Star</option>
							</select>
						</div>
					</div>
				)}

				{isReviewLoading ? (
					<p className="text-gray-500">Loading reviews...</p>
				) : localReviews.length === 0 ? (
					<p className="text-gray-500 py-4">
						{selectedRating !== "all"
							? `${selectedRating} star reviews not available`
							: "No reviews yet. Be the first to review!"}
					</p>
				) : (
					<div className="space-y-6">
						{localReviews.map((review) => (
							<div
								key={review.id || Math.random()}
								className="border-b border-gray-200 pb-6 last:border-0"
							>
								<div className="flex items-center justify-between">
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

								<div className="md:block flex items-center gap-2 flex-wrap sm:flex-nowrap">
									{review && (
										<span
											className="inline-flex items-center text-xs text-green-600 mt-1 sm:mt-0"
											style={{ marginRight: "185px" }}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3.5 w-3.5 mr-1"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											Verified
										</span>
									)}
								</div>

								<p className="text-gray-600 mb-1">
									{review.comment || "No comment provided"}
								</p>

								{review.imageUrl && (
									<img
										src={review.imageUrl}
										alt="Review"
										className="h-24 object-cover rounded border"
									/>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ReviewForm;
