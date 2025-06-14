import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import ChartsSkeleton from "../../../components/admin/skeleton/ChartsSkeleton";
import { useGetReviewStatsQuery } from "../../../redux/api/reviewAPI";

const PieCharts = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { data, isError, error, isLoading } = usePieQuery(user?._id!);

	const pieCharts = data?.pieCharts;

	const {
		data: reviewStats,
		isLoading: isStatsLoading,
		error: statsError,
	} = useGetReviewStatsQuery();

	if (isError && error) {
		const err = error as CustomError;
		toast.error(err?.data?.message || "Something went wrong");
		return <Navigate to={"/admin/dashboard"} />;
	}

	if (isLoading) return <ChartsSkeleton />;
	if (!pieCharts) return toast.error("Error to fetch Charts");

	return (
		<div className="adminContainer">
			<AdminSidebar />
			<main className="pieChartContainer">
				<h1 className="text-xl">Pie & Doughnut Charts</h1>

				{/* First row */}
				<div className="chart-row">
					<div className="chart-col">
						<PieChart
							labels={["Processing", "Shipped", "Delivered"]}
							data={[
								pieCharts.orderFullfillment.processing,
								pieCharts.orderFullfillment.shipped,
								pieCharts.orderFullfillment.delivered,
							]}
							backgroundColor={[
								`hsl(110,80%, 80%)`,
								`hsl(110,80%, 50%)`,
								`hsl(110,40%, 50%)`,
							]}
							offset={[0, 0, 50]}
						/>
						<h2>Order Fulfillment Ratio</h2>
					</div>

					<div className="chart-col">
						<DoughnutChart
							labels={pieCharts.productCategories.map(
								(i) => Object.keys(i)[0]
							)}
							data={pieCharts.productCategories.map(
								(i) => Object.values(i)[0]
							)}
							backgroundColor={pieCharts.productCategories.map(
								(_, index) =>
									`hsl(${
										((index * 360) /
											pieCharts.productCategories
												.length) %
										360
									}, 70%, 65%)`
							)}
							legends={false}
							offset={[0, 0, 70]}
						/>
						<h2>Product Categories Ratio</h2>
					</div>
				</div>

				{/* Second row */}
				<div className="chart-row">
					<div className="chart-col">
						<DoughnutChart
							labels={["In Stock", "Out of Stock"]}
							data={[
								pieCharts.stockAvailability.inStock,
								pieCharts.stockAvailability.outOfStock,
							]}
							backgroundColor={[
								"hsl(269, 80%, 50%)",
								"rgb(53,162,255)",
							]}
							legends={false}
							offset={[0, 70]}
							cutout={"60%"}
						/>
						<h2>Stock Availability</h2>
					</div>

					<div className="chart-col">
						<DoughnutChart
							labels={[
								"Marketing Cost",
								"Discount",
								"Burnt",
								"Production Cost",
								"Net Margin",
							]}
							data={[
								pieCharts.revenueDistribution.marketingCost,
								pieCharts.revenueDistribution.discount,
								pieCharts.revenueDistribution.burnt,
								pieCharts.revenueDistribution.productionCost,
								pieCharts.revenueDistribution.netMargin,
							]}
							backgroundColor={[
								"hsl(110,80%,40%)",
								"hsl(19,80%,40%)",
								"hsl(69,80%,40%)",
								"hsl(300,80%,40%)",
								"rgb(53, 162, 255)",
							]}
							legends={false}
							offset={[20, 30, 20, 30, 80]}
						/>
						<h2>Revenue Distribution</h2>
					</div>
				</div>

				{/* Third row */}
				<div className="chart-row">
					<div className="chart-col">
						<PieChart
							labels={[
								"Teenager(Below 20)",
								"Adult (20-40)",
								"Older (above 40)",
							]}
							data={[
								pieCharts.usersAgeGroup.teen,
								pieCharts.usersAgeGroup.adult,
								pieCharts.usersAgeGroup.senior,
							]}
							backgroundColor={[
								`hsl(10, 80%, 80%)`,
								`hsl(180, 50%, 55%)`,
								`hsl(10, 40%, 50%)`,
							]}
							offset={[0, 0, 50]}
						/>
						<h2>Users Age Group</h2>
					</div>

					<div className="chart-col">
						<DoughnutChart
							labels={["Admin", "Customers"]}
							data={[
								pieCharts.adminCustomers.admin,
								pieCharts.adminCustomers.customer,
							]}
							backgroundColor={[
								"hsl(335, 100%, 38%)",
								"hsl(44, 98%, 50%)",
							]}
							offset={[0, 40]}
						/>
						<h2>Admin-Customer Ratio</h2>
					</div>
				</div>

				{/* Final row (single column) */}
				<div className="chart-row">
					<div className="chart-col">
						{isStatsLoading ? (
							<p>Loading chart...</p>
						) : statsError || !reviewStats ? (
							<p>Error loading review stats</p>
						) : (
							<DoughnutChart
								labels={["Genuine", "Fake"]}
								data={[
									reviewStats.genuine || 0,
									reviewStats.fake || 0,
								]}
								backgroundColor={[
									"hsl(243, 77%, 58%)",
									"hsl(0, 83%, 60%)",
								]}
								offset={[0, 40]}
							/>
						)}
						<h2>Genuine-Fake Reviews Ratio</h2>
					</div>
				</div>
			</main>
		</div>
	);
};

export default PieCharts;
