import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import {
	useDeleteReviewMutation,
	useGetFilteredReviewsQuery,
	useDeleteAllFakeReviewsMutation,
} from "../../redux/api/reviewAPI";
import Button from "../common/Button";
import StarRating from "../common/startRating";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PAGE_SIZE = 8;
const ReviewTable: React.FC = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<"all" | "genuine" | "fake">("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [page, setPage] = useState(1);

	const { data: productsData } = useAllProductsQuery(user?._id!);

	const {
		data: reviewsData,
		isLoading: reviewsLoading,
		refetch,
	} = useGetFilteredReviewsQuery({
		category: selectedCategory,
		filter,
		page,
		search: searchQuery,
		limit: 8,
	});

	const productMap = useMemo(() => {
		const map: Record<string, string> = {};
		productsData?.products.forEach((product) => {
			map[product._id] = product.name;
		});
		return map;
	}, [productsData?.products]);

	const getProductName = (productId: string) =>
		productMap[productId] || "Unknown Product";

	const [deleteReview] = useDeleteReviewMutation();
	const [deleteAllFakeReviews] = useDeleteAllFakeReviewsMutation();

	const categories = [
		"all",
		...new Set(productsData?.products?.map((p) => p.category) || []),
	];

	useEffect(() => {
		setPage(1);
	}, [filter, searchQuery, selectedCategory]);

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this review?")) {
			try {
				await deleteReview(id).unwrap();
				toast.success("Review deleted successfully");
				refetch();
			} catch (error) {
				toast.error("Failed to delete review");
			}
		}
	};

	const handleDeleteAllFake = async () => {
		if (
			window.confirm("Are you sure you want to delete all fake reviews?")
		) {
			try {
				await deleteAllFakeReviews().unwrap();
				toast.success("All fake reviews deleted successfully");
				setPage(1);
				await refetch();
			} catch (error: any) {
				toast.error(
					error?.data?.message || "Failed to delete fake reviews"
				);
			}
		}
	};

	if (reviewsLoading || !reviewsData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-full mx-auto p-4 bg-white rounded shadow">
			<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mb-4">
				{/* Filter buttons */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-semibold text-gray-700 mr-2">
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

				{/* Category dropdown */}
				<div className="w-full sm:w-auto">
					<select
						value={selectedCategory}
						onChange={(e) => {
							setSelectedCategory(e.target.value);
							setPage(1);
						}}
						className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
					>
						<option value="all">All Categories</option>
						{categories
							.filter((category) => category !== "all")
							.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
					</select>
				</div>

				{/* Search input */}
				<div className="w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search products..."
						className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-sm"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setPage(1);
						}}
					/>
				</div>

				{/* Delete button */}
				<div className="w-full sm:w-auto">
					<Button
						size="sm"
						onClick={handleDeleteAllFake}
						className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-white"
					>
						Delete All Fake Reviews
					</Button>
				</div>
			</div>

			{/* Reviews Table */}
			<div className="overflow-x-auto border rounded">
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
						{reviewsData?.reviews?.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No reviews found
								</td>
							</tr>
						) : (
							reviewsData?.reviews?.map((review) => (
								<tr
									key={review._id}
									className="hover:bg-gray-50 cursor-pointer"
									onClick={() =>
										navigate(
											`/product/${review.productId}?reviewId=${review._id}`
										)
									}
								>
									<td className="px-6 py-3 whitespace-nowrap">
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
									<td className="px-6 py-3 text-sm font-medium text-gray-900">
										{getProductName(review.productId)}
									</td>
									<td className="px-6 py-3 text-sm text-gray-500">
										{review.userName}
									</td>
									<td className="px-6 py-3 text-sm text-gray-500">
										<StarRating
											rating={review.rating}
											size="sm"
										/>
									</td>
									<td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">
										{review.comment}
									</td>
									<td className="px-6 py-3 text-sm text-gray-500">
										{new Date(
											review.date
										).toLocaleDateString()}
									</td>
									<td className="px-6 py-3 text-right text-sm font-medium">
										<Button
											variant="danger"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(review._id || "");
											}}
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

			{reviewsData && reviewsData.total > PAGE_SIZE && (
				<Stack
					spacing={2}
					direction="row"
					justifyContent="center"
					className="mt-6"
				>
					<Pagination
						count={reviewsData.totalPages}
						page={page}
						onChange={(_, value) => setPage(value)}
						color="primary"
						shape="rounded"
						siblingCount={1}
						boundaryCount={1}
					/>
				</Stack>
			)}
		</div>
	);
};

export default ReviewTable;
