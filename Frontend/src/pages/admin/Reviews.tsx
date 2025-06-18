import React, { useState } from "react";
import { useGetReviewStatsQuery } from "../../redux/api/reviewAPI";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Button from "../../components/common/Button";
import ProductTable from "../../components/admin/ProductTable";
import ReviewTable from "../../components/admin/ReviewTable";
import { useGetProductStatsQuery } from "../../redux/api/productAPI";
import HeaderBar from "../../components/HeaderBar";

const AdminPanel: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"products" | "reviews">(
		"reviews"
	);
	const { data: productStats } = useGetProductStatsQuery();

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
			<main className="productPage w-full flex flex-col">
				<HeaderBar />

				<section className="mt-7">
					<h1 className="text-2xl font-bold text-gray-900">
						Reviews
					</h1>
					<p className="text-gray-500 mt-1">
						Manage reviews and products
					</p>
				</section>
                
				<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 pl-1">
					{[
						{
							label: "Total Products",
							value: productStats?.total ?? 0,
						},
						{ label: "Total Reviews", value: stats.total },
						{
							label: "Genuine Reviews",
							value: stats.genuine,
							color: "text-green-600",
						},
						{
							label: "Fake Reviews",
							value: stats.fake,
							color: "text-red-600",
						},
					].map(({ label, value, color }, i) => (
						<div
							key={i}
							className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between h-full min-h-[120px]"
						>
							<span className="text-sm text-gray-500 font-medium">
								{label}
							</span>
							<span
								className={`text-2xl font-bold mt-2 ${
									color ?? "text-gray-900"
								}`}
							>
								{value}
							</span>
						</div>
					))}
				</section>

				<section className="border-b border-gray-200 mt-5">
					<div className="flex gap-3">
						<Button
							variant={
								activeTab === "reviews" ? "primary" : "outline"
							}
							className={`py-2 px-4 font-medium rounded-t-md ${
								activeTab === "reviews"
									? "text-blue-600 border-b-2 border-blue-500"
									: "text-gray-500 border-b-2 border-transparent"
							}`}
							onClick={() => setActiveTab("reviews")}
						>
							Reviews
						</Button>
						<Button
							variant={
								activeTab === "products" ? "primary" : "outline"
							}
							className={`py-2 px-4 font-medium rounded-t-md ${
								activeTab === "products"
									? "text-blue-600 border-b-2 border-blue-500"
									: "text-gray-500 border-b-2 border-transparent"
							}`}
							onClick={() => setActiveTab("products")}
						>
							Products
						</Button>
					</div>
				</section>

				{/* Table Content */}
				<section className="bg-white rounded-2xl mr-5">
					{activeTab === "products" && <ProductTable />}
					{activeTab === "reviews" && <ReviewTable />}
				</section>
			</main>
		</div>
	);
};

export default AdminPanel;
