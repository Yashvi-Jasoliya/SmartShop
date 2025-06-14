import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import ChartsSkeleton from "../../../components/admin/skeleton/ChartsSkeleton";

const LineCharts = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);
	const { data, isError, error, isLoading } = useLineQuery(user?._id!);

	const lineCharts = data?.lineCharts;
	const products = lineCharts?.products || [];
	const discount = lineCharts?.discount || [];
	const revenue = lineCharts?.revenue || [];
	const users = lineCharts?.users || [];

	if (isError && error) {
		const err = error as CustomError;
		toast.error(err?.data?.message || "Something went wrong");
		return <Navigate to={"/admin/dashboard"} />;
	}

	if (isLoading) return <ChartsSkeleton />;
	if (!lineCharts) {
		toast.error("Error to fetch Charts");
		return null;
	}

	return (
		<div className="adminContainer">
			<AdminSidebar />
			<main className="chartContainer">
				<h1 className="text-2xl font-bold mb-6">Line Charts</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<section className="bg-white p-6 px-5 rounded shadow">
						<LineChart
							data={users}
							label="Users"
							backgroundColor="hsl(240, 80%, 75%)"
							borderColor="hsl(240, 80%, 55%)"
							labels={lineCharts.twelveMonths}
						/>
						<h2 className="mt-4 text-center text-lg font-medium">
							Active Users
						</h2>
					</section>

					<section className="bg-white p-6 px-5 rounded shadow">
						<LineChart
							data={products}
							backgroundColor={"hsla(269,80%,40%,0.4)"}
							borderColor={"hsl(269,80%,40%)"}
							label="Products"
							labels={lineCharts.twelveMonths}
						/>
						<h2 className="mt-4 text-center text-lg font-medium">
							Total Products (SKU)
						</h2>
					</section>

					<section className="bg-white p-6 px-5 rounded shadow">
						<LineChart
							data={revenue}
							backgroundColor={"hsla(129,80%,40%,0.4)"}
							borderColor={"hsl(129,80%,40%)"}
							label="Revenue"
							labels={lineCharts.twelveMonths}
						/>
						<h2 className="mt-4 text-center text-lg font-medium">
							Total Revenue
						</h2>
					</section>

					<section className="bg-white p-6 px-5 rounded shadow">
						<LineChart
							data={discount}
							backgroundColor={"hsla(29,80%,40%,0.4)"}
							borderColor={"hsl(29,80%,40%)"}
							label="Discount"
							labels={lineCharts.twelveMonths}
						/>
						<h2 className="mt-4 text-center text-lg font-medium">
							Discount Allotted
						</h2>
					</section>
				</div>
			</main>
		</div>
	);
};

export default LineCharts;
