import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import {
	useDeleteReviewMutation,
	useGetAllReviewsQuery,
} from "../../redux/api/reviewAPI";
import Button from "../common/Button";
import StarRating from "../common/startRating";

const ReviewTable: React.FC = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const { isLoading: productsLoading, data } = useAllProductsQuery(
		user?._id!
	);

	const {
		data: reviews = [],
		isLoading: reviewsLoading,
		refetch,
	} = useGetAllReviewsQuery();

	const [deleteReview] = useDeleteReviewMutation();

	const [filter, setFilter] = useState<"all" | "genuine" | "fake">("all");

	const filteredReviews = reviews.filter((review) => {
		if (filter === "all") return true;
		if (filter === "genuine") return review.isGenuine;
		if (filter === "fake") return !review.isGenuine;
		return true;
	});

	const productMap = React.useMemo(() => {
		const map: Record<string, string> = {};
		data?.products.forEach((product) => {
			map[product._id] = product.name;
		});
		return map;
	}, [data?.products]);

	const getProductName = (productId: string) =>
		productMap[productId] || "Unknown Product";

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this review?")) {
			try {
				await deleteReview(id).unwrap();
				await refetch();
			} catch (error) {
				console.error("Failed to delete review:", error);
				alert("Failed to delete review.");
			}
		}
	};

	const handleDeleteAllFake = async () => {
		if (
			window.confirm("Are you sure you want to delete all fake reviews?")
		) {
			const fakeReviews = reviews.filter((r) => !r.isGenuine);
			try {
				await Promise.all(
					fakeReviews.map((review) =>
						deleteReview(review._id).unwrap()
					)
				);
				await refetch();
				alert("All fake reviews deleted.");
			} catch (error) {
				console.error("Error deleting fake reviews", error);
				alert("Failed to delete some or all fake reviews.");
			}
		}
	};

	if (productsLoading || reviewsLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<span className="text-sm font-medium text-gray-700">
						Filter:
					</span>
					<Button
						variant={filter === "all" ? "primary" : "outline"}
						size="sm"
						onClick={() => setFilter("all")}
					>
						All
					</Button>
					<Button
						variant={filter === "genuine" ? "secondary" : "outline"}
						size="sm"
						onClick={() => setFilter("genuine")}
					>
						Genuine
					</Button>
					<Button
						variant={filter === "fake" ? "danger" : "outline"}
						size="sm"
						onClick={() => setFilter("fake")}
					>
						Fake
					</Button>
				</div>
				<Button
					size="sm"
					onClick={handleDeleteAllFake}
					className="bg-amber-500 hover:bg-amber-300 text-white"
				>
					Delete All Fake Reviews
				</Button>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Product
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								User
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Rating
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Comment
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredReviews.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No reviews found
								</td>
							</tr>
						) : (
							filteredReviews.map((review) => (
								<tr
									key={review._id}
									className="hover:bg-gray-50"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												review.isGenuine
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{review.isGenuine
												? "Genuine"
												: "Fake"}
										</span>
									</td>
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										{getProductName(review.productId)}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{review.userName}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										<StarRating
											rating={review.rating}
											size="sm"
										/>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
										{review.comment}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{new Date(
											review.date
										).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 text-right text-sm font-medium">
										<Button
											variant="danger"
											size="sm"
											onClick={() =>
												handleDelete(review._id)
											}
										>
											Delete
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ReviewTable;
