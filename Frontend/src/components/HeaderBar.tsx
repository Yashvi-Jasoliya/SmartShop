import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import NotificationBell from "./admin/NotificationBell";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useStatsQuery } from "../redux/api/dashboardAPI";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { MdManageSearch } from "react-icons/md";

const HeaderBar = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { isError, error } = useStatsQuery(user?._id!);

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
		toast.error(err?.data?.message || "Something went wrong");
	}

	return (
		<div
			className="w-auto px-4 py-2 shadow-none"
			style={{
				backgroundColor: "rgb(247, 247, 247)",
				boxShadow: "0 2px 0px rgba(0, 0, 0, 0.1)",
			}}
		>
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-gray-400 p-2 text-lg font-semibold flex items-center gap-2">
						<MdManageSearch className="text-2xl text-gray-400" />
						Manage products, reviews, and users
					</h1>
				</div>

				<div className="flex justify-end items-center gap-4">
					{/* Notification Bell */}
					{user?._id && <NotificationBell userId={user._id} />}

					<div className="header-bar relative">
						<img
							src={user?.photo || user?.name}
							alt="User"
							className="cursor-pointer w-8 h-8 sm:w-7 sm:h-7 rounded-full object-cover border border-gray-300"
							onClick={() => setShowLogoutBox((prev) => !prev)}
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
		</div>
	);
};

export default HeaderBar;
