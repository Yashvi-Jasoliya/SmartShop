import React, { useState } from "react";
import { useGetReviewStatsQuery } from "../../redux/api/reviewAPI";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Button from "../../components/common/Button";
import ProductTable from "../../components/admin/ProductTable";
import ReviewTable from "../../components/admin/ReviewTable";
import { useGetProductStatsQuery } from "../../redux/api/productAPI";
import Products from "./Products";

const AdminPanel: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"products" | "reviews">(
		"reviews"
	);
	const {
		data: productStats,
	} = useGetProductStatsQuery();
    
	const {
		data: stats,
		isLoading: statsLoading,
		isError,
	} = useGetReviewStatsQuery();

	if (statsLoading) return <div>Loading stats...</div>;
	if (isError || !stats) return <div>Error loading stats</div>;

	return (
		<div className="adminContainer">
			<AdminSidebar />
			<div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-10">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">
						Reviews
					</h1>
					<p className="mt-2 text-gray-600">
						Manage reviews for e-commerce store
					</p>
				</div>

				{/* Stats cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white shadow rounded-lg p-6">
						<div className="text-sm font-medium text-gray-500">
							Total Products
						</div>
						<div className="mt-2 text-3xl font-semibold text-gray-900">
							{productStats?.total}
						</div>
					</div>
					<div className="bg-white shadow rounded-lg p-6">
						<div className="text-sm font-medium text-gray-500">
							Total Reviews
						</div>
						<div className="mt-2 text-3xl font-semibold text-gray-900">
							{stats.total}
						</div>
					</div>
					<div className="bg-white shadow rounded-lg p-6">
						<div className="text-sm font-medium text-gray-500">
							Genuine Reviews
						</div>
						<div className="mt-2 text-3xl font-semibold text-green-600">
							{stats.genuine}
						</div>
					</div>
					<div className="bg-white shadow rounded-lg p-6">
						<div className="text-sm font-medium text-gray-500">
							Fake Reviews
						</div>
						<div className="mt-2 text-3xl font-semibold text-red-600">
							{stats.fake}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="border-b border-gray-200 mb-6">
					<div className="flex -mb-px">
						<Button
							variant={
								activeTab === "reviews" ? "primary" : "outline"
							}
							className={`mr-4 py-2 px-4 ${
								activeTab === "reviews"
									? "border-b-2 border-blue-500 text-blue-600"
									: "border-b-2 border-transparent text-gray-500"
							}`}
							onClick={() => setActiveTab("reviews")}
						>
							Reviews
						</Button>
						<Button
							variant={
								activeTab === "products" ? "primary" : "outline"
							}
							className={`mr-4 py-2 px-4 ${
								activeTab === "products"
									? "border-b-2 border-blue-500 text-blue-600"
									: "border-b-2 border-transparent text-gray-500"
							}`}
							onClick={() => setActiveTab("products")}
						>
							Products
						</Button>
					</div>
				</div>

				{/* Tab content */}
				<div className="bg-white shadow rounded-lg overflow-hidden">
					{activeTab === "products" && <ProductTable />}
					{activeTab === "reviews" && <ReviewTable />}
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
