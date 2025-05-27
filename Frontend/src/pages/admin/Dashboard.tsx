import toast from 'react-hot-toast';
import { BiMaleFemale } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa6';
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import userImg from '../../assets/images/userpic.png';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { BarChart, DoughnutChart } from '../../components/admin/Charts';
import Table from '../../components/admin/DashboardTable';
import { useStatsQuery } from '../../redux/api/dashboardAPI';
import { RootState } from '../../redux/store';
import { CustomError } from '../../types/api-types';
import DashboardSkeleton from '../../components/admin/skeleton/DashboardSkeleton';
// import AdminNotification from '../../components/admin/AdminNotification';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiLogOut } from 'react-icons/fi';
import { NotificationBell } from '../../components/admin/NotificationBell';
import { useGetNotificationsQuery } from '../../redux/api/notificationAPI';



const Dashboard = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
 
    const { data, isError, error, isLoading } = useStatsQuery(user?._id!);

    const stats = data?.Statistics;
    const navigate = useNavigate();
    const [showLogoutBox, setShowLogoutBox] = useState(false);

	const handleLogout = async () => {
		const auth = getAuth();

		try {
			await signOut(auth);
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Failed to logout");
		}
	};


    if (isError && error) {
        const err = error as CustomError;
        toast.error(err?.data?.message || 'Something went wrong');
        return <Navigate to={'/'} />;
    }

    if (isLoading) return <DashboardSkeleton />;
   if (!stats) {
		toast.error("Error to fetch Statistics");
		return null;
   }

  

    return (
		<div className="adminContainer">
			<AdminSidebar />
			<main className="dashboard">
				<div className="bar">
					<div className="searchBar">
						<BsSearch />
					</div>

					<input
						type="text"
						placeholder="Search for data, users, docs"
					/>
					<div className="flex items-center gap-2">
						{user?._id && <NotificationBell userId={user._id} />}

						<div className="relative">
							<img
								src={user?.photo || userImg}
								alt="profile"
								className="cursor-pointer w-12 h-8 rounded-full object-cover aspect-square border border-gray-300"
								onClick={() =>
									setShowLogoutBox((prev) => !prev)
								}
							/>

							{showLogoutBox && (
								<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
									<button
										className="flex items-center gap-10 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
										onClick={handleLogout}
									>
										Logout
										<FiLogOut />
									</button>
									<button
										className="block w-full text-left px-4 py-2 hover:bg-gray-100"
										onClick={() => setShowLogoutBox(false)}
									>
										Cancel
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				<section className="widgetContainer">
					<WidgetItem
						percent={stats.changePercent.revenue}
						amount={true}
						value={stats.counts.revenue}
						heading="Revenue"
						color="rgb(0,115,225)"
					/>
					<WidgetItem
						percent={stats.changePercent.users}
						amount={false}
						value={stats.counts.users}
						heading="Users"
						color="rgb(0,198,202)"
					/>
					<WidgetItem
						percent={stats.changePercent.orders}
						amount={false}
						value={stats.counts.orders}
						heading="Transactions"
						color="rgb(255,196,0)"
					/>
					<WidgetItem
						percent={stats.changePercent.products}
						amount={false}
						value={stats.counts.products}
						heading="Products"
						color="rgb(76,0,255)"
					/>
				</section>

				<section className="graphContainer">
					<div className="revenueChart">
						<h2>Revenue & Transaction</h2>
						{/* Graph here */}
						<BarChart
							data_2={stats.chart.orders.map((val) => val * 10)}
							data_1={stats.chart.revenue}
							title_1="Revenue"
							title_2="Transaction"
							bgColor_1="rgb(0,115,255)"
							bgColor_2="rgba(53,162,235,0.8)"
							// horizontal={true}
						/>
					</div>
					<div className="dashboardCategories">
						<h2>Inventory</h2>
						<div>
							{stats?.categoryCounts.map((i) => {
								const [heading, value] = Object.entries(i)[0];

								return (
									<CategoryItem
										key={heading}
										heading={heading}
										value={value}
										color={`hsl(${
											value * 3
										}, ${value}%, 50%)`}
									/>
								);
							})}
						</div>
					</div>
				</section>

				<section className="transactionContainer">
					<div className="genderChart">
						<h2>Gender Ratio</h2>

						<DoughnutChart
							labels={["Female", "Male"]}
							data={[
								stats.genderRatios.female,
								stats.genderRatios.male,
							]}
							backgroundColor={[
								"hsl(340,82%,56%)",
								"rgba(53,162,235,0.8)",
							]}
							// cutout={60}
							offset={[5, 5]}
						/>

						<p>
							<BiMaleFemale />
						</p>
					</div>
					<Table data={stats.latestTransactions} />
				</section>
			</main>
		</div>
	);
};

//Widget Items
interface WidgetItemProps {
    heading: string;
    value: number;
    percent: number;
    color: string;
    amount?: boolean;
}

const WidgetItem = ({
    heading,
    value,
    percent,
    color,
    amount,
}: WidgetItemProps) => (
    <article
        className='widget'
        style={{ borderLeft: `4px solid ${color}` }}
    >
        <div className='widgetInfo'>
            <p>{heading}</p>
            <h4>{amount ? `₹${value}` : value}</h4>
            {percent > 0 ? (
                <span className='green'>
                    <HiTrendingUp /> + {percent}%{''}
                </span>
            ) : (
                <span className='red'>
                    <HiTrendingDown /> {percent}%{''}
                </span>
            )}
        </div>
        <div
            className='widgetCircle'
            style={{
                background: `conic-gradient(
                  ${color} ${
                    (Math.abs(percent) / 100) * 360
                }deg, rgb(255,255,255) 0
                )`,
            }}
        >
            <span style={{ color }}>
                {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
                {percent < 0 && `${percent > -10000 ? -9999 : percent}%`}
            </span>
        </div>
    </article>
);

//Inventories
interface CategoryItemProps {
    color: string;
    value: number;
    heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
    <div className='categoryItem'>
        <h5>{heading}</h5>
        <div>
            <div
                style={{
                    backgroundColor: color,
                    width: `${value}%`,
                }}
            ></div>
        </div>
        <span>{value}%</span>
    </div>
);

export default Dashboard;
